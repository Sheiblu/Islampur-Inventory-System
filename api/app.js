const express = require("express");
const bodyParser = require('body-parser');
const { connection } = require('./connection/connection');
const quaries = require('./model/query');
const empty = require('is-empty');
const app = express();
const port = process.env.PORT || 3001;


var url = "";
var base_url = "http://localhost:" + port;

app.use(function (req, res, next) {
    res.locals.url = base_url;
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get([url + '/', url + "/home"], (req, res) => {
    res.send({
        "Hork": "It's Work"
    });
});


//  User 
app.post([url + '/api/user/registration'], (req, res) => {

    if (!connection) {
        return res.send({
            message: "No connection found"
        });
    }

    let userData = {
        name: req.body.user_name,
        phone_no: req.body.user_phone,
        store_name: req.body.user_store_name,
        store_address: req.body.user_store_address,
        account_no: req.body.user_account_no,
        permission: req.body.user_permission,
        account_type: req.body.user_account_type,
        password: req.body.user_password
    }


    connection.query(quaries.check_user_account(), [userData.phone_no, userData.account_no], (error, result, fields) => {
        if (error) {
            return res.send({
                "error": "Fail To Registration",
                "s": error
            });
        }

        if (empty(result)) {

            connection.query(quaries.register_account(), userData, (error, result, fields) => {

                if (error) {
                    return res.send({
                        "error": "Fail To reg"
                    });
                }

                if (result.affectedRows === 1) {
                    res.send({
                        "result": true,
                        "data": result,
                        "message": "Registration Successsfully Done"
                    });
                }
            });

        } else {
            res.send({
                "result": "true",
                "message": "Phone No has Already a Account"
            });
        }
    });
});

app.post([url + '/api/user/login'], (req, res) => {

    if (!connection) {
        return res.send({
            message: "No connection found"
        });
    }

    let userData = {
        phone_no: req.body.user_phone,
        password: req.body.user_password
    }

    connection.query(quaries.user_login(), [userData.phone_no, userData.phone_no, userData.password], (error, result, fields) => {
        if (error) {
            return res.send({
                "error": "Fail To Login",
                "s": error
            });
        }

        if (!empty(result)) {
            res.send({
                "result": true,
                "message": "login Successful",
                "data": result
            });

        } else {
            res.send({
                "result": "true",
                "message": "Login Fail phone/id/password not match",
                "data": []
            });
        }
    });
})

// Sub User

app.post([url + '/api/sub_user/registration'], (req, res) => {

    if (!connection) {
        return res.send({
            message: "No connection found"
        });
    }

    let userData = {
        name: req.body.user_name,
        phone_no: req.body.user_phone,
        account_no: req.body.user_account_no,
        owner_account_no: req.body.user_owner_account_no,
        permission: req.body.user_permission,
        password: req.body.user_password
    }


    connection.query(quaries.check_sub_user_account(), [userData.phone_no, userData.account_no], (error, result, fields) => {
        if (error) {
            return res.send({
                "error": "Fail To Registration",
                "s": error
            });
        }

        if (empty(result)) {

            connection.query(quaries.register_sub_account(), userData, (error, result, fields) => {

                if (error) {
                    return res.send({
                        "result": true,
                        "error": "Fail To Registration"
                    });
                }

                if (result.affectedRows === 1) {
                    res.send({
                        "result": true,
                        "message": "Registration Successsfully Done"
                    });
                }
            });

        } else {
            res.send({
                "result": true,
                "message": "Phone No has Already a Account"
            });
        }
    });
});

app.post([url + '/api/sub_user/login'], (req, res) => {

    if (!connection) {
        return res.send({
            message: "No connection found"
        });
    }

    let userData = {
        phone_no: req.body.user_phone,
        password: req.body.user_password
    }

    connection.query(quaries.sub_user_login(), [userData.phone_no, userData.phone_no, userData.password], (error, result, fields) => {
        if (error) {
            return res.send({
                "error": "Fail To Login",
                "s": error
            });
        }

        if (!empty(result)) {
            res.send({
                "result": true,
                "message": "login Successful",
                "data": result
            });

        } else {
            res.send({
                "result": "true",
                "message": "Login Fail phone/id/password not match",
                "data": []
            });
        }
    });
})


// Product

app.post([url + '/api/product/add_new'], (req, res) => {

    if (!connection) {
        return res.send({
            message: "No connection found"
        });
    }

    let data = {
        product_name: req.body.product_name,
        product_id: req.body.product_id,
        account_no: req.body.user_account_no,
        visibility: 1
    }

    connection.query(quaries.get_product(), [data.account_no, data.product_name], (error, result, fields) => {
        if (error) {
            return res.send({
                "error": "Fail To Add New Product",
                "s": error
            });
        }

        if (empty(result)) {

            connection.query(quaries.add_user_product(), data, (error, result, fields) => {

                if (error) {
                    return res.send({
                        "result": true,
                        "error": "Fail To Add New Product"
                    });
                }

                if (result.affectedRows === 1) {
                    res.send({
                        "result": true,
                        "message": "Add New Product Successsfully Done"
                    });
                }
            });

        } else {
            res.send({
                "result": true,
                "message": "Product Already added"
            });
        }
    });
});



// Invoice 
app.post([url + '/api/invoice/add'], (req, res) => {

    if (!connection) {
        return res.send({
            message: "No connection found"
        });
    }

    let data = {
        invoice_no: req.body.invoice_no,
        invoice_type: req.body.invoice_type,
        sub_total: req.body.sub_total,
        net_total: req.body.net_total,
        discount: req.body.discount,
        paid: req.body.paid,
        due: req.body.due,
        invoice_date: req.body.invoice_date,
        account_no: req.body.account_no,
        poi_name: req.body.poi_name,
        poi_phone: req.body.poi_phone,
        item: req.body.item,
        inv_creator: req.body.inv_creator
    }

    let itemList = data.item;

    if (data.item.length > 1) {
        let itemStr = data.item[0];
        for (let i = 1; i < data.item.length; i++) {
            itemStr = itemStr + "~" + data.item[i];
        }
        data.item = itemStr;
    }


    connection.query(quaries.invoice_entry(), data, (error, result, fields) => {
        if (error) {
            return res.send({
                "error": "Fail To Add invoice",
                "s": error
            });
        }

        let counter = 0;
        if (result.affectedRows === 1) {

            for (let i = 0; i < req.body.item.length; i++) {
                let itemData = JSON.parse(req.body.item[i]);


                connection.query(quaries.invoice_item_entry(), itemData, (error, result, fields) => {
                    if (error) {
                        return res.send({
                            "result": true,
                            "error": "Fail To Add New Invoice"
                        });
                    }

                    if (result.affectedRows === 1) {

                        //  Stock Update 

                        connection.query(quaries.get_stock_details(), itemData.product_id, (error, stockResult, fields) => {
                            if (error) {
                                return res.send({
                                    "result": true,
                                    "error": "Fail to get Stock"
                                });
                            }

                            let Stock = stockResult[0];

                            Stock.last_buy_price = itemData.per_rate;
                            Stock.average_price = (7500 + (Stock.average_price * Stock.current_stock_qty)) / (itemData.quantity + Stock.current_stock_qty);
                            Stock.current_stock_qty = Stock.current_stock_qty + itemData.quantity;

                            connection.query(quaries.update_stock(), [Stock, itemData.product_id], (error, stockResult, fields) => {
                                if (error) {
                                    return res.send({
                                        "result": true,
                                        "error": "Fail to Update Stock"
                                    });
                                }
                                counter++;

                                if(counter == req.body.item.length){
                                    return res.send({
                                        "result": true,
                                        "error": "SuccessFully invoice added"
                                    });
                                }
                            })
                        });
                    }
                });
            }

        } else {
            res.send({
                "result": true,
                "message": "Invoice added Fail Try Again"
            });
        }
    });
});


app.listen(port, () => {
    console.log(`App running port ${port}`);
});

