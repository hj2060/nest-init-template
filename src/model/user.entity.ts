import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="用户";'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar', length: 100, unique: true})
  name: string

  @Column({ length: 11, comment: ''})
  mobile: string

  @CreateDateColumn()
  created_at: Date


  @UpdateDateColumn()
  updated_at: Date
}
