export class User {
    user_id: number;
    username: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER';
    created_at: Date;
    updated_at: Date;
}
