import Author from "../entity/Author";
import AuthorDTO from "../entityDTO/AuthorDTO";

export default interface IAuthorService {
     delete(id : string | number) : Promise<void>;
     getAll() : Promise<Author[]>;
     getById(id: string | number) : Promise<Author>;
     insert(author : AuthorDTO) : Promise<AuthorDTO>;
     update(author : AuthorDTO) : Promise<AuthorDTO>;
}