const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Issues extends Model {}

Issues.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'user',
                key: 'user_id'
            }
        },
        source_mat_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'sourcematerial',
                key: 'source_mat_id'
            }
        },
        reading_level:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        passage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },  
    {
        sequelize,
        timestamps: true,
        updatedAt: false,
        createdAt: 'date_created',
        freezeTableName: true,
        modelName: 'issues',
      }
);
module.exports = Issues;