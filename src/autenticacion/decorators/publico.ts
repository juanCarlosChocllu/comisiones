import { SetMetadata } from "@nestjs/common";
import { PUBLIC_KEY } from "./keys";


export const Publico = () => SetMetadata(PUBLIC_KEY, true)