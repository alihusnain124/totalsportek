import { CategoriesEvent } from 'src/modules/categories-event/entities/categories-event.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'leagues' })
export class League extends BaseEntity {
  @Column({ type: 'varchar', name: 'leagues_name', nullable: false })
  leagueName: string;

  @Column({ type: 'varchar', name: 'logo_url', nullable: false })
  logoUrl: string;

  @Column({ type: 'boolean', name: 'is_top_league', default: false })
  isTopLeague: boolean;

  @ManyToOne(() => Category, (catLeague) => catLeague.league)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => CategoriesEvent, (catEvent) => catEvent.league)
  categoryEvents: CategoriesEvent[];
}
