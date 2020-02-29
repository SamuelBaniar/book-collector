import { QueryRunner } from "typeorm";
import BookDTO from "../entityDTO/BookDTO";
import ApiException from "../exceptions/ApiException";
import IBookService from "./IBookService";
import IAuthorService from "./IAuthorService";
import BookRepository from "../repository/BookRepository";
import EntityValidatorService from "./EntityValidatorService";

export default class BookService implements IBookService {

    private readonly authorService: IAuthorService;
    private readonly dbContext: QueryRunner;
    private readonly bookRepository: BookRepository;
    private readonly entityValidatorService: EntityValidatorService;

    constructor(
        dbContext: QueryRunner,
        bookRepository: BookRepository,
        authorService: IAuthorService,
        entityValidatorService: EntityValidatorService) {
        
        this.authorService = authorService;
        this.dbContext = dbContext;
        this.bookRepository = bookRepository;
        this.entityValidatorService = entityValidatorService;
    }

    public async delete(id: number | string) {
        let bookToRemove = await this.getById(id);
        
        try {
            await this.bookRepository.remove(bookToRemove);
        }
        catch (error) {
            throw new ApiException('Couldn\'t remove book');
        }
    }

    public async getAll() {
        return await this.bookRepository.find({relations: ["authors"]});
    }

    public async getById(id: string | number) {
        if (typeof(id) === 'string') {
            id = parseInt(id);
        }

        if (isNaN(id)) {
            throw new ApiException('Wrong ID provided');
        }

        return await this.bookRepository.findOne(id);
    }

    public async insert(bookToInsert: BookDTO) {
        if (bookToInsert.id && await this.getById(bookToInsert.id)) {
            throw new ApiException("ID already exists");
        }

        const validationOutput = await this.entityValidatorService.validateEntity(bookToInsert);
        if (!validationOutput.success) {
            throw new ApiException(validationOutput.message);
        }

        return this.saveBook(bookToInsert);
    }

    public async update(bookToUpdate: BookDTO) {
        if (!bookToUpdate.id) {
            throw new ApiException("Invalid ID");
        }

        if (!await this.getById(bookToUpdate.id)) {
            throw new ApiException("Book not found");
        }

        const validationOutput = await this.entityValidatorService.validateEntity(bookToUpdate);
        if (!validationOutput.success) {
            throw new ApiException(validationOutput.message);
        }

        return await this.saveBook(bookToUpdate);
    }

    private async saveBook(book: BookDTO) {
        await this.dbContext.startTransaction();
        try {
            for (const author of book.authors) {
                if (author.id && await this.authorService.getById(author.id)) {
                    await this.authorService.update(author);
                }
                else {
                    await this.authorService.insert(author);
                }
            }
            
            let savedBook = await this.bookRepository.save(book);
            
            await this.dbContext.commitTransaction();
            return savedBook;
        } catch (error) {
            await this.dbContext.rollbackTransaction();
            throw new ApiException('Couldn\'t save the book');
        }
    }
}