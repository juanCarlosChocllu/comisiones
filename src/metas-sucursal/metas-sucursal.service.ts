import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMetasSucursalDto } from './dto/create-metas-sucursal.dto';
import { UpdateMetasSucursalDto } from './dto/update-metas-sucursal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MetasSucursal } from './schema/metasSucursalSchema';
import { Model, Types } from 'mongoose';
import { SucursalService } from 'src/sucursal/sucursal.service';

@Injectable()
export class MetasSucursalService {
  constructor(
    @InjectModel(MetasSucursal.name)
    private readonly metasSucursal: Model<MetasSucursal>,
    private readonly sucursalService: SucursalService,
  ) {}

  async create(createMetasSucursalDto: CreateMetasSucursalDto) {
    const sucursales = await this.sucursalService.listarSucursalPorNombre(
      createMetasSucursalDto.sucursal,
    );
    for (const data of sucursales) {
      const meta = await this.metasSucursal.create({
        codigo: createMetasSucursalDto.codigo,
        ticket: createMetasSucursalDto.ticket,
        fechaFin: createMetasSucursalDto.fechaFin,
        fechaInicio: createMetasSucursalDto.fechaInicio,
        monto: createMetasSucursalDto.monto,
        dias: createMetasSucursalDto.dias,
        sucursal: data._id,
      });
    }
    return { status: HttpStatus.OK };
  }

  findAll() {
    return `This action returns all metasSucursal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metasSucursal`;
  }

  update(id: number, updateMetasSucursalDto: UpdateMetasSucursalDto) {
    return `This action updates a #${id} metasSucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} metasSucursal`;
  }
}
