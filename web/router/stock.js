const express = require("express");
const router = express.Router();
const verifyLogin = require('../verify/loginCheck');
const { connection } = require('../connection/connection');
const quaries = require('../model/query');
const stockModel = require('../model/stock');
var url = "";


router.get("/stock_list", verifyLogin, async (req, res) => {

    let account_no = req.session.account_id ? req.session.account_id : "";
    let stockList = await stockModel.getStockList(account_no).then(result => result).catch((err) => []);

    return res.render('stock_list', {
        "page": "stock list",
        "message": "",
        "data": stockList
    });
});


router.post('/update_stock_price', verifyLogin, async (req, res) => {
    let product_id = req.body.productId;
    let data = {
        "sell_price": req.body.sellingPrice != undefined ? req.body.sellingPrice >= 0 ? req.body.sellingPrice : 0 : 0
    }
    let message = await stockModel.updateStock(data, product_id)
        .then(result => "Stock Update Successfully")
        .catch((err) => "Stock Update Fail");

    let account_no = req.session.account_id ? req.session.account_id : "";
    let stockList = await stockModel.getStockList(account_no)
        .then(result => result)
        .catch((err) => []);

    return res.render('stock_list', {
        "page": "stock list",
        "message": message,
        "data": stockList
    });
});

router.get('/*', verifyLogin, (req, res) => {
    return res.redirect(url + "/stock/stock_list");
});



module.exports = router;