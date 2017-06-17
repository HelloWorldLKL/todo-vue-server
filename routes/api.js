const express = require('express');
const router = express.Router();
// 导入MySQL模块
const mysql = require('mysql');
const dbConfig = require('../db/DBConfig.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('test', 'root', '8767491969', {
    host: '127.0.0.1',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

const User = sequelize.define('user', {
    uID: {
        type: Sequelize.STRING(11),
        primaryKey: true,
        autoIncrement: true
    },
    uName: Sequelize.STRING(11),
    uPassword: Sequelize.STRING(11)
}, {
    timestamps: false
});

const Info = sequelize.define('info', {
    iID: {
        type: Sequelize.STRING(11),
        primaryKey: true,
        autoIncrement: true
    },
    iInfo: Sequelize.STRING(20),
    iComplete: Sequelize.STRING(11),
    uID: Sequelize.STRING(11)
}, {
    timestamps: false
});

// 响应一个JSON数据
var responseJSON = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '100',
            msg: '操作失败'
        });
    } else {
        res.json({
            code: '200',
            msg: '操作成功',
            data: ret
        });
    }
};
// 根据uID获取info信息
router.get('/info', function(req, res, next) {
    let param = req.query || req.params;
    Info.findAll({
        where: {
            uID: param.uID
        }
    }).then(function(info) {
        for (let i of info) {
            if (i.iComplete == '0') {
                i.iComplete = false
            } else {
                i.iComplete = true
            }
        }
        responseJSON(res, info);
    }).catch(function(err) {
        responseJSON(res, undefined);
        console.log('failed: ' + err);
    });
});
// 增添用户信息
router.post('/addUser', function(req, res, next) {
    let param = req.body;
    User.create({
        uName: param.uName,
        uPassword: param.uPassword
    }).then(function(info) {
        responseJSON(res, info);
    }).catch(function(err) {
        responseJSON(res, undefined);
        console.log('failed: ' + err);
    });
});
// 验证用户信息
router.post('/checkUser', function(req, res, next) {
    let param = req.body;
    User.findAll({
        where: {
            uName: param.uName,
            uPassword: param.uPassword
        }
    }).then(function(info) {
        if (info.length === 0) {
            responseJSON(res, undefined);
            return;
        }
        responseJSON(res, info);
    }).catch(function(err) {
        responseJSON(res, undefined);
        console.log('failed: ' + err);
    });
});
// 根据uID增添todo信息
router.post('/addInfo', function(req, res, next) {
    let param = req.body;
    Info.create({
        iInfo: param.iInfo,
        iComplete: 0,
        uID: param.uID
    }).then(function(info) {
        if (info.length === 0) {
            responseJSON(res, undefined);
            return;
        }
        responseJSON(res, info);
    }).catch(function(err) {
        responseJSON(res, undefined);
        console.log('failed: ' + err);
    });
});
// 根据iID删除todo信息
router.post('/deleteInfo', function(req, res, next) {
    let param = req.body;
    Info.destroy({
        where: {
            iID: param.iID
        }
    }).then(function(info) {
        responseJSON(res, info);
        console.log('delete sucess');
    }).catch(function(err) {
        responseJSON(res, undefined);
        console.log('failed: ' + err);
    });
});
// 根据iID改变complete属性
router.post('/todoComplete', function(req, res, next) {
    let param = req.body;
    Info.update({
        iComplete: param.iComplete,
    }, {
        where: {
            iID: param.iID
        }
    }).then(function(info) {
        responseJSON(res, info);
        console.log(info)
    }).catch(function(err) {
        responseJSON(res, undefined);
        console.log('failed: ' + err);
    });
});
module.exports = router;