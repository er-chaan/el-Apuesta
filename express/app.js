var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbConn = require('./db');
var config = require('./config');
var cors = require('cors');



// starts
var openMiddleware = function (req, res, next) {
    token = req.headers.token;
    email = req.headers.email;
    if (token == 'x' && email == 'x') {
        next();
    } else {
        res.status(401).send("unauthorized");
    }
}

var closedMiddleware = function (req, res, next) {
    token = req.headers.token;
    email = req.headers.email;
    if (token) {
        if (token != 'x') {
            dbConn.query('SELECT id FROM users WHERE ? AND ?', [{ email: email }, { token: token }], function (error, results, fields) {
                if (error) {
                    return res.status(200).send({ status: false, error: error.sqlMessage });
                } else {
                    if (results.length) {
                        next();
                    } else {
                        res.status(401).send("unauthorized");
                    }
                }
            });
        } else {
            res.status(401).send("unauthorized");
        }
    } else {
        res.status(401).send("unauthorized");
    }
}


var paymentGatewayMiddleware = function (req, res, next) {
    next();
return
    mid = req.body.MID;
    if (mid == config.paytmMid || mid == config.paytmMid) {
        next();
    } else {
        res.status(401).send("unauthorized");
    }
}


var adminMiddleware = function (req, res, next) {
    token = req.headers.token;
    email = req.headers.email;
    if (token) {
        if (token != 'x') {
            if (email != 'er.chandreshbhai@gmail.com') {
                res.status(401).send("unauthorized");
            } else {
                dbConn.query('SELECT id FROM users where ? AND ?', [{ email: email }, { token: token }], function (error, results, fields) {
                    if (error) {
                        return res.status(200).send({ status: false, error: error.sqlMessage });
                    } else {
                        if (results.length) {
                            next();
                        } else {
                            res.status(401).send("unauthorized");
                        }
                    }
                });
            }
        } else {
            res.status(401).send("unauthorized");
        }
    } else {
        res.status(401).send("unauthorized");
    }
}
// ends



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var notificationsRouter = require('./routes/notifications');
var boardRouter = require('./routes/board');
var betsRouter = require('./routes/bets');
var userRouter = require('./routes/user');
var walletRouter = require('./routes/wallet');
var callbackRouter = require('./routes/callback');
var supportRouter = require('./routes/support');
var transactionsRouter = require('./routes/transactions');

app.use('/', indexRouter);
app.use('/auth', openMiddleware, authRouter);
app.use('/notifications', closedMiddleware, notificationsRouter);
app.use('/board', closedMiddleware, boardRouter);
app.use('/bets', closedMiddleware, betsRouter);
app.use('/user', closedMiddleware, userRouter);
app.use('/wallet', closedMiddleware, walletRouter);
app.use('/callback', paymentGatewayMiddleware, callbackRouter);
app.use('/support', closedMiddleware, supportRouter);
app.use('/transactions', closedMiddleware, transactionsRouter);

// admin
var adminRouter = require('./routes/admin.js');
app.use('/admin', adminMiddleware, adminRouter);



module.exports = app;
