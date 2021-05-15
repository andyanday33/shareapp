const { DataTypes, Model } = require('sequelize');
const sequelize = require('../middleware/sequelizeConnection');
const User = require('./User');
const Share = require('./Share');
const Portfolio_Share = require('./Portfolio_Share');

class Portfolio extends Model {}
Portfolio.init({
    Balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {sequelize});

Portfolio.belongsTo(User);
User.hasOne(Portfolio);
Share.belongsToMany(Portfolio, {through: Portfolio_Share});
Portfolio.belongsToMany(Share, {through: Portfolio_Share});

module.exports = Portfolio;

// Code to sync database after creating a new model
// sequelize.sync({force:true}).then(() => {
//     console.log("Database is in sync!");
    
// }).catch((err) => console.error(err));