import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Subject } from '../subject/subject.model';

@Table({ tableName: 'Topics', timestamps: true })
export class Topic extends Model {
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
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  video_url: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;
}
