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
import { URL } from "./URL";
import { UserURL } from "./UserURL";
let User = User_1 = class User extends Model {
    static scope(name = 'defaultScope') {
        return super.scope.call(this, name);
    }
};
__decorate([
    Column,
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], User.prototype, "fbToken", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], User.prototype, "birthday", void 0);
__decorate([
    BelongsToMany(() => URL, () => UserURL),
    __metadata("design:type", Array)
], User.prototype, "urls", void 0);
__decorate([
    CreatedAt,
    Column,
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    Column,
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = User_1 = __decorate([
    Scopes({
        urls: {
            include: [
                {
                    model: () => URL,
                    through: { attributes: [] },
                },
            ],
        },
    }),
    Table
], User);
export { User };
var User_1;
