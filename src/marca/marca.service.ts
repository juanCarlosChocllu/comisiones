import { Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Marca } from './schema/marca.schema';
import { Model } from 'mongoose';
import { BuscadorMarcaDto } from './dto/BuscadorMarca.dto';
import { calcularPaginas, skip } from 'src/core/utils/paginador';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

@Injectable()
export class MarcaService {
  constructor(@InjectModel(Marca.name) private readonly marca: Model<Marca>) {}
  create(createMarcaDto: CreateMarcaDto) {
    return 'This action adds a new marca';
  }

  async listar(buscadorMarcaDto: BuscadorMarcaDto) {
    const filtro = buscadorMarcaDto.nombre
      ? { nombre: new RegExp(buscadorMarcaDto.nombre, 'i') }
      : {};
    const [countDocuments, marca] = await Promise.all([
      this.marca.countDocuments(filtro),

      this.marca
        .find(filtro)
        .skip(skip(buscadorMarcaDto.pagina, buscadorMarcaDto.limite))
        .limit(buscadorMarcaDto.limite),
    ]);
    const  paginas = calcularPaginas(countDocuments, buscadorMarcaDto.limite)
    return {data:marca, pagina:paginas};
  }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  update(id: number, updateMarcaDto: UpdateMarcaDto) {
    return `This action updates a #${id} marca`;
  }

  remove(id: number) {
    return `This action removes a #${id} marca`;
  }

  async guardarMarca(nombre: string) {
    const marca = await this.marca.findOne({ nombre: nombre.toUpperCase() });
    if (!marca) {
      return await this.marca.create({ nombre: nombre });
    }
    return marca;
  }
}
