export function formaterFechaHora(fechaInicio:string,fechaFin:string ) {
      const f1 = new Date(fechaInicio)
     f1.setHours(0,0,0)
    const f2=  new Date(fechaFin)
    f2.setHours(24,59,59,999)
    return { f1, f2}
}