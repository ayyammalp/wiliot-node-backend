const sql = require('mssql')
const config = {
  /**user: 'SA',  
  password: 'Sato@2021',  
  server: "10.78.236.116",  
  database: "Sato",
  options: {
      trustedconnection:  true,
      enableArithAbort:  true
  }*/
  user: 'ramkumar',
  password: 'mrvarsha@18',
  server: "ramserverdb.database.windows.net",
  database: "RAMDB",
  options: {
     trustedconnection: true,
     enableArithAbort: true
  }
}

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
module.exports = {
  sql, poolPromise
}



