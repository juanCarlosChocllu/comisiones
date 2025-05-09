import { comisionesI } from "src/combinacion-receta/interface/combinacionReceta";

export  interface exceldataServicioI {
    codigoMia:string
    nombre:string,
    descripcion:string,
    tipoPrecio:string,
    monto:number
    comisiones:comisionesI[]
}
