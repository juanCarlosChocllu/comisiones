import { Types } from "mongoose";

export interface FiltroVentaI {
  fecha?: {
    $gte: Date;
    $lte: Date;
  };
  fechaVenta?: {
    $gte: Date;
    $lte: Date;
  };
  tipoVenta?: Types.ObjectId | {$in :Types.ObjectId[] } ;
  flagVenta?: string | { $ne: string } | {$eq :string };
  comisiona?:boolean | null
  estadoTracking: { $ne: string }
 
}


