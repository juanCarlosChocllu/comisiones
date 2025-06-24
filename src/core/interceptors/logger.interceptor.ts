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
import { LogI } from 'src/log/interface/log';
import { Types } from 'mongoose';

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
            await this.succesLogin(method, path, request.body.username);
          } else {
            await this.registrarMonvimiento(method, path, request);
          }
        },
        error: async (err) => {
          const e = err as AxiosError;
          if (e && e.status === HttpStatusCode.Forbidden) {
            await this.errorLogin(method, path, request.body.username);
          }
        },
      }),
    );
  }

  private async errorLogin(method: string, path: string, usuario: string) {
    const data: LogI = {
      descripcion: `Inicio de sesión fallido para el usuario: ${usuario}`,
      method: method,
      path: path,
      schema: 'Usuario',
    };
    await this.logService.registrarLog(data);
  }

  private async succesLogin(method: string, path: string, usuario: string) {
    const data: LogI = {
      descripcion: `Inicio de sesión exitoso para el usuario: ${usuario}`,
      method: method,
      path: path,
      schema: 'Usuario',
    };
    await this.logService.registrarLog(data);
  }

  private async registrarMonvimiento(
    method: string,
    path: string,
    request: Request,
  ) {
    const schema = this.extraerSchema(path);
    const data: LogI = {
      method: method,
      usuario: request.user,
      path: path,
      schema: schema,
    };

    try {
       if (method === 'PATCH') {
      const id = request.params;

      data.descripcion = `Se Edito un recurso en el schema ${schema} con id ${id}`;
      await this.logService.registrarLog(data);
    }
    if (method === 'DELETE') {
      const id = request.params;

      data.descripcion = `Se Elimino un recurso en el schema ${schema} con id ${id}`;
      await this.logService.registrarLog(data);
    }
    } catch (error) {
      console.log(error);
      
    }
  }

  private extraerSchema(path: string) {
    const index = path.indexOf('/api/');
    const pathArray = path.split('/');
    const schema = pathArray[index + 2];
    return schema.charAt(0).toUpperCase() + schema.slice(1);
  }
}
