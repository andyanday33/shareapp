const { queryInterface } = require('sequelize');
const User = require('../models/User');
const Share = require('../models/Share');


//INSERT OPERATIONS

// const berke = User.create({
//     userName: 'berzelius',
//     firstName: "Berke Anday",
//     lastName: "Baloglu",
//     email: "berke.andayb@gmail.com",
//     password: "admin123"
// }).then(() => {
//     //console.log("created");
// }).catch(err => console.error(err));
//console.log(berke instanceof User);
//console.log(berke.firstName);
// try{
//     berke.save();
// }catch(err){
//     console.error(err);
// }
//User.login("berzelius", "admin123");

const bnb = Share.create({
    symbol: 'BNB',
    name: 'Binance',
    rate: 20
}).then(() => {
    console.log('created!');
}).catch(err => console.error(err));

const btc = Share.create({
    symbol: 'BTC',
    name: 'Bitcoin',
    rate: 90
}).then(() => {
    console.log('created!');
}).catch(err => console.error(err));

