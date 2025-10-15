import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AxiosError, HttpStatusCode } from 'axios';
import { LogService } from 'src/log/log.service';
import { LogActividadI, LogI } from 'src/log/interface/log';
import { Types } from 'mongoose';
import path from 'path';
import { AccionSistemaE } from '../enum/coreEnum';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const method = request.method;
    const path = request.originalUrl;
    return next.handle().pipe(
      tap({
        next: async () => {
          if (path === '/api/autenticacion') {
            await this.succesLogin(
              method,
              path,
              request.body.username,
              request.ip,
              request.headers['user-agent'],
            );
          }
          await this.registrarActividad(path, method, request);
        },
        error: async (err) => {
          const e = err as AxiosError;
          if (e && e.status === HttpStatusCode.Forbidden) {
            await this.errorLogin(
              method,
              path,
              request.body.username,
              request.ip,
              request.headers['user-agent'],
            );
          }
        },
      }),
    );
  }

  private async errorLogin(
    method: string,
    path: string,
    usuario: string,
    ip: string,
    navegador: string,
  ) {
    const data: LogI = {
      descripcion: `Inicio de sesión fallido para el usuario: ${usuario}`,
      method: method,
      path: path,
      schema: 'Usuario',
      ip: ip,
      navegador: navegador,
      estado:"UNAUTHORIZED"
    };
    await this.logService.registrarLog(data);
  }

  private async succesLogin(
    method: string,
    path: string,
    usuario: string,
    ip: string,
    navegador: string,
  ) {
    const data: LogI = {
      descripcion: `Inicio de sesión exitoso para el usuario: ${usuario}`,
      method: method,
      path: path,
      schema: 'Usuario',
      ip: ip,
      navegador: navegador,
      estado:"OK"
    };
    await this.logService.registrarLog(data);
  }

  private quitarContrasena(body: any) {
    const { password, ...bodySinContrasena } = body;
    return bodySinContrasena;
  }
  private async registrarActividad(
    path: string,
    method: string,
    request: Request,
  ) {
    const methods: string[] = ['POST', 'DELETE', 'PATCH'];

    if (methods.includes(method)) {
      const actividad = [
        {
          path: '/api/rango/comision/producto',
          accion: AccionSistemaE.Crear,
          descripcion:
            'Se registró un nuevo rango de comisión para el producto',
          schema: 'RangoComisionProducto',
        },
        {
          path: '/api/metas/producto/vip',
          accion: AccionSistemaE.Crear,
          descripcion: 'Se registro una nueva meta para una sucursal',
          schema: 'MetasProductoVip',
        },

        {
          path: '/api/usuario',
          accion: AccionSistemaE.Crear,
          descripcion: 'Se registró un nuevo usuario en el sistema',
          schema: 'Usuario',
        },

        {
          path: '/api/comision/receta',
          accion: AccionSistemaE.Crear,
          descripcion: 'Se registró un nueva comision para una combinacion',

          schema: 'ComisionReceta',
        },

        {
          path: '/api/provider/excel/combinaciones/comisiones',
          accion: AccionSistemaE.Crear,
          descripcion:
            'Se realizó una carga masiva de comisiones para las combinaciones',

          schema: 'ComisionReceta',
        },
        {
          path: '/api/comision/producto',
          accion: AccionSistemaE.Crear,
          descripcion: 'Se registró un nueva comision para producto',

          schema: 'ComisionProducto',
        },

        {
          path: '/api/provider/excel/producto/comisiones',
          accion: AccionSistemaE.Crear,
          descripcion:
            'Se realizó una carga masiva de comisiones para los productos',

          schema: 'ComisionProducto',
        },

        {
          path: '/api/metas/producto/vip',
          accion: AccionSistemaE.Eliminar,
          descripcion: 'Se elimino una llave',
          schema: 'MetasProductoVip',
        },
      ];

      for (const data of actividad) {
        if (path.startsWith(data.path)) {
          const bodySanitizado =
            data.path === '/api/usuario'
              ? this.quitarContrasena(request.body)
              : request.body;
          const dataLog: LogActividadI = {
            accion: data.accion,
            descripcion: data.descripcion,
            ip: request.ip,
            method: method,
            navegador: request.headers['user-agent'],
            path: path,
            schema: data.schema,
            usuario: request.usuario.idUsuario,
            body: JSON.stringify(bodySanitizado),
          };

          await this.logService.registrarActividad(dataLog);
        }
      }
    }
  }
}
