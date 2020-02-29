import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import Book from "../entity/Book";

@Entity()
export default class Author {

    public constructor(init?:Partial<Author>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        nullable: true
    })
    public firstName: string;

    @Column()
    public lastName: string;

    @ManyToMany(type => Book, book => book.authors)
    @JoinTable()
    public books: Book[];
}
