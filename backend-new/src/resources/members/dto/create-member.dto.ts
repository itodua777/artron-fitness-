export class CreateMemberDto {
    name: string;
    branchId: string;
    email?: string;
    phone?: string;
    personalId?: string;
    citizenship?: string;
    passportNumber?: string;
    address?: string;
    photo?: string;

    // Status
    status?: string;
    joinedDate?: string;

    // Corporate
    isCorporate?: boolean;
    companyName?: string;
    groupId?: string;
    groupType?: string;

    // Guardian
    guardianFirstName?: string;
    guardianLastName?: string;
    guardianPersonalId?: string;
    guardianPhone?: string;

    // Access
    accessMobile?: boolean;
    accessBracelet?: boolean;
    accessCard?: boolean;
    braceletCode?: string;
    cardCode?: string;

    // Medical
    healthCert?: string;
    birthCert?: string;
    bloodGroup?: string;
    isPwd?: boolean;
    clothingSize?: string;
    source?: string;
}
