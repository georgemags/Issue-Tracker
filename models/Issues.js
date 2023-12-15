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
        user_name:{
            type: DataTypes.INTEGER,
            references:{
                model: 'User',
                key: 'name'
            }
        },
        reading_level:{
            type: DataTypes.STRING,
            allowNull: false,

        },
        source_mat:{
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'SourceMaterial',
                key: 'title'
            }
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
        modelName: 'Issues',
      }
);
module.exports = Issues;