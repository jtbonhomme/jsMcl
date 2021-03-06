var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.logger());

// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/..');

app.configure(function() {
    app.use(express.static(__dirname));
});

app.get('/', function(req, res){
    res.render('index');
});

var port = 3000;

app.listen(port);

console.log('Express server started on port %s', port);