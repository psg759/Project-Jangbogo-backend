const Sequelize = require('sequelize');

class Ripeness extends Sequelize.Model {
    static initiate(sequelize) {
        Ripeness.init({
            ripeness: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            file_name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            file_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            file_path: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            file_size: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Ripeness',
            tableName: 'ripeness',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Ripeness.belongsTo(db.User, { foreignKey: 'fk_user_id_ripeness', targetKey: 'id' });
    }
};

module.exports = Ripeness;