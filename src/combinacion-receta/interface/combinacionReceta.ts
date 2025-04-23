import { Types } from "mongoose"

export interface combinacionReceta {
        codigo:string
        codigoMia:string
        material:Types.ObjectId
    
   
        tipoLente:Types.ObjectId
        
      
        rango:Types.ObjectId
    

        colorLente:Types.ObjectId
    
    
        marcaLente:Types.ObjectId
    

        tratamiento:Types.ObjectId

        tipoColorLente:Types.ObjectId
}