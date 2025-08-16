import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateRendimientoDiarioDto {

    @IsNumber()
    @IsNotEmpty()
    antenciones:number

    @IsNumber()
    @IsNotEmpty()
    segundoPar:number
}
