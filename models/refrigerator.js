const Sequelize = require('sequelize');

class Refrigerator extends Sequelize.Model {
    static initiate(sequelize) {
        Refrigerator.init({
            //제품명
            PRDLST_NM: {
                type: Sequelize.STRING(50),
            },
            CNT: {
                type:Sequelize.INTEGER,
            },
            //유통기한
            POG_DAYCNT: {
                type: Sequelize.DATE,
            },
            //제조사
            BSSH_NM: {
                type: Sequelize.STRING(50),
            },
            //식품유형
            PRDLST_DCNM: {
                type: Sequelize.STRING(50),
            },
            //바코드 번호
            BAR_CD: {
                type: Sequelize.STRING(50),
            },
            //메모
            PRDLST_MEMO: {
                type: Sequelize.STRING(100),
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Refrigerator',
            tableName: 'refrigerator',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Refrigerator.belongsTo(db.User, { foreignKey: 'fk_user_id_refrigerator', targetKey: 'id' });
    }
};

module.exports = Refrigerator;