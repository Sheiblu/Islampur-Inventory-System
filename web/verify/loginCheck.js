const express = require('express');
const router = express.Router();
var url = "";

router.use(function(req, res, next){
    console.log(req.session.is_login);
    if(req.session.is_login) next();
    else res.redirect(url + '/login');
});

module.exports = router;