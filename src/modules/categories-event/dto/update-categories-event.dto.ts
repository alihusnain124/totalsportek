import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriesEventDto } from './create-categories-event.dto';

export class UpdateCategoriesEventDto extends PartialType(CreateCategoriesEventDto) {}
