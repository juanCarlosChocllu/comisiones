import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      usuario:{
        idUsuario:Types.ObjectId,

      }
      
    }
  }
}
