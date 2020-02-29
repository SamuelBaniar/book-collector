import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import Author from "../entity/Author";

@Entity()
export default class Book {

    public constructor(init?:Partial<Book>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public description: string;

    @ManyToMany(type => Author, author => author.books)
    public authors: Author[];
}
