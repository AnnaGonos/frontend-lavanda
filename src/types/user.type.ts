export interface User {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: string;
    bonusPoints: number;
    bonusCardLevel: number;
    totalOrders: number;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    FLORIST = 'florist',
}
