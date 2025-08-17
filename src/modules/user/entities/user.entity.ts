import { BaseEntity } from 'src/utils/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Blog } from 'src/modules/blog/entities/blog.entity';
@Entity({ name: 'admin_user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password', nullable: false })
  password: string;

  @OneToMany(() => Blog, (blog) => blog.arthur, { onDelete: 'CASCADE' })
  blogs: Blog[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
