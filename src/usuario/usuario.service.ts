import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schema/usuario.schema';
import { Model, Types } from 'mongoose';
import * as argon2 from 'argon2';
import { flag } from 'src/core/enum/flag';
import { AsesorService } from 'src/asesor/asesor.service';
import { Request } from 'express';
@Injectable()
export class UsuarioService {
  private readonly opcionesArgon2: argon2.Options = {
    type: argon2.argon2id,
    timeCost: 6,
    memoryCost: 2 ** 16,
    parallelism: 1,
    hashLength: 50,
  };
  constructor(
    @InjectModel(Usuario.name) private readonly usuario: Model<Usuario>,
    private readonly asesorService: AsesorService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const username = await this.usuario.findOne({
      username: createUsuarioDto.username,
      flag: flag.nuevo,
    });
    if (username) {
      throw new ConflictException('El usuario ya existe ');
    }
    createUsuarioDto.password = await argon2.hash(
      createUsuarioDto.password,
      this.opcionesArgon2,
    );
    const usuario = await this.usuario.create(createUsuarioDto);
    if (createUsuarioDto.asesor && createUsuarioDto.asesor.length > 0) {
      for (const asesor of createUsuarioDto.asesor) {
        await this.asesorService.asignarUsuarioAsesor(asesor, usuario._id);
      }
    }
    return { status: HttpStatus.CREATED };
  }

  async buscarUsuaurio(username: string) {
    const usuario = await this.usuario
      .findOne({ username: username, flag: flag.nuevo })
      .select('+password');
    return usuario;
  }
  async buscarUsuarioPorId(id: Types.ObjectId) {
    const usuario = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    return usuario;
  }
  async listarusuarios() {
    const usuario = await this.usuario.find();
    return usuario;
  }

  async findOne(id: Types.ObjectId) {
    const usuario = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!usuario) {
      throw new NotFoundException();
    }
    return usuario;
  }

  async actulizar(id: Types.ObjectId, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!usuario) {
      throw new NotFoundException();
    }
    await this.usuario.updateOne(
      { _id: new Types.ObjectId(id) },
      updateUsuarioDto,
    );
    return { status: HttpStatus.OK };
  }

  async softDelete(id: Types.ObjectId) {
    const usuario = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: flag.nuevo,
    });
    if (!usuario) {
      throw new NotFoundException();
    }
    await this.usuario.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: flag.eliminado },
    );
    return { status: HttpStatus.OK };
  }

  async asignarSucursalAusuario(asesor: Types.ObjectId, request: Request) {
    const asesorEncontrado = await this.asesorService.verificarAsesor(asesor, request.usuario.idUsuario);
    if (!asesorEncontrado) {
      throw new NotFoundException('asesor no encontrado');
    }
    await this.usuario.updateOne(
      { _id: new Types.ObjectId(request.usuario.idUsuario) },
      { asesor: new Types.ObjectId(asesor) },
    );
    return { status: HttpStatus.OK };
  }
}
