var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt } from "sequelize-typescript";
import { User } from "./User";
import { UserURL } from "./UserURL";
let URL = URL_1 = class URL extends Model {
    static scope(name = 'defaultScope') {
        return super.scope.call(this, name);
    }
};
__decorate([
    Column,
    __metadata("design:type", String)
], URL.prototype, "firstName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], URL.prototype, "lastName", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], URL.prototype, "birthday", void 0);
__decorate([
    BelongsToMany(() => User, () => UserURL),
    __metadata("design:type", Array)
], URL.prototype, "users", void 0);
__decorate([
    CreatedAt,
    Column,
    __metadata("design:type", Date)
], URL.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    Column,
    __metadata("design:type", Date)
], URL.prototype, "updatedAt", void 0);
URL = URL_1 = __decorate([
    Scopes({
        users: {
            include: [
                {
                    model: () => User,
                    through: { attributes: [] },
                },
            ],
        },
    }),
    Table
], URL);
export { URL };
var URL_1;
