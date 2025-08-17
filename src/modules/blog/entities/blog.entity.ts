import { Category } from 'src/modules/categories/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'blogs' })
export class Blog extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'varchar', unique: true, nullable: false, name: 'slug' })
  slug: string;

  @Column({ type: 'text', nullable: false, name: 'excerpt' })
  excerpt: string;

  @Column({ type: 'text', nullable: false, name: 'content' })
  content: string;

  @Column({ type: 'varchar', name: 'image', nullable: false })
  image: string;

  @Column({ type: 'text', nullable: true, name: 'tags' })
  tags: string[];

  @Column({ nullable: true, name: 'meta_title', type: 'text' })
  metaTitle: string;

  @Column({ type: 'text', nullable: true, name: 'meta_description' })
  metaDescription: string;

  @ManyToOne(() => User, (user) => user.blogs)
  arthur: User;

  @ManyToMany(() => Category, (category) => category.blogs, { cascade: true })
  @JoinTable({
    name: 'blog_categories',
    joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
