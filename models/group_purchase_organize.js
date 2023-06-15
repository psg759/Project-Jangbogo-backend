const Sequelize = require('sequelize');

class GroupPurchaseOrganize extends Sequelize.Model {
    static initiate(sequelize) {
        GroupPurchaseOrganize.init({
            name: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            kakaoadd: {
                type: Sequelize.STRING(60),
                allowNull: false,
            },
            peoplenum: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            deadline_hour: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            deadline_min: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            place: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT('long'),
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'GroupPurchaseOrganize',
            tableName: 'group_purchase_organize',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.GroupPurchaseOrganize.hasMany(db.GroupPurchaseTeam, { foreignKey: 'purchase_id', sourceKey: 'id' });
        db.GroupPurchaseOrganize.belongsTo(db.User, { foreignKey: 'fk_user_id_organize', targetKey: 'id' });
    }
};

module.exports = GroupPurchaseOrganize;