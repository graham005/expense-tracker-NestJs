import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    report_id: number;

    @Column('date')
    start_date: string;

    @Column('date')
    end_date: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    generated_at: Date;
}
