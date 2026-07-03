export interface Customer {
    id?: string;
    name: string;
    lastName: string;
    age?: number;
    birthDate?: string | unknown;
    createdAt?: string | unknown;
}