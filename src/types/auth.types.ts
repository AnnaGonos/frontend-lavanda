import {User} from "./user.type";

export type LoginCredentials = {
    phone: string;
    password: string;
};

export type RegisterCredentials = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
};

export type AuthResponse = {
    accessToken: string;
    user: User;
};


