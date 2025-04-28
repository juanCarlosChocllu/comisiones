import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, usuariosSchema } from './schema/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Usuario.name,
          schema:usuariosSchema ,
        },
      ]
    ),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports:[UsuarioService]
})
export class UsuarioModule {}
