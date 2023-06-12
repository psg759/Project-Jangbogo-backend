const Sequelize = require('sequelize');

class GroupPurchaseTeam extends Sequelize.Model {
    static initiate(sequelize) {
        GroupPurchaseTeam.init({
            author: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            isFullGB: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            currPeopleNum: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'GroupPurchaseTeam',
            tableName: 'group_purchase_team',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.GroupPurchaseTeam.belongsTo(db.GroupPurchaseOrganize, { foreignKey: 'purchase_id', targetKey: 'id' });
        db.GroupPurchaseTeam.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
    }
};

module.exports = GroupPurchaseTeam;