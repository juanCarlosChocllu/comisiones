import { BuscadorRendimientoDiarioDto } from "src/rendimiento-diario/dto/BuscardorRendimientoDiario";
import { BuscadorVentaDto } from "../dto/buscadorVenta.dto,";
import { FiltroVentaI } from "../interface/filtros";
import { FlagVentaE } from "src/core/enum/venta";
import { Types } from "mongoose";

export function filtradorVenta(filtro: BuscadorRendimientoDiarioDto) {
  let filtrador: FiltroVentaI = {
   estadoTracking:{$ne:'ANULADO'}
  };
  if (filtro.flagVenta === FlagVentaE.finalizadas) {
    filtrador.fecha = {
      $gte: new Date(new Date(filtro.fechaInicio).setUTCHours(0, 0, 0, 0)),
      $lte: new Date(new Date(filtro.fechaFin).setUTCHours(23, 59, 59, 999)),
    };
  }

  if (filtro.flagVenta === FlagVentaE.realizadas) {
    filtrador.fechaVenta = {
      $gte: new Date(new Date(filtro.fechaInicio).setUTCHours(0, 0, 0, 0)),
      $lte: new Date(new Date(filtro.fechaFin).setUTCHours(23, 59, 59, 999)),
    };
  }

  if (filtro.comisiona != null) {
    filtrador.comisiona = filtro.comisiona;
  }
  filtro.tipoVenta.length > 0
    ? (filtrador.tipoVenta = {
        $in: filtro.tipoVenta.map((id) => new Types.ObjectId(id)),
      })
    : filtrador;

  return filtrador;
}
