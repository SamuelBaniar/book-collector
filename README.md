<p align="center">
  Simple REST api app for Slido
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

**First** create **.env** file that contains **API_PORT=_yourNumber_** where _yourNumber_ represents on which port will the app listen.
(it's present here, but not commited normally)

Then run:
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
