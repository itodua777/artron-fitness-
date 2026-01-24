export class CreateRegistrationDto {
    name: string;
    identCode: string;
    legalAddress: string;
    actualAddress: string;
    directorName: string;
    directorId: string;
    directorPhone: string;
    directorEmail: string;
    activityField: string;
    brandName: string;
    logo: string | null;
    gmName?: string;
    gmId?: string;
    gmPhone?: string;
    gmEmail?: string;
}
