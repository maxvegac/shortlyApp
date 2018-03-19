import {Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, PrimaryKey} from "sequelize-typescript";
import {URL} from "./URL";
import {UserURL} from "./UserURL";

@Scopes({
    urls: {
        include: [
            {
                model: () => URL,
                through: {attributes: []},
            },
        ],
    },
})
@Table
export class User extends Model<User> {

    @PrimaryKey
    @Column
    token: string;

    @Column
    displayName: string;

    @BelongsToMany(() => URL, () => UserURL)
    urls?: URL[];

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;

    static scope(name: string = 'defaultScope'): typeof User {
        return super.scope.call(this, name);
    }
}