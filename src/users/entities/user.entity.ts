import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../dto/create-user.dto";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['ADMIN', 'USER'],
        default: 'USER',
    })
    role: Role;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updated_at: Date;
}
