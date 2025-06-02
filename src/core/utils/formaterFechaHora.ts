export function formaterFechaHora(fechaInicio: string, fechaFin: string) {
  const offsetHoras = 4; 
  const f1 = new Date(fechaInicio);
  f1.setUTCHours(0 + offsetHoras, 0, 0, 0); 
  const f2 = new Date(fechaFin);
  f2.setUTCHours(23 + offsetHoras, 59, 59, 999)
  return { f1, f2 };
}