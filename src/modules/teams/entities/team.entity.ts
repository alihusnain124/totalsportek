import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'teams' })
export class Team extends BaseEntity {
  @Column({ type: 'varchar', name: 'team_name', nullable: false })
  teamName: string;

  @Column({ type: 'varchar', name: 'logo_url', nullable: false })
  logoUrl: string;
}
