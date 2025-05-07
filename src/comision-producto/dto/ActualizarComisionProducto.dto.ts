import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { Types } from "mongoose";

export class ActualizarProductoComisionDto {
      @IsMongoId()
      @IsNotEmpty()
      idComision: Types.ObjectId;
      @IsNumber()
      @IsNotEmpty()
      monto: number;
}