export const config = {
    defaultDomain: 'zl.cl',
    SSL: true,
    userDailyLimit: 200,
    guestDailyLimit: 10,
    database: {
        dialect: 'mysql',
        database: '',
        username: '',
        password: '',
        host: "localhost",
        port: 3306,
        logging: console.log,
        force: false,
        timezone: "+04:00",
        modelPaths: [__dirname + '/models']
    }
};
