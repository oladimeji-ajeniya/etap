import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Topic } from '../topic/topic.model';

@Table
export class VideoProgress extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  topicId: number;

  @BelongsTo(() => Topic)
  topic: Topic;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0, 
  })
  watchTimePercentage: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCompleted: boolean;
}
