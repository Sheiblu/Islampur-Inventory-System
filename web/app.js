const express = require("express");
const bodyParser = require('body-parser');
const { connection } = require('./connection/connection');
const quaries = require('./model/query');
const stockRouter = require('./router/stock');
const productRouter = require('./router/product');
const empty = require('is-empty');
const verifyLogin = require('./verify/loginCheck');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;


var url = "";
var base_url = "http://localhost:" + port;


app.use(session(
    {
        secret: "Develop by Rename Tech Software Limited",
        resave: true,
        saveUninitialized: true
    }
));

app.use(function (req, res, next) {
    res.locals.url = base_url;
    res.locals.default_value = 0;
    res.locals.user_name = (req.session.user_name) ? req.session.user_name : "";
    res.locals.store_name = (req.session.store_name) ? req.session.store_name : "";
    next();
});


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(url + '/stock', stockRouter);
app.use(url + '/product', productRouter);

app.get([url + '/', url + "/home"], verifyLogin, (req, res) => {
    return res.render('invoice1', {
        "page": "Home"
    });
});


app.get(url + "/login", (req, res) => {
    if (req.session.is_login_admin === true) {
        return res.redirect(url + "/home");
    }
    res.render('login', {
        page: "login",
        message: ""
    });
});


app.post(url + "/login", (req, res) => {
    if (req.session.is_login === true) {
        return res.redirect(url + "/home");
    }

    let userData = {
        "phone_no": req.body.user_phone,
        "password": req.body.user_password
    }

    if (empty(userData.phone_no) || empty(userData.password)) {
        return res.render('login', {
            message: "Please full up all fields currectly",
            page: "login",
        });
    }

    connection.query(quaries.user_login(), [userData.phone_no, userData.phone_no, userData.password], (error, result, fields) => {
        if (error) {
            return res.render('login', {
                message: "SOMETHING WRONG TRY AGAIN PLEASE",
                page: "login",
            });
        }

        if (empty(result)) {
            return res.render('login', {
                message: "Wrong Email or Password or Both",
                page: "login",
            });
        };

        req.session.is_login = true;
        req.session.user_name = result[0].name;
        req.session.store_name = result[0].store_name;
        req.session.account_id = result[0].account_no;
        return res.redirect(url + "/home")


    });


});

app.get(url + '/logout', verifyLogin, (req, res) => {
    req.session.destroy(() => {
        console.log("Session distroyed");
    });
    res.redirect(url + '/login');
});

app.get(url + '/invoice_list', verifyLogin, (req, res) => {

    let account_no = req.session.account_id ? req.session.account_id : "";
    connection.query(quaries.get_invoice_list(), [account_no], (error, result, fields) => {
        if (error) {
            return res.render('invoice_list', {
                "page": "invoice_list"
            });
        }
        return res.render('invoice_list', {
            "page": "invoice_list",
            "data": result
        });
    });
});


//   User
app.get(url + "/add_user", (req, res) => {
    res.render('add_user', {
        page: "add user",
        message: ""
    });
});

app.get(url + "/user_list", verifyLogin, (req, res) => {
    let account_no = req.session.account_id ? req.session.account_id : "";
    connection.query(quaries.get_sub_user_list(), [account_no], (error, result, fields) => {
        if (error) {
            return res.send({
                "error": "Error"
            });
        }
        return res.render('user_list', {
            "page": "user_list",
            "data": result
        });
    });
});

app.post(url + "/sub_user_delete", verifyLogin, (req, res) => {
    let account_no = req.session.account_id ? req.session.account_id : "";
    let data = {
        "deleteUserId": req.body.deleteUserId,
        "deleteOwnerId": req.body.deleteOwnerId
    }

    connection.query(quaries.delete_sub_user(), [data.deleteUserId, data.deleteOwnerId], (error, result, fields) => {
        if (error) {
            return res.send({
                "Error": error
            })
        }

        if (result.affectedRows > 0) {
            return res.redirect(url + '/user_list');
        } else {
            return res.send({
                "Error": error,
                "message": "Something Wrong try again "
            })
        }
    });
});

