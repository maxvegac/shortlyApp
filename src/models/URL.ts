import {Model, Column, Table, BelongsToMany, Scopes, Unique, CreatedAt, UpdatedAt} from "sequelize-typescript";
import {User} from "./User";
import {UserURL} from "./UserURL";

@Scopes({
    users: {
        include: [
            {
                model: () => User,
                through: {attributes: []},
            },
        ],
    },
})
@Table
export class URL extends Model<URL> {

    @Column
    originalURL: string;

    @Unique
    @Column
    shorterSuffix: string;

    @Column
    creationUserString: string;

    @Column
    creationIP: string;

    @BelongsToMany(() => User, () => UserURL)
    users?: User[];

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;

    static scope(name: string = 'defaultScope'): typeof URL {
        return super.scope.call(this, name);
    }
}