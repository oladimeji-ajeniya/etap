import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { VideoProgress } from '../video-progress/video-progress.model';

@Table({ tableName: 'Users', timestamps: true })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'learner', 
  })
  role: string;

  @HasMany(() => VideoProgress)
  videoProgress: VideoProgress[];
}