app.post(url + "/update_sub_user_profile", verifyLogin, (req, res) => {
    var account_no = req.session.account_id ? req.session.account_id : "";

    let permissionArray = req.body.user_permission;
    let permission = "No";

    if (permissionArray.length > 0) {
        permission = permissionArray[0];

        for (let i = 1; i < permissionArray.length; i++) {
            permission = permission + "~" + permissionArray[i];
        }
    }
    let data = {
        "name": req.body.user_name,
        "phone_no": req.body.user_phone,
        "permission": permission
    }

    connection.query(quaries.check_sub_user_phone_no(), [data.user_phone, account_no], (error, result, fields) => {
        if (error) {
            return res.send({
                "page": "add user",
                "error": error,
                "message": "Add fail for error"
            })
        }
        if (!empty(result)) {
            return res.redirect(url + '/user_list');
        } else {
            connection.query(quaries.update_sub_user(), [data, req.body.user_account, account_no], (error, result, fields) => {
                if (error) {
                    return res.send({
                        "Error": error
                    })
                }
                if (result.affectedRows > 0) {
                    return res.redirect(url + '/user_list');
                } else {
                    return res.send({
                        "Error": true,
                        "message": "Something Wrong try again"
                    })
                }
            });
        }
    });
});


app.post(url + "/add_sub_user", verifyLogin, (req, res) => {
    if (!connection) {
        return res.send({
            message: "No connection found"
        });
    }

    let permissionArray = req.body.user_permission;
    let permission = "No";

    if (permissionArray.length > 0) {
        permission = permissionArray[0];

        for (let i = 1; i < permissionArray.length; i++) {
            permission = permission + "~" + permissionArray[i];
        }
    }
    let data = {
        "name": req.body.user_name,
        "phone_no": req.body.user_phone,
        "account_no": "Ac" + new Date().getDate() + req.session.account_id + "-" + new Date().getMilliseconds(),
        "owner_account_no": req.session.account_id ? req.session.account_id : "",
        "permission": permission,
        "password": req.body.user_password
    }

    connection.query(quaries.check_sub_user_account(), [data.phone_no, data.account_no], (error, result, fields) => {
        if (error) {
            return res.send({
                "page": "add user",
                "error": error,
                "message": "Add fail for error"
            })
        }
        if (!empty(result)) {
            return res.render('add_user', {
                "page": "add User",
                "error": error,
                "message": "User Already Exist"
            });

        } else {
            connection.query(quaries.register_sub_account(), data, (error, result, fields) => {
                if (error) {
                    return res.render('add_user', {
                        "page": "add_user",
                        "error": error,
                        "message": "Error"
                    });
                }

                if (empty(result)) {
                    return res.render('add_user', {
                        "page": "add_user ",
                        "error": error,
                        "message": "Somethink Wrong Try Again"
                    });
                } else {
                    res.redirect(url + '/user_list');
                }
            });
        }

    });

});


app.get(url + '/invoice_details', verifyLogin, (req, res) => {

    let account_no = req.session.account_id ? req.session.account_id : "";
    let invoice_no = req.query.id ? req.query.id : "";
    connection.query(quaries.get_invoice_entry(), [invoice_no, account_no], (error, result, fields) => {
        if (error) {
            return res.render('invoice_list', {
                "page": "invoice_list"
            });
        }

        let list = result[0].item.split("~");
        for (let i = 0; i < list.length; i++) {
            list[i] = JSON.parse(list[i]);
        }

        return res.render('invoice', {
            "page": "invoice",
            "item": result,
            "child_item": list
        });
    });
});

app.get('/tt', async (req, res) => {
    // getInvoiceData
    let name = await testno.getInvoiceData("ac03");
    return res.send({
        result : name
    })
});

app.listen(port, () => {
    console.log(`App running port ${port}`);
});
