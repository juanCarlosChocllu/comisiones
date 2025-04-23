import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Types } from "mongoose";

export class CreateMetasProductoVipDto {
    @IsArray()
    @ArrayMinSize(1)
    @Type(()=>MetaData )
    @ValidateNested({each:true})
    data:MetaData[]
}

class MetaData {
    
     @IsNumber()
     @IsNotEmpty()
     monturaMasGafa:number
  

  
      @IsNumber()
      @IsNotEmpty()
      lenteDeContacto:number
  
      @IsMongoId()
      @IsNotEmpty()
      sucursal:Types.ObjectId
}

