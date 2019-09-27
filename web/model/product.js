const { connection } = require('../connection/connection');
const quaries = require('../model/query');


// Promices Method
let getProductList = async (account_no) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.get_product_list(), [account_no], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    })
}

let getProduct = async (account_no, productName) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.get_product(), [account_no, productName], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    })
}

let addNewProduct = async (data) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.add_user_product(), data, (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    })
}


let deleteProduct = async (id, account_no) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.delete_product_list(), [id, account_no], (error, result, fields) => {            if (error) reject(error)
            if (error) reject(error)
            else resolve(result)
        });
    })
}

let updateProduct = async (data, account_no, product_id) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.update_product(), [data, account_no, product_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    })
}




module.exports = {
    getProductList,
    getProduct,
    addNewProduct,
    deleteProduct,
    updateProduct
}