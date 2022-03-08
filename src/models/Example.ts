import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Example extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    exampleField: string;
}

export { Example };