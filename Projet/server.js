const express = require('express');
const app = new express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/views/index.html');
})

app.listen(process.env.port || 3000);