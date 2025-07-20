import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'leagues' })
export class League extends BaseEntity {
  @Column({ type: 'varchar', name: 'leagues_name', nullable: false })
  leagueName: string;

  @Column({ type: 'varchar', name: 'logo_url', nullable: false })
  logoUrl: string;
}
