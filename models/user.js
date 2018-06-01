module.exports = function(sequelize, Sequelize) {

    const User = sequelize.define("User", {

        /*
                firstname: {
                    type: Sequelize.STRING,
                    notEmpty: true


                },

                lastname: {
                    type: Sequelize.STRING,
                    notEmpty: true

                },

        */
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }

        },

        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        resetPasswordToken: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        resetPasswordExpires: {
            type: Sequelize.DATE,
            allowNull: true
        },



        last_login: {
            type: Sequelize.DATE

        },

        status: {

            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'

        }

    });

    User.associate = function(models) {
        // Associating Author with Posts
        // When an Author is deleted, also delete any associated Posts
        User.hasMany(models.Task, {
            onDelete: "cascade"
        });
    };


    return User

}