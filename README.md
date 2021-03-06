<p align="center">
  Simple REST api app for collection of books
</p>

## Tech stack

**Typescript** - _why_: expected to be used :)  
**MySQL** - _why_: widely used with great support (also wanted to try a new tech)  
**Express** - _why_: widely used with lot of documentation  
**TypeORM** - _why_: widely used, very simple to setup  
**Jest** - _why_: widely used, lot of documentation, support, easy to setup and run  
**TypeMoq** - _why_: mocking framework which is very similar to .net Moq - powerfull yet readable  

**dotenv** - _why_: to store environment varialbes in separate file whic is not commited  
**envalid** - _why_: to valided in compile time if all env variables were provided to run app  

**class-transformer** - _why_: to parse JSON object from API to typescript classes  
**class-validator** - _why_: to verify types and data of classes (parsed by _class-transformer_)  

## Installation

```bash
npm install
```

## Running

```bash
npm run start
```

## Testing

```bash
npm run test
```

## TODO

- store mysql config data in .env
- dependency injection
- integration tests

## Usage
**Examples**:  
Get all books:  
**GET** localhost:port/books/  

Get book by ID:  
**GET** localhost:port/books/_id_  

Create book:  
**POST** localhost:port/books/  
body:  
```json
{
    "title": "First Book",
    "description": "Our first inserted book",
    "authors": [
        {
            "firstName": "Johnny",
            "lastName": "Cash"
        },
        {
            "firstName": "June",
            "lastName": "Carter"
        }
    ]
}
```

Update book:  
**PUT** localhost:port/books/  
body:  
```json
{
    "id": 1,
    "title": "First Book",
    "description": "Our first updated book",
    "authors": [
        {
            "id": 1,
            "firstName": "Johnny",
            "lastName": "Cash"
        },
        {
            "id": 2,
            "firstName": "June",
            "lastName": "Carter Cash"
        }
    ]
}
```

Delete book by ID:  
**DELETE** localhost:port/books/_id_  

Get all authors:  
**GET** localhost:port/authors/  

Get author by ID:  
**GET** localhost:port/authors/_id_  

Create author:  
**POST** localhost:port/authors/  
body:  
```json
{
    "firstName": "William",
    "lastName": "Shakespeare"
}
```

Update author:  
**PUT** localhost:port/authors/  
body:  
```json
{
    "id": 3,
    "firstName": "William",
    "lastName": "Shakespeare"
}
```

Delete author by ID:  
**DELETE** localhost:port/authors/_id_  
