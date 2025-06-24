import { DateTime } from 'luxon';

export function formaterFechaHora(fechaInicio: string, fechaFin: string) {
  const f1 = new Date(fechaInicio);
  f1.setUTCHours(0, 0, 0, 0);
  const f2 = new Date(fechaFin);
  f2.setUTCHours(23, 59, 59, 999);
  return { f1, f2 };
}

export function formatearfechaYhoraBolivia(fecha: string): string {
  const dt = DateTime.fromFormat(fecha, 'yyyy-MM-dd HH:mm:ss ZZ');
  const dtBolivia = dt.setZone('America/La_Paz');
 

  return dtBolivia.toUTC().toISO();
}
