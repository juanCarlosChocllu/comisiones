export function skip (pagina:number, limite:number) {
    return (pagina - 1) * limite  
}
export function calcularPaginas(countDocuments: number, limite: number): number {
  return Math.ceil(countDocuments / limite);
}