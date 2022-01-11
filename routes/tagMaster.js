const express = require("express");
const router = express.Router();
module.exports = router;
const { poolPromise } = require('../dbConfig')
const sql = require('mssql')

router.get('/getTagMasterDetails', async (req, res) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .query('SELECT  o.tag_id , o.birthday, o.lifespan, o.Status, o.tag_id as id FROM Tag_Master o', function (err, profileset) {
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
