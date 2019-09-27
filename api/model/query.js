// User 

let register_account = () => {
    quary = "INSERT INTO `user` SET ? ";
    return quary;
}

let user_login = () => {
    quary = "select  name, store_name, permission, account_type, total_subscribers from user where ( phone_no = ? or account_no = ? ) and password = ?";
    return quary;
}

let check_user_account = () => {
    quary = "select  name, store_name, account_type, total_subscribers from user where phone_no = ? or account_no = ? ";
    return quary;
}

// Sub User
let register_sub_account = () => {
    quary = "INSERT INTO `sub_user` SET ? ";
    return quary;
}

let sub_user_login = () => {
    quary = "SELECT * FROM `sub_user` where ( phone_no = ? or account_no = ? ) and password = ?";
    return quary;
}

let check_sub_user_account = () => {
    quary = "SELECT * FROM `sub_user` where phone_no = ? or account_no = ?";
    return quary;
}


// Invoice
let invoice_entry = () => {
    quary = "INSERT INTO `invoice_tran` SET ? ";
    return quary;
}

let get_invoice_entry = () => {
    quary = "SELECT * FROM `invoice_tran` where invoice_no = ?";
    return quary;
}


// Invoice item
let invoice_item_entry = () => {
    quary = "INSERT INTO `invoice_tran_item` SET ? ";
    return quary;
}

let get_invoice_item_entry = () => {
    quary = "SELECT * FROM `invoice_tran_item` where invoice_no = ?";
    return quary;
}

// user_product 
let add_user_product = () => {
    quary = "INSERT INTO `user_product` SET ? ";
    return quary;
}

let get_product = () => {
    quary = "SELECT * FROM `user_product` where account_no = ? and product_name = ?";
    return quary;
}

// stock
let stock_entry = () => {
    quary = "INSERT INTO `stock` SET ? ";
    return quary;
}

let get_stock_list = () => {
    quary = "SELECT * FROM `stock` where account_no = ?";
    return quary;
}

let get_stock_details = () => {
    quary = "SELECT * FROM `stock` where product_id = ?";
    return quary;
}

let update_stock = () => {
    quary = "UPDATE `stock` SET ? where product_id = ?";
    return quary;
}


module.exports = {
register_account,
user_login,
check_user_account,
register_sub_account,
sub_user_login,
check_sub_user_account,
invoice_entry,
get_invoice_entry,
invoice_item_entry,
get_invoice_item_entry,
add_user_product,
get_product,
stock_entry,
get_stock_list,
get_stock_details,
update_stock

}