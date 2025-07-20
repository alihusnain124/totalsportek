import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column({ type: 'varchar', name: 'category_name', nullable: false })
  categoryName: string;
}
