var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var api = require('./routes/api.js');


app.use('/api', api);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('OK');
});