const { queryInterface } = require('sequelize');
const User = require('../models/User');
const Share = require('../models/Share');
const Trade = require('../models/Trade');
const Portfolio = require('../models/Portfolio');
const Portfolio_Share = require('../models/Portfolio_Share');
const bcrypt = require('bcrypt');
// const {v4} = require('uuid');


const id1 = 12542;
const id2 = 53532;
const id3 = 12523;
const id4 = 13325;
const id5 = 15532;

const portfolioId1 = 36564;
const portfolioId2 = 32523;
const portfolioId3 = 23436;
const portfolioId4 = 23532;
const portfolioId5 = 15652;

const shareId1 = 1546;
const shareId2 = 13626;
const shareId3 = 1362;

// async function hashPassword(password){
//     const salt = await bcrypt.genSalt();
//     password = await bcrypt.hash(password, salt);
// }


//Did encryption before bulk insert manually because beforeBulkCreate hook didn't work properly
// function generatePasswords (){
//     pw1 = await hashPassword("asdf1234");
//     pw2 = await hashPassword("nick123");
//     pw3 = await hashPassword("peter123");
//     pw4 = await hashPassword("steve123");
//     pw5 = await hashPassword("tony123");

//     return [pw1,pw2,pw3,pw4,pw5]
// }

//BULK INSERT OPERATIONS
async function createUsersAndShares () {

        
    await User.bulkCreate([
        {
            id: id1,
            userName: "berzeliusx",
            firstName: "Berke Anday",
            lastName: "Baloglu",
            email: "berke.andayb@gmail.com",
            password: "asdf1234"
        }, 
        {
            id: id2,
            userName: "nick",
            firstName: "Nick",
            lastName: "Fury",
            email: "nick.fury@gmail.com",
            password: "nick123"
        },
        {
            id: id3,
            userName: "parker123",
            firstName: "Peter",
            lastName: "Parker",
            email: "peter.parker@gmail.com",
            password: "peter123"
        },
        {
            id: id4,
            userName: "steve",
            firstName: "Steve",
            lastName: "Rogers",
            email: "cap123@gmail.com",
            password: "steve123"
        },
        {
            id: id5,
            userName: "tony",
            firstName: "Anthony",
            lastName: "Stark",
            email: "iamironman@gmail.com",
            password: "tony123"
        }
    ]);
   
    await Share.bulkCreate([
        {
            id: shareId1,
            symbol: 'STR',
            name: 'Stark Industries',
            rate: 90
        },
        {
            id: shareId2,
            symbol: 'OSC',
            name: 'Oscorp',
            rate: 70
        },
        {
            id: shareId3,
            symbol: 'PYM',
            name: 'Pym Technologies',
            rate: 20
        }
    ])
}

async function createAll(){
    
    createUsersAndShares().then(async () => {

        await Portfolio.bulkCreate([
            {
                id: portfolioId1,
                UserId : id1,
                Balance: 9000,
                isRegistered: true
            },
            {
                id: portfolioId2,
                UserId : id2,
                Balance: 2000,
                isRegistered: true
            },
            {
                id: portfolioId3,
                UserId : id3,
                Balance: 5000,
                isRegistered: true
            },
            {
                id: portfolioId4,
                UserId : id4,
                Balance: 7000,
                isRegistered: true
            },
            {
                id: portfolioId5,
                UserId : id5,
                Balance: 0,
                isRegistered: false
            }
    
        ]);
    
        await Trade.bulkCreate([
            {
                UserId: id1,
                ShareId: shareId2,
                amount: 5,
                fromRate: 70,
                type: 'BUY'
            },
            {
                UserId: id2,
                ShareId: shareId3,
                amount: 15,
                fromRate: 15,
                type: 'BUY'
            },
            {
                UserId: id2,
                ShareId: shareId3,
                amount: 5,
                fromRate: 20,
                type: 'SELL'
            }
        ])
    
        await Portfolio_Share.bulkCreate([
            {
                PortfolioId: portfolioId1,
                ShareId: shareId2,
                amount: 5
            },
            {
                PortfolioId: portfolioId2,
                ShareId: shareId3,
                amount: 10
            }
        ])

    }); //insert into users table and shares table first
    
    
}

createAll();
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

// const bnb = Share.create({
//     symbol: 'BNB',
//     name: 'Binance',
//     rate: 20
// }).then(() => {
//     console.log('created!');
// }).catch(err => console.error(err));

// const btc = Share.create({
//     symbol: 'BTC',
//     name: 'Bitcoin',
//     rate: 90
// }).then(() => {
//     console.log('created!');
// }).catch(err => console.error(err));

