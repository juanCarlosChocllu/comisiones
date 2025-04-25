import { Types } from "mongoose"

export interface combinacionReceta {
        codigo?:string
        codigoMia?:string
        material:Types.ObjectId
    
   
        tipoLente:Types.ObjectId
        
      
        rango:Types.ObjectId
    

        colorLente:Types.ObjectId
    
    
        marcaLente:Types.ObjectId
    

        tratamiento:Types.ObjectId

        tipoColorLente:Types.ObjectId
}

export interface GuardarComisionRecetaI {
        material:string, 
        tipoLente:string,
        rango:string, 
        colorLente:string,
        marcaLente:string,
        tratamiento:string,
        tipoColorLente:string
        comisiones:comisionesI[]
        precio:string
}

export interface  comisionesI {
  
        monto:any
        comision:any
}