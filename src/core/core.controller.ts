import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoreService } from './core.service';
import { CreateCoreDto } from './dto/create-core.dto';
import { UpdateCoreDto } from './dto/update-core.dto';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

}
