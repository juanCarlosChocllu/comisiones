export function skip (pagina:number, limite:number) {
    return (pagina - 1) * limite  
}
export function paginas (total:number, limite:number){
  return Math.ceil((total/limite))
}