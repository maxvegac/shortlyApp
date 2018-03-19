import {Model, Column, Table, ForeignKey} from "sequelize-typescript";
import {User} from "./User";
import {URL} from "./URL";

@Table
export class UserURL extends Model<UserURL> {

    @ForeignKey(() => URL)
    @Column
    urlId: number;

    @ForeignKey(() => User)
    @Column
    token: string;
}