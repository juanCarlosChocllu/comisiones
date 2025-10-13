import {
  Controller,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionDto } from './dto/create-autenticacion.dto';
import { Publico } from '../core/decorators/publico';
import type { Response } from 'express';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post()
  @Publico()
  async Login(
    @Body() AutenticacionDto: AutenticacionDto,
    @Res() res: Response,
  ) {
    try {
      const { token } =
        await this.autenticacionService.autenticacion(AutenticacionDto);

      if (token) {
        res.cookie('ctx', token, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 4,
          sameSite: 'strict',
          path: '/',
        });
        return res.json({ status: HttpStatus.OK });
      }
      throw new UnauthorizedException();
      // return this.autenticacionService.autenticacion(AutenticacionDto)
    } catch (error) {
      throw error;
    }
  }
}
