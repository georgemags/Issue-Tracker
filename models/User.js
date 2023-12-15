const {Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
    checkPassword(passwordAttempt) {
        return bcrypt.compareSync(passwordAttempt, this.password);
    }
}

User.init(
    {
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                isEmail: true
            }
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [6],
                is: ["^[a-z]+$", 'i']
            }
        }
    },
    {
        hooks:{
            beforeCreate: async (newUser) => {
                newUser.password = await bcrypt.hash(newUser.password, 13);
                return newUser;
            }
        },
        paranoid: true,
        timestamps: true,
        updatedAt: false,
        createdAt: 'date_joined',
        freezeTableName: true,
        underscored: true,
        modelName: 'User',
        sequelize
    });
module.exports = User;