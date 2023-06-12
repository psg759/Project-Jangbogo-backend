const Sequelize = require('sequelize');

class Memo extends Sequelize.Model {
    static initiate(sequelize) {
        Memo.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            total_price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Memo',
            tableName: 'memo',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Memo.hasMany(db.MemoItem, {foreignKey: 'fk_memo_id', targetKey: 'id' });
        db.Memo.belongsTo(db.User, { foreignKey: 'fk_user_id_memo', targetKey: 'id' });
    }
};

module.exports = Memo;