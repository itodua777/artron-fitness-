export class CreatePassDto {
    title: string;
    price: number;
    duration: number; // in days
    branchId: string;

    description?: string;
    features?: string;
    active?: boolean;

    // Type & Schedule
    type?: string;        // INDIVIDUAL, GROUP, CALENDAR, MIXED
    timeMode?: string;    // full, custom
    startTime?: string;
    endTime?: string;
    days?: string[];      // ["Mon", "Wed"]

    // Restrictions
    maxParticipants?: number;
    targetAge?: string;
    targetStatus?: string;
}
