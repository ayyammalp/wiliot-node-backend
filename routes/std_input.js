const express = require("express");
const router = express.Router();
module.exports = router;
const { poolPromise } = require('../dbConfig')
const sql = require('mssql')

// select distinct gatewayIDs
  router.get('/getDetectedGatewayIds', async (req, res) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .query('select distinct gateway_id from Location_Master', function (err, profileset) {
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

// select distinct event names by gatewayId
  router.get('/selectDistictEventNamesByGatewayId', async (req, res) => {
    try {
      console.log("req",req.query.gatewayIds.split(','))
      const selectedGatewayIds = req.query.gatewayIds.split(',');
      const pool = await poolPromise;
      await pool.request()
        .query('select distinct sied.eventName from std_input_data sid, std_input_event_data sied where sid.detected_gateway_id in (\''+selectedGatewayIds.toString()+'\') and sid.message_id = sied.message_id', function (err, profileset) {
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

// gateway summary by gatewayId and EventName
router.get('/gatewaySummaryByGatewayIDEventName', async (req, res) => {
  try {
    console.log("req gatewayIds ",req.query.gatewayIds.split(',').join("','")+"'")
    console.log("req eventName ",req.query.eventNames.split(',').join("','")+"'")
    const selectedGatewayIds = "'"+req.query.gatewayIds.split(',').join("','")+"'";
    const selectedEventNames = "'"+req.query.eventNames.split(',').join("','")+"'";
    //console.log('select sid.detected_gateway_id, Count(distinct sid.tag_id) as tag_id_count, Count(sied.eventName) as event_name_count from std_input_data sid, std_input_event_data sied where sid.detected_gateway_id in ('+selectedGatewayIds+') and sid.message_id = sied.message_id and sied.eventName in ('+selectedEventNames+') group by sid.detected_gateway_id')
    const pool = await poolPromise;
    await pool.request()
      .query('select sid.detected_gateway_id, Count(distinct sid.tag_id) as noOfRecepients, Count(sied.eventName) as noOfEvents, sid.detected_gateway_id as id from std_input_data sid, std_input_event_data sied where sid.detected_gateway_id in ('+selectedGatewayIds+') and sid.message_id = sied.message_id and sied.eventName in ('+selectedEventNames+') group by sid.detected_gateway_id', function (err, profileset) {
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

// tags seen summary by gatewayId
router.get('/tagsSeenSummaryByGatewayId', async (req, res) => {
  try {
    console.log("req gatewayId ",req.query.gatewayId)
    const pool = await poolPromise;
    await pool.request()
      .query('select sid.timestamp, sid.tag_id, sied.eventName, sied.eventValue, sid.detected_gateway_id, id =sid.message_id from std_input_data sid, std_input_event_data sied where sid.detected_gateway_id = \''+req.query.gatewayId+'\'and sid.message_id = sied.message_id', function (err, profileset) {
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