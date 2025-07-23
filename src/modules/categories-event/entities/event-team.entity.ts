import { CategoriesEvent } from 'src/modules/categories-event/entities/categories-event.entity';
import { Team } from 'src/modules/teams/entities/team.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'event_teams' })
export class EventTeam extends BaseEntity {
  @OneToOne(() => CategoriesEvent, (eventCat) => eventCat.eventTeam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: CategoriesEvent;

  @ManyToOne(() => Team, (team) => team.firstTeam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'first_team_id' })
  firstTeam: Team;

  @ManyToOne(() => Team, (team) => team.secondTeam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'second_team_id' })
  secondTeam: Team;
}
