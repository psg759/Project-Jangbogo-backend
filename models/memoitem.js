const Sequelize = require('sequelize');

class MemoItem extends Sequelize.Model {
    static initiate(sequelize) {
        MemoItem.init({
            name: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            cnt: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            price: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'MemoItem',
            tableName: 'memoitem',
            paranoid: true,
            charset: 'utf-8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.MemoItem.belongsTo(db.Memo, { foreignKey: 'fk_memo_id', targetKey: 'id' });
    }
};

module.exports = MemoItem;