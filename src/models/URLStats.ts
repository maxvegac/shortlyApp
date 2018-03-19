import {
    Model, Column, Table, BelongsToMany, Scopes, Unique, CreatedAt, UpdatedAt,
    BelongsTo
} from "sequelize-typescript";
import {URL} from "./URL";

@Scopes({
    users: {
        include: [
            {
                model: () => URL,
                through: {attributes: []},
            },
        ],
    },
})
@Table
export class URLStats extends Model<URLStats> {

    @Column
    userAgent: string;

    @Column
    IP: string;

    @BelongsTo(() => URL, 'URLId')
    URL: URL;

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