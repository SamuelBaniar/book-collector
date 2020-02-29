import { Mock, It } from "typemoq";
import AuthorService from "../service/AuthorService";
import Author from "../entity/Author";
import AuthorRepository from "../repository/AuthorRepository";
import ApiException from "../exceptions/ApiException";
import EntityValidatorService from "../service/EntityValidatorService";

const fakeAuthors: Author[] = [
    new Author({ id: 1, firstName: 'first author name', lastName: 'first author surname' }),
    new Author({ id: 2, firstName: 'second author name', lastName: 'second author surname' })
];

describe('Author Service', () => {
    const authorRepoMock = Mock.ofType(AuthorRepository);
    const entityValidatorService = Mock.ofType(EntityValidatorService);

    const authorService = new AuthorService(authorRepoMock.object, entityValidatorService.object);
    
    describe('getAll', () => {
      it('should return all authors', async () => {
        authorRepoMock.setup(r => r.find(It.isAny())).returns(() => Promise.resolve(fakeAuthors));

        expect(await authorService.getAll()).toEqual(fakeAuthors);
      });
    });

    describe('getById', () => {
      authorRepoMock
        .setup(r => r.findOne(fakeAuthors[0].id))
        .returns(() => Promise.resolve(fakeAuthors[0]));
      authorRepoMock
        .setup(r => r.findOne(fakeAuthors[0].id.toString()))
        .returns(() => Promise.resolve(fakeAuthors[0]));

      describe('invalid id provided', () => {
        it('should throw exception', async () => {
          const invalidId = "not a number";

          expect.assertions(2);
          try {
            await authorService.getById("asdasd");
          } catch (error) {
            expect(error).toBeInstanceOf(ApiException);
            expect(error).toHaveProperty('message', 'Wrong ID provided');
          }
        });
      });

      describe('valid id:number provided', () => {
        it('should return correct author', async () => {
          const validID: number = fakeAuthors[0].id;

          expect(await authorService.getById(validID)).toEqual(fakeAuthors[0]);
        });
      });

      describe('valid id:string provided', () => {
        it('should return correct author', async () => {
          const validID: string = fakeAuthors[0].id.toString();

          expect(await authorService.getById(validID)).toEqual(fakeAuthors[0]);
        });
      });
    });

    describe('delete', () => {
      describe('author does not exist', () => {
        it('should throw exception', async () => {
            const notExistingAuthorId = 999;

            authorRepoMock.setup(r => r.remove(undefined)).throws(new Error());

            try {
              await authorService.delete(notExistingAuthorId);
            } catch (error) {
              expect(error).toBeInstanceOf(ApiException);
              expect(error).toHaveProperty('message','Couldn\'t remove author');
            }
        });
      });

      describe('author exists', () => {
        it('does not throw', async () => {
            const validIdToDelete = fakeAuthors[0].id;

            authorRepoMock
              .setup(r => r.findOne(validIdToDelete))
              .returns(() => Promise.resolve(fakeAuthors[0]));
            authorRepoMock
              .setup(r => r.remove(It.is<Author>(a => a.id !== validIdToDelete)))
              .throws(new Error());

            await authorService.delete(validIdToDelete);
        });
      });
    });
  });