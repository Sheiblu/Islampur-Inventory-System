const express = require("express");
const router = express.Router();
const verifyLogin = require('../verify/loginCheck');
const empty = require('is-empty');
const stockModel = require('../model/stock');
const productModel = require('../model/product');
var url = "";

router.get(url + "/add_product", verifyLogin, (req, res) => {
    res.render('add_new_product', {
        page: "add product",
        message: ""
    });
});

router.post(url + "/add_product", verifyLogin, async (req, res) => {

    let data = {
        product_name: req.body.product_name,
        product_id: "P" + req.session.account_id + "-" + new Date().getTime(),
        account_no: req.session.account_id ? req.session.account_id : "",
        description: req.body.discription,
        visibility: 1
    }

    let productList = await productModel.getProductList(data.account_no).then(result => result).catch((err) => []);

    let productData = await productModel.getProduct(data.account_no, data.product_name).then(result => result).catch((err) => []);
    if (!empty(productData)) {
        res.render('add_new_product', {
            "page": "add product",
            "message": "Product Already Exisi"
        });

    } else {
        let insertProductResult = await productModel.addNewProduct(data)
            .then(result => result)
            .catch((err) => {
                return res.render('add_new_product', {
                    "page": "add_new_product",
                    "message": "Error"
                });
            });

        if (empty(insertProductResult)) {
            return res.render('add_new_product', {
                "page": "product list",
                "message": "Somethink Wrong Try Again"
            });
        } else {
            let stockData = {
                "product_id": data.product_id,
                "product_name": data.product_name,
                "account_no": data.account_no,
            }

            let insertStock = await stockModel.addStock(stockData)
                .then(result => result)
                .catch((err) => {
                    return res.send({
                        "page": "Error",
                        "message": "Error Stock Return"
                    });
                });

            let message = empty(insertStock) == true ? "Somethink Wrong Try Again Stock insert" : "Product add Successfully";

            return res.render('add_new_product', {
                "page": "product list",
                "message": message
            });
        }
    }
});

router.get("/product_list", verifyLogin, async (req, res) => {

    let account_no = req.session.account_id ? req.session.account_id : "";
    let productList = await productModel.getProductList(account_no).then(result => result).catch((err) => []);

    return res.render('product_list', {
        "page": "product list",
        "message": "",
        "data": productList
    });
});

router.post('/update_product', verifyLogin, async (req, res) => {
    var account_no = req.session.account_id ? req.session.account_id : "";
    var product_id = req.body.productId;
    let data = {
        "product_name": req.body.productName,
        "description": req.body.productDescription
    }
    let message = await productModel.updateProduct(data, account_no, product_id)
        .then((result) => {
            if (result.affectedRows > 0) return "Product Update Successfully";
            else "";
        })
        .catch((err) => "Product Update Fail");

    let productList = await productModel.getProductList(account_no)
        .then(result => result)
        .catch((err) => []);

    return res.render('product_list', {
        "page": "product list",
        "message": message,
        "data": productList
    });
});

router.post('/product_delete', verifyLogin, async (req, res) => {
    let account_no = req.session.account_id ? req.session.account_id : "";
    let data = {
        id: req.body.id
    }
    let message = await productModel.deleteProduct(data.id, account_no)
        .then((result) => {
            if (result.affectedRows > 0) return "Product Delete Successfully";
            else "Product Delete Fail";
        })
        .catch((err) => "Product Delete Fail");

    let productList = await productModel.getProductList(account_no)
        .then(result => result)
        .catch((err) => []);

    return res.render('product_list', {
        "page": "product list",
        "message": message,
        "data": productList
    });
});


router.get('/*', verifyLogin, (req, res) => {
    return res.redirect(url + "/product/product_list");
});



module.exports = router;