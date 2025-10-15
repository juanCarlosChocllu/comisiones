import { Body, Controller, Post } from '@nestjs/common';
import { LogService } from './log.service';
import { BuscadorLogActividadDto } from './dto/BuscadorLogActividad.dto';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}
  
  @Post("listar")
  listar(@Body() buscadorLogActividadDto: BuscadorLogActividadDto){
    return this.logService.listar(buscadorLogActividadDto)
  }
  

  @Post("listar/usuario")
  listarUsuarios(@Body() buscadorLogActividadDto: BuscadorLogActividadDto){
    return this.logService.listarLogUsuario(buscadorLogActividadDto)
  }
}
