import {IsString, Length, ValidateNested, IsOptional, IsNumber} from "class-validator";
import BookDTO from "../entityDTO/BookDTO";
import { Type } from "class-transformer";

export default class AuthorDTO {

    public constructor(init?:Partial<AuthorDTO>) {
        Object.assign(this, init);
    }

    @IsOptional()
    @IsNumber()
    public id: number;

    @IsOptional()
    @IsString()
    public firstName: string;

    @IsString()
    @Length(1,50)
    public lastName: string;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => BookDTO)
    public books: BookDTO[];
}