import { ConfigModule , ConfigService} from "@nestjs/config";


ConfigModule.forRoot(
{
    isGlobal:true
}
)

const configService= new  ConfigService()
export const databaseConeccion:string=configService.get<string>('DATABASE_CONECTION')
export const port:string=configService.get<string>('PORT')
export const key:string=configService.get<string>('KEY')
export const apiMia:string=configService.get<string>('API_MIA')
export const tokenMia:string=configService.get<string>('TOKEN_MIA')