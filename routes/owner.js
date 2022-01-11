const express = require("express");
const router = express.Router();
module.exports = router;
const { poolPromise } = require('../dbConfig')
const sql = require('mssql')

// get owners details
router.get('/getOwners', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .query('select  o.owner_cd , o.owner_name, o.owner_cd as id from Owners o', function (err, profileset) {
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

// add owner
router.post('/addOwner', async (req, res) => {
  try {
    let owner_cd = req && req.body && req.body.owner_cd ? req.body.owner_cd : '';
    let owner_name = req && req.body && req.body.owner_name ? req.body.owner_name : '';
    if (owner_cd && owner_name) {
      const pool = await poolPromise
      const request = pool.request()
      request.input('owner_cd', sql.VarChar, req.body.owner_cd);
      request.input('owner_name', sql.VarChar, req.body.owner_name)
      request.query('insert into Owners (owner_cd, owner_name) values (@owner_cd, @owner_name)', (err, result) => {
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

//delete owners
router.delete('/deleteOwners', async (req, res) => {
  try {
    let deleteIds = req && req.body && req.body.ids ? req.body.ids.map(x => "'" + x + "'").toString()
    : '';
    if (deleteIds) {
      const pool = await poolPromise
      const request = pool.request()
      request.query(`DELETE FROM Owners WHERE owner_cd IN (${deleteIds})`,
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



