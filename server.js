var express = require('express');
var app = express();

app.use('/api', require('./api'));

app.use('/public', express.static(__dirname + '/public'));

app.get('*', function(req,res) {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(3000, function () {
  console.log('UCI GUI listening on port 3000!');
});
