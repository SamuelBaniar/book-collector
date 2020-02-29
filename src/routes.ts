import BookController from "./controller/BookController";
import AuthorController from "./controller/AuthorController";

export const Routes = [{
    method: "get",
    route: "/authors",
    controller: AuthorController,
    action: "all"
}, {
    method: "get",
    route: "/authors/:id",
    controller: AuthorController,
    action: "one"
}, {
    method: "post",
    route: "/authors",
    controller: AuthorController,
    action: "save"
}, {
    method: "put",
    route: "/authors",
    controller: AuthorController,
    action: "update"
}, {
    method: "delete",
    route: "/authors/:id",
    controller: AuthorController,
    action: "remove"
}, {
    method: "get",
    route: "/books",
    controller: BookController,
    action: "all"
}, {
    method: "get",
    route: "/books/:id",
    controller: BookController,
    action: "one"
}, {
    method: "post",
    route: "/books",
    controller: BookController,
    action: "save"
}, {
    method: "put",
    route: "/books",
    controller: BookController,
    action: "update"
}, {
    method: "delete",
    route: "/books/:id",
    controller: BookController,
    action: "remove"
}];