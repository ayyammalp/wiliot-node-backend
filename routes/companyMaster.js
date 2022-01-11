const express = require("express");
const router = express.Router();
module.exports = router;
const { poolPromise } = require('../dbConfig')
const sql = require('mssql')

router.get('/getCompanyMasterDetails', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .query('SELECT  o.usecompany_cd , o.usecompany_name, o.end_point, o.usecompany_cd as id FROM Use_Company o', function (err, profileset) {
        if (err) {
          return res.status(400).json({ message: err.message })
        }
        else {
          var send_data = profileset.recordset;
          return res.status(200).json(send_data);
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});

router.get('/getCompanyMasterDetails/:owner_cd', async (req, res) => {
  try {
    let owner_cd = req && req.params && req.params.owner_cd ? req.params.owner_cd : '';
    if (owner_cd) {
      const pool = await poolPromise;
      await pool.request()
        .query(`SELECT  o.usecompany_cd , o.usecompany_name, o.end_point, o.usecompany_cd as id FROM Use_Company o WHERE owner_cd='${owner_cd}';`, function (err, profileset) {
          if (err) {
            return res.status(400).json({ message: err.message })
          }
          else {
            var send_data = profileset.recordset;
            return res.status(200).json(send_data);
          }
        })
    } else {
      return res.status(400).json({ message: 'Invalid params' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
});
