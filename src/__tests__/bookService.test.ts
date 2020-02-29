import { Mock, It, Times } from "typemoq";
import { QueryRunner } from "typeorm";
import BookService from "../service/BookService";
import IAuthorService from "../service/IAuthorService";
import Book from "../entity/Book";
import BookRepository from "../repository/BookRepository";
import ApiException from "../exceptions/ApiException";
import BookDTO from "../entityDTO/BookDTO";
import EntityValidatorService from "../service/EntityValidatorService";

const fakeBooks: Book[] = [
    new Book({ id: 1, title: 'first book', description: 'description1' }),
    new Book({ id: 2, title: 'second book', description: 'description2' })
];

describe('Book Service', () => {
    const dbContextMock = Mock.ofType<QueryRunner>();
    const bookRepoMock = Mock.ofType(BookRepository);
    const authorServiceMock =Mock.ofType<IAuthorService>();
    const entityValidatorService = Mock.ofType(EntityValidatorService);

    const bookService = new BookService(
        dbContextMock.object, 
        bookRepoMock.object, 
        authorServiceMock.object,
        entityValidatorService.object
    );
    
    describe('getAll', () => {
      it('should return all books', async () => {
            bookRepoMock.setup(r => r.find(It.isAny())).returns(() => Promise.resolve(fakeBooks));

            expect(await bookService.getAll()).toEqual(fakeBooks);
        });
    });

    describe('getById', () => {
        bookRepoMock
            .setup(r => r.findOne(fakeBooks[0].id))
            .returns(() => Promise.resolve(fakeBooks[0]));
        bookRepoMock
            .setup(r => r.findOne(fakeBooks[0].id.toString()))
            .returns(() => Promise.resolve(fakeBooks[0]));

        describe('invalid id provided', () => {
          it('should throw exception', async () => {
                const invalidId = "not a number";

                expect.assertions(2);
                try {
                    await bookService.getById(invalidId);
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiException);
                    expect(error).toHaveProperty('message', 'Wrong ID provided');
                }
            });
        });

        describe('valid id:number provided', () => {
          it('should return correct book', async () => {
                const validID: number = fakeBooks[0].id;

                expect(await bookService.getById(validID)).toEqual(fakeBooks[0]);
            });
      });

        describe('valid id:string provided', () => {
            it('should return correct book', async () => {
                const validID: string = fakeBooks[0].id.toString();

                expect(await bookService.getById(validID)).toEqual(fakeBooks[0]);
            });
        });
    });

    describe('delete', () => {
        describe('book does not exist', () => {
            it('should throw exception', async () => {
                const notExistingBookId = 999;

                bookRepoMock.setup(r => r.remove(undefined)).throws(new Error());

                expect.assertions(2);
                try {
                    await bookService.delete(notExistingBookId);
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiException);
                    expect(error).toHaveProperty('message','Couldn\'t remove book');
                }
            });
        });

        describe('book exists', () => {
            it('does not throw', async () => {
                const validIdToDelete = fakeBooks[0].id;

                bookRepoMock
                    .setup(r => r.findOne(validIdToDelete))
                    .returns(() => Promise.resolve(fakeBooks[0]));
                bookRepoMock
                    .setup(r => r.remove(It.is<Book>(a => a.id !== validIdToDelete)))
                    .throws(new Error());

                await bookService.delete(validIdToDelete);

                bookRepoMock.verify(r => r.remove(fakeBooks[0]), Times.once());
            });
        });
    });

    describe('insert', () => {
        describe('book with the ID already exists', () => {
            it('should throw exception', async () => {
                const existingId = fakeBooks[0].id;

                bookRepoMock
                    .setup(r => r.findOne(existingId))
                    .returns(() => Promise.resolve(fakeBooks[0]));
                
                expect.assertions(2);
                try {
                    await bookService.insert(fakeBooks[0]);
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiException);
                    expect(error).toHaveProperty('message','ID already exists');
                }
            });
        });
  
        describe('book does not exist', () => {
            let newBook: BookDTO;

            beforeEach(() => {
                newBook = {
                    id: undefined,
                    title: 'not existing book',
                    description : 'not existing book desc',
                    authors: [
                        { id: 1, firstName: 'existing author', lastName: 'existing author', books: [] },
                        { id: 2, firstName: 'new author', lastName: 'new author', books: [] }
                    ]
                }
            });

            describe('entity validation fails', () => {
                it('throws exception', async () => {
                    const errorMsg = "valdidation error msg";

                    entityValidatorService.setup(v => v.validateEntity(newBook)).returns(() => Promise.resolve({ success: false, message: errorMsg }));
                    
                    expect.assertions(2);
                    try {
                        await bookService.insert(newBook);
                    } catch (error) {
                        expect(error).toBeInstanceOf(ApiException);
                        expect(error).toHaveProperty('message', errorMsg);
                    }
                });
            });

            describe('validation passes', () => {
                it('inserts new book authors and updates existing authors', async () => {
                    entityValidatorService.setup(v => v.validateEntity(newBook)).returns(() => Promise.resolve({ success: true }));
                    authorServiceMock.setup(a => a.getById(newBook.authors[1].id)).returns(() => Promise.resolve(null));
                    authorServiceMock.setup(a => a.getById(newBook.authors[0].id)).returns(() => Promise.resolve(newBook.authors[0]));
                    
                    await bookService.insert(newBook);

                    authorServiceMock.verify(a => a.insert(newBook.authors[1]), Times.once());
                    authorServiceMock.verify(a => a.update(newBook.authors[0]), Times.once());
                });

                it('saves the book', async () => {
                    bookRepoMock.verify(r => r.save(newBook), Times.once());
                });
            });
          });
    });

    describe('update', () => {
        describe('bood ID not provided', () => {
            it('should throw exception', async () => {
                expect.assertions(2);
                try {
                    await bookService.update(new Book({ id: undefined }));
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiException);
                    expect(error).toHaveProperty('message','Invalid ID');
                }
            });
        });

        describe('book does not exist', () => {
            it('should throw exception', async () => {
                const notExistingId = 2;

                bookRepoMock.setup(r => r.findOne(notExistingId)).returns(() => Promise.resolve(null));

                expect.assertions(2);
                try {
                    await bookService.update(new Book({ id: notExistingId }));
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiException);
                    expect(error).toHaveProperty('message','Book not found');
                }
            });
        });

        describe('valid book', () => {
            const bookToUpdate = new BookDTO({
                id: 5,
                title: 'not existing book',
                description : 'not existing book desc',
                authors: [
                    { id: 6, firstName: 'existing author', lastName: 'existing author', books: [] },
                    { id: 7, firstName: 'new author', lastName: 'new author', books: [] }
                ]
            });

            describe('entity validation fails', () => {
                it('throws exception', async () => {
                    const errorMsg = "valdidation error msg";

                    bookRepoMock.setup(r => r.findOne(bookToUpdate.id)).returns(() => Promise.resolve(bookToUpdate));
                    entityValidatorService.setup(v => v.validateEntity(bookToUpdate)).returns(() => Promise.resolve({ success: false, message: errorMsg }));
                    
                    expect.assertions(2);
                    try {
                        await bookService.update(bookToUpdate);
                    } catch (error) {
                        expect(error).toBeInstanceOf(ApiException);
                        expect(error).toHaveProperty('message', errorMsg);
                    }
                });
            });

            describe('validation passes', () => {
                it('inserts new book authors and updates existing authors', async () => {
                    bookRepoMock.reset();
                    bookRepoMock.setup(r => r.findOne(bookToUpdate.id)).returns(() => Promise.resolve(bookToUpdate));
                    entityValidatorService.setup(v => v.validateEntity(bookToUpdate)).returns(() => Promise.resolve({ success: true }));
                    authorServiceMock.setup(a => a.getById(bookToUpdate.authors[1].id)).returns(() => Promise.resolve(null));
                    authorServiceMock.setup(a => a.getById(bookToUpdate.authors[0].id)).returns(() => Promise.resolve(bookToUpdate.authors[0]));
                    
                    await bookService.update(bookToUpdate);

                    authorServiceMock.verify(a => a.insert(bookToUpdate.authors[1]), Times.once());
                    authorServiceMock.verify(a => a.update(bookToUpdate.authors[0]), Times.once());
                });

                it('saves the book', async () => {
                    bookRepoMock.verify(r => r.save(bookToUpdate), Times.once());
                });
            });
          });
    });
});