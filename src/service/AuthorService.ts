import AuthorDTO from "../entityDTO/AuthorDTO";
import ApiException from "../exceptions/ApiException";
import IAuthorService from "../service/IAuthorService";
import AuthorRepository from "../repository/AuthorRepository";
import EntityValidatorService from "./EntityValidatorService";

export default class AuthorService implements IAuthorService {

    private readonly authorRepository: AuthorRepository;
    private readonly entityValidatorService: EntityValidatorService;

    constructor(authorRepository: AuthorRepository, entityValidatorService: EntityValidatorService) {

        this.authorRepository = authorRepository;
        this.entityValidatorService = entityValidatorService;
    }

    public async delete(id: number | string) {
        let authorToRemove = await this.getById(id);
        
        try {
            await this.authorRepository.remove(authorToRemove);
        }
        catch (error) {
            throw new ApiException('Couldn\'t remove author');
        }
    }

    public async getAll() {
        return await this.authorRepository.find({relations: ["books"]});
    }

    public async getById(id: string | number) {
        if (typeof(id) === 'string') {
            id = parseInt(id);
        }

        if (isNaN(id)) {
            throw new ApiException('Wrong ID provided');
        }

        return await this.authorRepository.findOne(id);
    }

    public async insert(authorToInsert: AuthorDTO) {
        if (authorToInsert.id && await this.getById(authorToInsert.id)) {
            throw new ApiException("ID already exists");
        }

        const validationOutput = await this.entityValidatorService.validateEntity(authorToInsert);
        if (!validationOutput.success) {
            throw new ApiException(validationOutput.message);
        }

        try {
            return await this.authorRepository.save(authorToInsert);
        } catch (error) {
            throw new ApiException('Couldn\'t insert author');
        }
    }

    public async update(authorToUpdate: AuthorDTO) {
        if (!authorToUpdate.id) {
            throw new ApiException("Invalid ID");
        }

        if (!await this.getById(authorToUpdate.id)) {
            throw new ApiException("Author not found");
        }

        const validationOutput = await this.entityValidatorService.validateEntity(authorToUpdate);
        if (!validationOutput.success) {
            throw new ApiException(validationOutput.message);
        }

        try {
            return await this.authorRepository.save(authorToUpdate);
        } catch (error) {
            throw new ApiException('Couldn\'t update author');
        }
    }
}