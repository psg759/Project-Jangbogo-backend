const Sequelize = require('sequelize');

class Memo extends Sequelize.Model {
    static initiate(sequelize) {
        Memo.init({
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Memo',
            tableName: 'memo',
            paranoid: true,
            charset: 'utf-8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Memo.hasMany(db.MemoItem, {foreignKey: 'fk_memo_id', targetKey: 'id' });
        db.Memo.belongsTo(db.User, { foreignKey: 'fk_user_id_memo', targetKey: 'id' });
    }
};

module.exports = Memo;