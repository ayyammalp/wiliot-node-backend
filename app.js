const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


//Import Routes
const Owner = require('./routes/owner');
const Device_master = require('./routes/deviceMaster');
const Std_Input = require('./routes/std_input');
const Attribute_master = require('./routes/AttributeMaster');
const Location_master = require('./routes/locationMaster');
const Tag_master = require('./routes/tagMaster');
const Company_Master = require('./routes/companyMaster');

app.use('/owners', Owner);
app.use('/deviceMaster', Device_master);
app.use('/stdInput', Std_Input);
app.use('/attributeMaster', Attribute_master);
app.use('/locationMaster', Location_master);
app.use('/tagMaster', Tag_master);
app.use('/companyMaster', Company_Master);


app.get('/', (req,res) => {
    res.send('Hello World - Node Backend!')
});

//Start listening to the server
app.listen(port, () => {
    console.log(`node-backend running at http://localhost:${port}`)
  })