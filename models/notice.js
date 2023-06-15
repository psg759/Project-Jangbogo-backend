const Sequelize = require('sequelize');

class Notice extends Sequelize.Model {
    static initiate(sequelize) {
        Notice.init({
            type: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT('long'),
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Notice',
            tableName: 'notice',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.GroupPurchaseTeam.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
    }
};

module.exports = Notice;