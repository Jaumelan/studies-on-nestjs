import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @Transform(({ obj }) => parseInt(obj.year, 10))
  @IsNumber()
  @IsNotEmpty()
  @Min(1930)
  @Max(2022)
  year: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @Min(0)
  @Max(999999)
  mileage: number;
}
