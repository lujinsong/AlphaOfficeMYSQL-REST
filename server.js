'use strict';

var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var mysql      = require('mysql')
var hostString = process.argv[2]
var connection = mysql.createConnection({
    host     : '140.86.13.9',
    port     : '1521',
    user     : 'root',
    password : 'Alpha2014_',
    database : 'AlphaOfficeDB'
});

var port = process.env.PORT || 8002
var app = express()

app.use(bodyParser.json())
app.use(express.static(__dirname))

app.get('/', function(req, res) {
	res.send('index.html')
})

/*
 * We define a new route /products. First thing we need to do when this route is
 * hit is get a connection, then we fire the sql and finally convert the data to
 * the format our application can consume
 */

app.get('/products', function(req, res) {

	console.log('/products api called')

    connection.query('SELECT * from PRODUCTS', function(err, rows, fields) {
        if (err) {
            console.log('Error while performing Query.');
            return;
        }
        console.log('sql executed')
	    console.log(rows);
        var products = {"Products" : rows}
        res.end(JSON.stringify(products));
    });
});

app.get('/searchProductNames', function(req, res) {

	console.log('/productNames api called')

    connection.query("SELECT PRODUCT_NAME, PRODUCT_ID from PRODUCTS where PRODUCT_NAME like '" + req.query.term + "%'", function(err, rows, fields) {
        if (err) {
            console.log('Error while performing Query.');
            return;
        } 
	    console.log('sql executed')
	    console.log(rows);
        var availableProducts = [];
            for (var i=0; i < rows.length; i++) {
                availableProducts.push ({"value" : rows[i].PRODUCT_NAME, "id" : rows[i].PRODUCT_ID});
            }
	    res.json(availableProducts);
    });
});

app.get('/productNames', function(req, res) {

	console.log('/productNames api called')

    connection.query('SELECT PRODUCT_NAME, PRODUCT_ID from PRODUCTS', function(err, rows, fields) {
        if (err) {
            console.log('Error while performing Query.');
            return;
        }
	    console.log('sql executed')
	    console.log(rows);
        var productNames = {"ProductNames" : rows}
        res.end(JSON.stringify(productNames));
    });
});

app.get('/product/:id', function(req, res) {

	console.log('/product api called')

    connection.query('SELECT * from PRODUCTS where PRODUCT_ID = ' + req.params.id, function(err, rows, fields) {
        if (err) {
            console.log('Error while performing Query.');
            return;
        }
	    console.log('sql executed')
	    console.log(rows);
        var product = {"Product" : rows[0]}
        res.end(JSON.stringify(product));
    });
});

app.listen(port, function() {
	console.log('AlphaOffice listening on port ' + port)

});
