import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Types } from "mongoose";

export class CreateComisionProductoDto {

    @IsString()
    @IsString()
      nombre: string;
    
        @IsNotEmpty()
        @IsNumber()
        @Min(0)
      monto: string;
    
        @IsMongoId()
        @IsNotEmpty()
      producto: Types.ObjectId;
}
