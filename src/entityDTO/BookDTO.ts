import AuthorDTO from "../entityDTO/AuthorDTO";
import { IsString, Length, ValidateNested, ArrayNotEmpty, Allow, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export default class BookDTO {

    public constructor(init?:Partial<BookDTO>) {
        Object.assign(this, init);
    }

    @Allow()
    @IsOptional()
    public id: number;

    @IsString()
    @Length(1,50)
    public title: string;

    @IsString()
    @Length(1,50)
    public description: string;
    
    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(() => AuthorDTO)
    public authors: AuthorDTO[];
}