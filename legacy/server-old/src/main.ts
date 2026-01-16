import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// --- Multi-Tenant Middleware Helper ---
// In a real app, this would be a proper middleware setting req.tenantId
const getTenantId = async (req: express.Request): Promise<string | null> => {
    const tenantIdHeader = req.headers['x-tenant-id'] as string;

    // If specific tenant requested, use it
    if (tenantIdHeader) return tenantIdHeader;

    // Fallback for demo: Return the ID of the first tenant (Default Gym)
    const defaultTenant = await prisma.tenant.findFirst({ orderBy: { createdAt: 'asc' } });
    return defaultTenant?.id || null;
};

// --- SEEDING & SETUP ---
const ensureSeedData = async () => {
    const count = await prisma.tenant.count();
    if (count === 0) {
        console.log("Seeding initial tenants...");

        // Tenant 1: Pixl Fitness (The one currently in UI)
        const tenant1 = await prisma.tenant.create({
            data: {
                name: "Pixl Fitness",
                brandName: "Pixl Fitness",
                address: "Tbilisi, Chavchavadze Ave.",
                contactEmail: "info@pixl.ge",
                passes: {
                    create: [
                        { title: '1 თვიანი შეუზღუდავი', price: 120, duration: 30, description: 'ულიმიტო ვიზიტები 1 თვის განმავლობაში', features: 'ულიმიტო ვიზიტები,უფასო პირსახოცი,საუნა' },
                        { title: '3 თვიანი აბონემენტი', price: 300, duration: 90, description: 'სპეციალური ფასი 3 თვზე', features: 'ყველა ზონა,უფასო პარკინგი' },
                    ]
                }
            }
        });

        // Tenant 2: Iron Gym (Another gym to demonstrate SaaS)
        const tenant2 = await prisma.tenant.create({
            data: {
                name: "Iron Gym",
                brandName: "Iron Gym",
                address: "Batumi, Rustaveli St.",
                contactEmail: "contact@iron.ge",
                passes: {
                    create: [
                        { title: 'Day Pass', price: 20, duration: 1, description: 'Single entry', features: 'Gym access' },
                        { title: 'Yearly VIP', price: 800, duration: 365, description: 'Full Access', features: 'All inclusive' },
                    ]
                }
            }
        });

        console.log(`Created tenants: ${tenant1.name} (${tenant1.id}), ${tenant2.name} (${tenant2.id})`);
    }
};

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// GET Tenants (For testing/switching)
app.get('/api/tenants', async (req, res) => {
    const tenants = await prisma.tenant.findMany();
    res.json(tenants);
});

// Create Lead
app.post('/api/leads', async (req, res) => {
    try {
        const { email, source } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        const lead = await prisma.lead.create({
            data: { email, source },
        });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

// Company Registration (SaaS Signup)
app.post('/api/registrations', async (req, res) => {
    try {
        const {
            brandName, activityField, name, legalAddress, identCode,
            directorName, directorId, gmName, gmEmail
        } = req.body;

        if (!brandName || !identCode || !gmEmail) {
            res.status(400).json({ error: 'Required fields missing' });
            return;
        }

        const registration = await prisma.companyRegistration.create({
            data: {
                brandName,
                activityField: activityField || '',
                companyName: name || '',
                legalAddress: legalAddress || '',
                identCode,
                directorName: directorName || '',
                directorId: directorId || '',
                gmName: gmName || '',
                gmEmail,
                status: 'PENDING'
            }
        });

        res.json({ success: true, data: registration });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: 'Failed to process registration' });
    }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true }
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, tenantId: user.tenantId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, tenantId: user.tenantId }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// --- MEMBER MANAGEMENT (Tenant Aware) ---

// GET Members
app.get('/api/members', async (req, res) => {
    try {
        const tenantId = await getTenantId(req);
        if (!tenantId) {
            return res.status(400).json({ error: "No Tenant Context Found" });
        }

        const members = await prisma.member.findMany({
            where: { tenantId },
            orderBy: { id: 'desc' }
        });

        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// POST Member Batch (For Group Registration)
app.post('/api/members/batch', async (req, res) => {
    try {
        const tenantId = await getTenantId(req);
        if (!tenantId) {
            return res.status(400).json({ error: "No Tenant Context Found" });
        }

        const { members, groupType } = req.body; // Expecting array of members and optional groupType

        if (!Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ error: "Members array is required" });
        }

        // Generate a shared Group ID if this is a group registration
        const groupId = members.length > 1 ? (Math.random().toString(36).substring(7)) : null;

        const createdMembers = await prisma.$transaction(
            members.map((m: any) => prisma.member.create({
                data: {
                    ...m,
                    tenantId,
                    groupId,
                    groupType: groupId ? groupType : null
                }
            }))
        );

        res.json(createdMembers);
    } catch (error) {
        console.error("Batch Create Error:", error);
        res.status(500).json({ error: 'Failed to create members batch' });
    }
});

// POST Member
app.post('/api/members', async (req, res) => {
    try {
        const tenantId = await getTenantId(req);
        if (!tenantId) {
            return res.status(400).json({ error: "No Tenant Context Found" });
        }

        const member = await prisma.member.create({
            data: {
                ...req.body,
                tenantId: tenantId
            }
        });
        res.json(member);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create member' });
    }
});

// --- Pass/Package Management (Tenant Aware) ---
app.get('/api/passes', async (req, res) => {
    try {
        const tenantId = await getTenantId(req);
        if (!tenantId) {
            return res.status(400).json({ error: "No Tenant Context Found" });
        }

        const passes = await prisma.pass.findMany({
            where: {
                active: true,
                tenantId: tenantId
            }
        });
        res.json(passes);
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ error: 'Failed to fetch passes' });
    }
});

app.post('/api/passes', async (req, res) => {
    try {
        const tenantId = await getTenantId(req);
        if (!tenantId) {
            return res.status(400).json({ error: "No Tenant Context Found" });
        }

        const { title, price, duration, description, features } = req.body;
        const pass = await prisma.pass.create({
            data: {
                title,
                price: parseFloat(price),
                duration: parseInt(duration),
                description,
                features,
                tenantId
            }
        });
        res.json(pass);
    } catch (error) {
        console.error('Error creating pass:', error);
        res.status(500).json({ error: 'Failed to create pass' });
    }
});

// Run Seed & Start Server
ensureSeedData().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
