const { connection } = require('../connection/connection');
const quaries = require('../model/query');


// Promices Method
let getStockList = async (account_no) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.get_stock_list(), [account_no], (error, result, fields) => {
            if (error) {
                reject(error);
            } else resolve(result);
        });
    });
}

let updateStock = async (data, product_id) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.update_stock(), [data, product_id], async (error, result, fields) => {
            if (error) {
                reject(error); //"Stock Fail"
            } else {
                resolve(result); // "Stock Update Successfully"
            }
        });
    });
}

let addStock = async (stockData) => {
    return new Promise((resolve, reject) => {
        connection.query(quaries.stock_entry(), stockData, (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

module.exports = {
    getStockList,
    updateStock,
    addStock
}