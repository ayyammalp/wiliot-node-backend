const express = require("express");
const router = express.Router();

module.exports = router;
const { poolPromise } = require('../dbConfig')
const sql = require('mssql')


router.get('/getOwnerNames', async (req, res) => {
  console.log("getDistinctOwnerNames called");
  try {
    const pool = await poolPromise;
    await pool.request()
      //.query('select distinct am.owner_cd, o.owner_name from Attribute_Master am, Owners o where am.owner_cd = o.owner_cd', function (err, profileset) {
    .query('select distinct o.owner_cd, o.owner_name from Owners o', function (err, profileset) {
        if (err) {
          console.log(err)
          return res.status(400).json({ message: err.message })
        }
        else {
          var send_data = profileset.recordset;
          return res.status(200).json(send_data)
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});

router.get('/getDeviceNames', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      //.query('select distinct am.device_cd, d.device_name from Attribute_Master am, Device_Master d where am.device_cd = d.device_cd', function (err, profileset) {
      .query('select distinct d.device_cd, d.device_name from Device_Master d', function (err, profileset) {

        if (err) {
          console.log(err)
          return res.status(400).json({ message: err.message })
        }
        else {
          var send_data = profileset.recordset;
          return res.status(200).json(send_data)
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});

router.get('/getAttributeMasterData', async (req, res) => {
  try {
    var owner_cd = req.query.owner_cd;
    var device_cd = req.query.device_cd;
    console.log("owner_cd   ------ " + owner_cd);
    console.log("device_cd   ------ " + device_cd);
    var query = "select am.attribute_cd, am.attribute_name, am.attribute_cd as id from Attribute_Master am where owner_cd = '" + owner_cd + "' and device_cd = '" + device_cd + "'"
    console.log("Query ---- " + query);
    const pool = await poolPromise;
    await pool.request()
      .query("select CONCAT(am.owner_cd, '_', am.device_cd, '_', am.attribute_cd) as id, am.attribute_cd, am.attribute_name from Attribute_Master am where owner_cd = '" + owner_cd + "' and device_cd = '" + device_cd + "'", function (err, profileset) {
        //.query('select distinct d.device_cd, d.device_name from Device_Master d', function (err, profileset) {
        if (err) {
          console.log(err)
          return res.status(400).json({ message: err.message })
        }
        else {
          var send_data = profileset.recordset;
          return res.status(200).json(send_data)
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});

router.get('/getAttributeMasters', async (req, res) => {
  try {
    var query = "select CONCAT(am.owner_cd, '_', am.device_cd, '_', am.attribute_cd) as id, am.attribute_cd, am.attribute_name from Attribute_Master am";
    console.log("Query ---- " + query);
    const pool = await poolPromise;
    await pool.request()
      .query(query , function (err, profileset) {
        if (err) {
          console.log(err)
          return res.status(400).json({ message: err.message })
        }
        else {
          var send_data = profileset.recordset;
          return res.status(200).json(send_data)
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});




