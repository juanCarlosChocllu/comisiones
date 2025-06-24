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

 
}
