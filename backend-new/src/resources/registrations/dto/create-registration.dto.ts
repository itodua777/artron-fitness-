export class CreateRegistrationDto {
    name: string;
    identCode: string;
    legalAddress: string;
    country: string;
    city: string;
    actualAddress: string;
    directorFirstName: string;
    directorLastName: string;
    directorId: string;
    directorPhone: string;
    directorEmail: string;
    activityField: string;
    brandName: string;
    logo: string | null;
    interviewDate?: string;
    gmName?: string;
    gmId?: string;
    gmPhone?: string;
    gmEmail?: string;
}
