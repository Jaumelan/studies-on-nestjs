import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1930)
  @Max(2022)
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(999999)
  mileage: number;
}
