import Book from "../entity/Book";
import BookDTO from "../entityDTO/BookDTO";

export default interface IBookService {
     delete(id : string | number) : Promise<void>;
     getAll() : Promise<Book[]>;
     getById(id: string | number) : Promise<Book>;
     insert(book : BookDTO) : Promise<BookDTO>;
     update(book : BookDTO) : Promise<BookDTO>;
}