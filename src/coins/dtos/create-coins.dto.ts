import {IsNotEmpty, IsString} from "class-validator";

export class CreateCoinsDto {
  @IsString({message: 'Title must be a string'})
  @IsNotEmpty({message: 'Title must not be empty'})
  readonly title: string;

  @IsString({message: 'Value must be a string'})
  @IsNotEmpty({message: 'Value must not be empty'})
  readonly value: string;
}