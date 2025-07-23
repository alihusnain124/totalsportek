import { EventTeam } from 'src/modules/categories-event/entities/event-team.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'teams' })
export class Team extends BaseEntity {
  @Column({ type: 'varchar', name: 'team_name', nullable: false })
  teamName: string;

  @Column({ type: 'varchar', name: 'logo_url', nullable: false })
  logoUrl: string;

  @Column({ type: 'boolean', name: 'is_top_team', default: false })
  isTopTeam: boolean;

  @OneToMany(() => EventTeam, (eventTeam) => eventTeam.firstTeam)
  firstTeam: EventTeam[];

  @OneToMany(() => EventTeam, (eventTeam) => eventTeam.secondTeam)
  secondTeam: EventTeam[];
}
