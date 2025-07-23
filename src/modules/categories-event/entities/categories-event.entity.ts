import { Category } from 'src/modules/categories/entities/category.entity';
import { EventTeam } from 'src/modules/categories-event/entities/event-team.entity';
import { League } from 'src/modules/leagues/entities/league.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'categories_event' })
export class CategoriesEvent extends BaseEntity {
  @Column({ type: 'date', nullable: false, name: 'date_of_event' })
  dateOfEvent: Date;

  @Column({ type: 'time', name: 'event_time', nullable: false })
  eventTime: string;

  @ManyToOne(() => Category, (category) => category.categoryEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => League, (league) => league.categoryEvents, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'league_id' })
  league: League;

  @OneToOne(() => EventTeam, (eventTeam) => eventTeam.event)
  eventTeam: EventTeam;
}
