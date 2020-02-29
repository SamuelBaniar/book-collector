import { Repository } from "typeorm";
import Book from "../entity/Book";

export default class BookRepository extends Repository<Book>{
}