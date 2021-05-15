const Share = require('../models/share');
const Portfolio = require('../models/portfolio');
const User = require('../models/user');
// const sequelize = require('../middleware/sequelizeConnection');
// const { Model } = require('sequelize');
const Portfolio_Share = require('../models/portfolio_share');
const { Op } = require('sequelize');
const Trade = require('../models/Trade');

module.exports.get_shares = async (req, res) => {
    const data = await Share.findAll({});
    const shares = new Array();
    data.forEach((value, index, array) => {
        shares.push(value.dataValues);
    })
    console.log(shares);
    res.status(200).json({shares});
}

module.exports.get_one_share = async (req, res) => {
    if(typeof req.params.symbol !== "undefined"){
        const data = await Share.findOne({
            where: {
                symbol: req.params.symbol
            }
        });
        if(data != null){
            res.status(200).json({share: data});
        }else{
            res.status(400).json({error: "Cannot find a registered share with specified symbol"});
    }
    }else{
        res.status(400).json({error: "Please specify a symbol"}); //cannot GET /share
    }
}

module.exports.add_balance = async (req, res) => {
    try{
    if (req.body.amount > 0){
        user = await User.findOne({
            attributes: ['id'],
            where: {
                userName : req.user.userName
            }
        })
        await Portfolio.increment({Balance: req.body.amount},{
            where: {
                UserId: user.id
            }
        })
        res.status(200).json({ data: "Successful!"});
    }else{
        res.status(400).json({ error: "Amount cannot be negative or zero."});
    }}catch(err){
        console.error(err);
        res.status(500).json({error: "An unexpected error occurred"}); //DB server side problem
    }
}

module.exports.get_balance = async (req, res) => {
    const user = await User.findOne({
        attributes: ['id'],
        where: {
            userName : req.user.userName
        }
    });
    const portfolio = await Portfolio.findOne({
        attributes: ['Balance'],
        where: {
            UserId: user.id
        }
    });
    res.status(200).json({ data: portfolio.Balance});
}

module.exports.buy = async (req, res) => {
    try{
            const user = await User.findOne({ 
            attributes: ['id'],
            where: {
                userName: req.user.userName
            }
        });
        const portfolio = await Portfolio.findOne({
            where: {
                UserId: user.id
            },
        });
        const share = await Share.findOne({
            where: {
                symbol: req.body.symbol
            }
        });
        if (share == null){ //unregistered share provided
            res.status(400).json({error: 'Share given is not registered in our database'});
        }else if (portfolio.isRegistered == false){
            res.status(400).json({error: 'You can not buy shares with an unregistered portfolio'});
        }
        else if(portfolio.Balance < share.rate * req.body.amount){ //not enough balance
            res.status(400).json({error: 'insufficient funds'});
        }else{
            await portfolio.decrement({Balance: share.rate * req.body.amount});
            await portfolio.addShare(share.id, {through: Portfolio_Share}); //does not add if already exists.
            res.status(200).json({data: 'success!', portfolio});
            //increase amount on database
            Portfolio_Share.increment({amount: req.body.amount}, {
                where: {
                    [Op.and] : [{PortfolioId: portfolio.id}, {ShareId: share.id}]
                }
            });
            //create transaction log
            Trade.create({
                type: 'BUY',
                amount: req.body.amount,
                UserId: user.id,
                ShareId: share.id,
                fromRate: share.rate
            })
        }
    }catch(err){
        console.error(err);
        res.status(500).json({error: "An unexpected error occurred"});
    }
}

module.exports.sell = async (req, res) => {
    try{

        const user = await User.findOne({
            attributes: ['id'],
            where:{
                userName: req.user.userName
            }
        });
        const portfolio = await Portfolio.findOne({
            where: {
                UserId : user.id
            }
        });
        const relatedShare = await Share.findOne({
            where: {
                symbol : req.body.symbol
            }
        });
        if(relatedShare == null){
            res.status(400).json({error: 'Share given is not registered to our database'});
        }else if(portfolio.isRegistered == false){
            res.status(400).json({error: 'You can not buy shares with an unregistered portfolio'});
        }
        else{
            const shareInPortfolio = await Portfolio_Share.findOne({
                attributes: ['PortfolioId', 'ShareId', 'amount', 'createdAt'],
                where:{
                    [Op.and]: [{PortfolioId: portfolio.id}, {ShareId:relatedShare.id}]
                }
            });

            console.log(shareInPortfolio);
            
            if(shareInPortfolio != null){
                if(req.body.amount > shareInPortfolio.dataValues.amount){
                    res.status(400).json({error: 'You own less than this amount'});
                }else{
                    res.status(200).json({data: 'Success!'});

                    if(req.body.amount == shareInPortfolio.dataValues.amount){
                        //delete share from portfolio if none left
                       Portfolio_Share.destroy({
                           where: {
                                [Op.and]: [{PortfolioId: portfolio.id}, {ShareId:relatedShare.id}]
                           }
                       })
                    }else{
                        Portfolio_Share.decrement({amount: req.body.amount}, { 
                            where: { 
                                [Op.and]: [{PortfolioId: portfolio.id}, {ShareId:relatedShare.id}]
                             }
                        })
                    }
                    //add balance to the account
                    portfolio.increment({Balance: req.body.amount * relatedShare.rate});

                    //create transaction log
                    Trade.create({
                        type: 'SELL',
                        amount: req.body.amount,
                        UserId: user.id,
                        ShareId: relatedShare.id,
                        fromRate: relatedShare.rate
                    })
                }
            }else{
                res.status(400).json({error: 'You do not own any amount of this share'});
            }
        }

    }catch(err){
        console.error(err);
        res.status(500).json({error: "An unexpected error occurred"});
    }
    
}

module.exports.get_transaction_logs = async (req, res) => {
    try{
        const user = await User.findOne({
            where: {
                userName : req.user.userName
            }
        });
        const logs = await Trade.findAll({
            where: {
                UserId: user.id
            }
        });
        res.status(200).json({data: logs});
    }catch(err) {
        console.error(err);
        res.status(500).json({error: "An unexpected error occurred"});
    }
}

module.exports.register_portfolio = async (req, res) => {
    try{

        const user = await User.findOne({
            where: {
                userName: req.user.userName
            }
        });
        const portfolio = await Portfolio.findOne({
            where: {
                UserId: user.id
            }
        });
        portfolio.isRegistered = true;
        portfolio.save();
        res.status(200).json({data: "Success!"});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "An unexpected error occurred"});
    }
}