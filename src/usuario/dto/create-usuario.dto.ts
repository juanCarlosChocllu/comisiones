import { IsString, IsStrongPassword, MaxLength, MinLength, IsArray, ArrayNotEmpty } from "class-validator";

export class CreateUsuarioDto {

    @IsString({ message: 'Nombre requerido.' })
    nombre: string;

    @IsString({ message: 'Apellidos requeridos.' })
    apellidos: string;

    @IsString({ message: 'Usuario requerido.' })
    @MinLength(4, { message: 'Mínimo 4 caracteres.' })
 
    username: string;

    @IsString({ message: 'Contraseña requerida.' })
    @MinLength(8, { message: 'Mínimo 8 caracteres.' })
  
    @IsStrongPassword({}, { 
        message: 'Incluir mayúsculas, minúsculas, números y símbolos.' 
    })
    password: string;

    @IsString({ message: 'Rol requerido.' })
    rol: string;


}