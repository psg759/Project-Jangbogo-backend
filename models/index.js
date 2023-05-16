'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const User = require('./user');
const Ripeness = require('./ripeness');
const Refrigerator = require('./refrigerator');
const Notice = require('./notice');
const Memo = require('./memo');
const MemoItem = require('./memoitem');
const GroupPurchaseOrganize = require('./group_purchase_organize');
const GroupPurchaseTeam = require('./group_purchase_team');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;

db.User = User
db.Ripeness = Ripeness
db.Refrigerator = Refrigerator
db.Notice = Notice
db.Memo = Memo
db.MemoItem = MemoItem
db.GroupPurchaseOrganize = GroupPurchaseOrganize
db.GroupPurchaseTeam = GroupPurchaseTeam

User.initiate(sequelize);
Ripeness.initiate(sequelize);
Refrigerator.initiate(sequelize);
Notice.initiate(sequelize);
Memo.initiate(sequelize);
MemoItem.initiate(sequelize);
GroupPurchaseOrganize.initiate(sequelize);
GroupPurchaseTeam.initiate(sequelize);

User.associate(db);
Ripeness.associate(db);
Refrigerator.associate(db);
Notice.associate(db);
Memo.associate(db);
MemoItem.associate(db);
GroupPurchaseOrganize.associate(db);
GroupPurchaseTeam.associate(db);

module.exports = db;

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = new (require(path.join(__dirname, file)))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


