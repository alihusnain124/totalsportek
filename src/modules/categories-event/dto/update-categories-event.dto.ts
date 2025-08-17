import { PickType } from '@nestjs/swagger';
import { CreateCategoriesEventDto } from './create-categories-event.dto';

export class UpdateCategoriesEventDto extends PickType(CreateCategoriesEventDto, ['streamUrl']) {}
