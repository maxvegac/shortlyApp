import {config} from "./config";
import {Sequelize} from 'sequelize-typescript';


class Database {
    private _sequelize: Sequelize;

    constructor() {
        this._sequelize = new Sequelize(config.database);
    }

    getModels() {
        return this._sequelize.models;
    }

    getSequelize() {
        return this._sequelize;
    }
}

const database = new Database();
export const models = database.getModels();
export const sequelize = database.getSequelize();