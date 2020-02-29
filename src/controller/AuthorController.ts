import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { QueryRunner } from "typeorm";
import ApiException from "../exceptions/ApiException";
import IAuthorService from "../service/IAuthorService";
import AuthorService from "../service/AuthorService";
import Author from "../entity/Author";
import AuthorDTO from "../entityDTO/AuthorDTO";
import EntityValidatorService from "../service/EntityValidatorService";

export default class AuthorController {

    private readonly authorService : IAuthorService;

    constructor(dbContext: QueryRunner) {
        this.authorService = new AuthorService(dbContext.manager.getRepository(Author), new EntityValidatorService());
    }

    public async all(request: Request, response: Response, next: NextFunction) {
        response.send(await this.authorService.getAll());
    }

    public async one(request: Request, response: Response, next: NextFunction) {
        try {
            const author = await this.authorService.getById(request.params.id);

            if (!author) {
                throw new ApiException('Author not found', 404);
            }

            response.send(author);
        } catch (error) {
            next(error);
        }
    }

    public async update(request: Request, response: Response, next: NextFunction) {
        let authorToSave = plainToClass(AuthorDTO, request.body);
        
        try {
            response.send(await this.authorService.update(authorToSave));
        } catch (error) {
            next(error);
        }
    }

    public async save(request: Request, response: Response, next: NextFunction) {
        let authorToInsert = plainToClass(AuthorDTO, request.body);
        
        try {
            response.send(await this.authorService.insert(authorToInsert));
        } catch (error) {
            next(error);
        }
    }

    public async remove(request: Request, response: Response, next: NextFunction) {
        try {
            await this.authorService.delete(request.params.id)
            response.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }
}