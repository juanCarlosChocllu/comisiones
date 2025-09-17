import { Injectable, NotAcceptableException, Type } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Marca } from './schema/marca.schema';
import { Model, Types } from 'mongoose';
import { BuscadorMarcaDto } from './dto/BuscadorMarca.dto';
import { calcularPaginas, skip } from 'src/core/utils/paginador';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import { AsignarCategoriaDto } from './dto/asignarCategoriaDto';

@Injectable()
export class MarcaService {
  constructor(@InjectModel(Marca.name) private readonly marca: Model<Marca>) {}
 
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


  async  listarMarcas(){
    return this.marca.find()
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

  async actulizarMarca(id:Types.ObjectId, nombre:string){
    const marca= await this.marca.findOne({_id:new Types.ObjectId(id)})
    if(marca){
    const data= await this.marca.updateOne({_id:new Types.ObjectId(id)}, {nombre:nombre})
     console.log(data);
     
    }
  }
  async guardarMarca(nombre: string) {
    const marca = await this.marca.findOne({ nombre: nombre.toUpperCase() });
    if (!marca) {
      return await this.marca.create({ nombre: nombre });
    }
    return marca;
  }

  async asignarCategoriaMarca(asignarCategoriaDto:AsignarCategoriaDto){
      const marca = await this.marca.findOne({_id:new Types.ObjectId(asignarCategoriaDto.marca)})
      if(!marca){
          throw new NotAcceptableException()
      }
      return this.marca.updateOne({_id:new Types.ObjectId(asignarCategoriaDto.marca)}, {categoria:asignarCategoriaDto.categoria})
       
  }
}
