import { CreationOptional } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

export type UserAttributes = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
};

@Table({})
export class User extends Model<UserAttributes> {
  id: CreationOptional<number>;
  @Column
  firstName: string;
  @Column
  lastName: string;
  @Column
  userName: string;
  @Column
  password: string;
}
