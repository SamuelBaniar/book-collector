import "reflect-metadata";
import 'dotenv/config';
import { Request, Response } from "express";
import { Routes } from "./routes";
import { cleanEnv, port } from 'envalid';
import { createConnection } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import errorHandler from './middleware/errorHandler';

cleanEnv(process.env, {
    API_PORT: port()
});

const {
    API_PORT
} = process.env;

createConnection().then(async connection => {

    const app = express();
    
    // setup middleware
    app.use(bodyParser.json());
    app.use(errorHandler);

    // setup context
    const dbContext = connection.createQueryRunner();

    // setup API routes
    Routes.forEach(route => {
        app[route.method](route.route, (req: Request, res: Response, next: Function) => {
            (new route.controller(dbContext))[route.action](req, res, next);
        });
    });

    app.listen(API_PORT);
    console.log('Express server is listening on port ' + API_PORT);

}).catch(error => console.log(error));