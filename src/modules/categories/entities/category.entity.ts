import { CategoriesEvent } from 'src/modules/categories-event/entities/categories-event.entity';
import { League } from 'src/modules/leagues/entities/league.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column({ type: 'varchar', name: 'category_name', nullable: false })
  categoryName: string;

  @OneToMany(() => League, (league) => league.category, { onDelete: 'CASCADE' })
  league: League[];

  @OneToMany(() => CategoriesEvent, (catEvent) => catEvent.category, { onDelete: 'CASCADE' })
  categoryEvents: CategoriesEvent[];
}
