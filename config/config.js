const dotenv = require('dotenv');

dotenv.config();

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if(value == null) {
        throw new Error(`key ${key} is undefined`);
    }
    return value;
}

module.exports = {
    sens: {
        accessKey:required("NCP_SENS_ACCESS"),
        secretKey:required("NCP_SENS_SECRET"),
        serviceId:required("NCP_SENS_ID"),
        callNumber: required("NCP_SENS_NUMBER"),
    },
    development: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "nodejs",
        host: "127.0.0.1",
        dialect: "mysql"
      },
      test: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql"
      },
      production: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "nodejs",
        host: "127.0.0.1",
        dialect: "mysql",
        logging: false,
      }
};