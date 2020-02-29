import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { QueryRunner } from "typeorm";
import ApiException from "../exceptions/ApiException";
import IBookService from "../service/IBookService";
import BookService from "../service/BookService";
import Book from "../entity/Book";
import BookDTO from "../entityDTO/BookDTO";
import AuthorService from "../service/AuthorService";
import Author from "../entity/Author";
import EntityValidatorService from "../service/EntityValidatorService";

export default class BookController {

    private readonly bookService: IBookService;

    constructor(dbContext: QueryRunner) {
        const validator = new EntityValidatorService();
        this.bookService = new BookService(
            dbContext, 
            dbContext.manager.getRepository(Book), 
            new AuthorService(dbContext.manager.getRepository(Author), validator),
            validator);
    }

    public async all(request: Request, response: Response, next: NextFunction) {
        response.send(await this.bookService.getAll());
    }

    public async one(request: Request, response: Response, next: NextFunction) {
        try {
            const book = await this.bookService.getById(request.params.id);

            if (!book) {
                throw new ApiException('Book not found', 404);
            }

            response.send(book);
        } catch (error) {
            next(error);
        }
    }

    public async update(request: Request, response: Response, next: NextFunction) {
        let bookToSave = plainToClass(BookDTO, request.body);
        
        try {
            response.send(await this.bookService.update(bookToSave));
        } catch (error) {
            next(error);
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let bookToSave = plainToClass(BookDTO, request.body);
        
        try {
            response.send(await this.bookService.insert(bookToSave));
        } catch (error) {
            next(error);
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            await this.bookService.delete(request.params.id)
            response.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }
}