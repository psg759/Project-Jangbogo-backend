const Sequelize = require('sequelize');

class Refrigerator extends Sequelize.Model {
    static initiate(sequelize) {
        Refrigerator.init({
            PRDLST_NM: {
                type: Sequelize.STRING(50),
            },
            POG_DAYCNT: {
                type: Sequelize.INTEGER,
            },
            BSSH_NM: {
                type: Sequelize.STRING(50),
            },
            BAR_CD: {
                type: Sequelize.STRING(50),
            },
            PRDLST_MEMO: {
                type: Sequelize.STRING(50),
            },
            PRDLST_DL: {
                type: Sequelize.STRING(50),
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Refrigerator',
            tableName: 'refrigerator',
            paranoid: true,
            charset: 'utf-8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Refrigerator.belongsTo(db.User, { foreignKey: 'fk_user_id_refrigerator', targetKey: 'id' });
    }
};

module.exports = Refrigerator;