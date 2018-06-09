module.exports = function(sequelize, DataTypes) {

    const Task = sequelize.define("Task", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 200]
            }
        },

        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                len: [1]
            },
            defaultValue: false
        }

    });

    Task.associate = function(models) {

        Task.belongsTo(models.User, {
            foreignKey: {

                allowNull: false
            }
        });
    }
    return Task;

};