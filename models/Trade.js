const { DataTypes, Model } = require('sequelize');
const sequelize = require('../middleware/sequelizeConnection');
const User = require('./User');
const Share = require('./Share');

//This model consists of transaction logs
class Trade extends Model {}
Trade.init({
    type: { //trade type, BUY or SELL
        type: DataTypes.STRING,
        validate: {
            isIn : [['BUY', 'SELL']]
        },
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fromRate: {
        type: DataTypes.INTEGER,
        type: DataTypes.INTEGER,
        validate:{
            len: [2,2]
        }
    }
}, {sequelize});

Trade.belongsTo(User);
User.hasMany(Trade);
Trade.belongsTo(Share);
Share.hasMany(Trade);

module.exports = Trade;

// Code to sync database after creating a new model
// sequelize.sync({force:true}).then(() => {
//     console.log("Database is in sync!");
    
// }).catch((err) => console.error(err));