
import React from 'react';

export interface User {
    id: number | string;
    name: string;
    email?: string;
    phone: string;
    status: 'Active' | 'Pending' | 'Inactive';
    activePackageName?: string | null;
    personalId?: string;
    address?: string;
    joinedDate?: string;
    tenantName?: string;
    tenantId?: string;
    isCorporate?: boolean;
    companyName?: string;
    // Guardian Info (for minors)
    guardianFirstName?: string;
    guardianLastName?: string;
    guardianPersonalId?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    guardianType?: 'parent' | 'guardian';
}

export interface Employee {
    id: number;
    fullName: string;
    firstName?: string;
    lastName?: string;
    position: string;
    department: string;
    phone: string;
    email: string;
    salary: string;
    status: 'Active' | 'OnLeave' | 'Inactive';
    joinDate: string;
}

export interface EmployeeWorkSummary {
    employeeId: number;
    fullName: string;
    position: string;
    totalHours: number;
    workingDays: number;
    lateCount: number;
    overtimeHours: number;
}

export interface Package {
    id: string;
    title: string;
    name?: string; // Some parts use name, some title
    price: number | string;
    duration: number; // days
    description?: string;
    features?: string;

    // Extended fields for library
    promotionTarget?: 'web' | 'mobile' | 'both' | 'none';
    durationMode?: 'unlimited' | 'limited';
    timeMode?: 'full' | 'custom';
    startTime?: string;
    endTime?: string;
    targetAge?: string;
    targetStatus?: string;
    maxParticipants?: number;
    benefits?: string[];
    type?: 'INDIVIDUAL' | 'GROUP' | 'CALENDAR';
}

export interface CorporateClient {
    id: string;
    name: string;
    identCode: string;
    discountPercentage: number;
    contactPerson: string;
    contactEmail: string;
    phone: string;
    activeEmployees: number;
    employeeFile?: string;
}

export interface VisitLog {
    id: number | string;
    userId: number;
    userName: string;
    time: string;
    type: 'ENTRY' | 'EXIT';
    status: 'ALLOWED' | 'DENIED';
}

export interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: React.ReactNode;
    color: string;
}

export interface MarketItem {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    image: string;
}
