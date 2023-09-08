import {IsNotEmpty, IsString} from "class-validator";

export class CreateCoinsDto {

  @IsString({message: 'Title must be a string'})
  @IsNotEmpty({message: 'Title must not be empty'})
  readonly title: string;

  @IsString({message: 'Price must be a string'})
  @IsNotEmpty({message: 'Price must not be empty'})
  readonly price: string;

  @IsString({message: 'percent must be a string'})
  @IsNotEmpty({message: 'percent must not be empty'})
  readonly percent: string;

  @IsString({message: 'progress must be a string'})
  @IsNotEmpty({message: 'progress must not be empty'})
  readonly progress: string;
}

