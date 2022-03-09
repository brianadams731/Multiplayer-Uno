import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Example extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({nullable:false})
    createdAt: Date;

    @Column({nullable:false})
    testString:string;
}

export { Example };