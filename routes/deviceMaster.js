const express = require("express");
const router = express.Router();
module.exports = router;
const { poolPromise } = require('../dbConfig')
const sql = require('mssql')

// get device details
router.get('/getDeviceMaster', async (req, res) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .query('select d.device_cd , d.device_name, d.device_cd as id from Device_Master d', function (err, profileset) {
          if (err) {
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

// add deviceMaster
router.post('/addDeviceMaster', async (req, res) => {
  try {
    let device_cd = req && req.body && req.body.device_cd ? req.body.device_cd : '';
    let device_name = req && req.body && req.body.device_name ? req.body.device_name : '';
    if (device_cd && device_name) {
      const pool = await poolPromise
      const request = pool.request()
      request.input('device_cd', sql.VarChar, req.body.device_cd);
      request.input('device_name', sql.VarChar, req.body.device_name)
      request.query('insert into Device_Master (device_cd, device_name) values (@device_cd, @device_name)', (err, result) => {
        if (err) {
          return res.status(400).json({ message: err.message })
        }
        else {
          return res.status(200).json({ message: 'Data saved successfully' })
        }
      })
    } else {
      return res.status(400).json({ message: 'Invalid request data' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

//delete device
router.delete('/deleteDeviceMaster', async (req, res) => {
  try {
    let deleteIds = req && req.body && req.body.ids ? req.body.ids.map(x => "'" + x + "'").toString()
      : '';
    if (deleteIds) {
      const pool = await poolPromise
      const request = pool.request()
      request.query(`DELETE FROM Owners WHERE device_cd IN (${deleteIds})`,
        (err, result) => {
          if (err) {
            return res.status(400).json({ message: err.message })
          }
          else {
            return res.status(200).json({ message: 'Deleted successfully' })
          }
        })
    } else {
      return res.status(400).json({ message: 'Invalid request data' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

