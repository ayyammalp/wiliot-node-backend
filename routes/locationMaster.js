const express = require("express");
const router = express.Router();
module.exports = router;
const { poolPromise } = require('../dbConfig')

router.get('/getUseCompanyNames', async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request().query("SELECT DISTINCT usecompany_cd, usecompany_name FROM Use_Company", function (err, result) {
            if (err) {
                console.log(err)
                return res(err.message)
            } else {
                var data = result.recordset;
                return res.json(data);
            }
        })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

router.get('/getLocationNamesByCompanyCode', async (req, res) => {
    try {
        const pool = await poolPromise;
        const queryStr = "SELECT DISTINCT location_cd, location_name FROM Location_Master WHERE usecompany_cd = '" + req.query.usecompany_cd + "'";
        await pool.request().query(queryStr, function (err, result) {
            if (err) {
                console.log(err)
                return res(err.message)
            } else {
                var data = result.recordset;
                return res.json(data);
            }
        })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

router.get('/getSecNamesByComAndLocCodes', async (req, res) => {
    try {
        const pool = await poolPromise;
        const queryStr = "SELECT DISTINCT section_cd, section_name FROM Location_Master WHERE usecompany_cd = '" 
        + req.query.usecompany_cd + "'" + " AND location_cd = '" + req.query.location_cd + "'";
        await pool.request().query(queryStr, function (err, result) {
            if (err) {
                console.log(err)
                return res(err.message)
            } else {
                var data = result.recordset;
                return res.json(data);
            }
        })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

router.get('/getLocMasterDetailsByComLocAndSecCodes', async (req, res) => {
    try {
        const pool = await poolPromise;
        const queryStr = "select lm.location_cd + ',' + lm.gateway_id as id, lm.gateway_id from Location_Master lm WHERE lm.usecompany_cd = '" + req.query.usecompany_cd + "'" + " AND lm.location_cd = '" + req.query.location_cd + "'" + " AND lm.section_cd = '" + req.query.section_cd + "'";
        //const queryStr = 'SELECT id, gateway_id FROM Location_Master WHERE usecompany_cd = \''  + req.query.usecompany_cd + '\'' + ' AND location_cd = \'' + req.query.location_cd + '\'' + ' AND section_cd = \'' + req.query.section_cd + '\'';
        await pool.request().query(queryStr, function (err, result) {
            if (err) {
                console.log(err)
                return res(err.message)
            } else {
                var data = result.recordset;
                return res.json(data);
            }
        })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});
