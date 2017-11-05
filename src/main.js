var express = require('express');
var cron = require('cron').CronJob;

var timeZone = 'Asia/Seoul';

var app = express();

var httpReq = require('request');


var coinArr = ["BTC", "ETH", "BCH", "XRP", "ETC", "LTC", "DASH", "XMR", "ZEC", "QTUM"];


var postDoorayBotOptions = {
    url: 'https://postman-echo.com/post',
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },
    body: '{ "username": "admin", "password": "fsdf"}'
};

var getCoinPricesOptions = {
    url: 'https://api.bithumb.com/public/ticker/all',
    method: "GET",
    headers: {
      'Content-type': 'application/json'
    }
};

function postReqCallback(error, response, body) {
    console.log("POST DoorayBot callback!");
    if (!error) {
      var info = (JSON.parse(body));
      console.log(info);
      console.log("status 200");
    }
    else {
      console.log(JSON.parse(body));
    }
}

function getReqCallback(error, response, body) {
    console.log("GET Coin Price Callback!");
    if (!error) {
      var info = (JSON.parse(body));
      console.log(info);
      console.log("status 200");

      console.log(`${coinArr[0]} price : ${info.data.BTC.buy_price}`);
      console.log(`${coinArr[1]} price : ${info.data.ETH.buy_price}`);
      console.log(`${coinArr[2]} price : ${info.data.BCH.buy_price}`);
      console.log(`${coinArr[3]} price : ${info.data.XRP.buy_price}`);
      console.log(`${coinArr[4]} price : ${info.data.ETC.buy_price}`);
      console.log(`${coinArr[5]} price : ${info.data.LTC.buy_price}`);
      console.log(`${coinArr[6]} price : ${info.data.DASH.buy_price}`);
      console.log(`${coinArr[7]} price : ${info.data.XMR.buy_price}`);
      console.log(`${coinArr[8]} price : ${info.data.ZEC.buy_price}`);
      console.log(`${coinArr[9]} price : ${info.data.QTUM.buy_price}`);
      
    }
    else {
      console.log(JSON.parse(body));
    }
}


// static 파일이 위치할 곳을 지정!
app.use(express.static('public'));


app.get('/', function(req, res) {
    res.send('This is home page!');
});

// app.get('/login', function(req, res){
//     res.send('Login page');
// });

app.get('/getCurrency', function(req, res){

    var target = req.query.coin;

    xhr.open('GET', `https://api.bithumb.com/public/ticker/${target}`, true);
    xhr.send();
     
    xhr.onreadystatechange = processRequest;

    function processRequest(e){
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            var response = JSON.parse(xhr.responseText);
            
            res.send(`${target} price : ${response.data.buy_price}`);
        }
    }
    
});

app.get('/posttest', function(req, res){

    httpReq.post(postDoorayBotOptions, postReqCallback);
    res.send();
});

app.get('/gettest', function(req, res){
    
    httpReq.get(getCoinPricesOptions, getReqCallback);
    res.send();
});

// app.get('/getCurrencyAll', function(req, res){
    
    
//     xhr.open('GET', `https://api.bithumb.com/public/ticker/all`, true);
//     xhr.send();
         
    
//     xhr.onreadystatechange = processRequest;
    
//     function processRequest(e){
//         if(xhr.readyState == 4 && xhr.status == 200)
//         {
//             var response = JSON.parse(xhr.responseText);
                
//             res.write(`${coinArr[0]} price : ${response.data.BTC.buy_price}\n`);
//             res.write(`${coinArr[1]} price : ${response.data.ETH.buy_price}\n`);
//             res.write(`${coinArr[2]} price : ${response.data.BCH.buy_price}\n`);
//             res.write(`${coinArr[3]} price : ${response.data.XRP.buy_price}\n`);
//             res.write(`${coinArr[4]} price : ${response.data.ETC.buy_price}\n`);
//             res.write(`${coinArr[5]} price : ${response.data.LTC.buy_price}\n`);
//             res.write(`${coinArr[6]} price : ${response.data.DASH.buy_price}\n`);
//             res.write(`${coinArr[7]} price : ${response.data.XMR.buy_price}\n`);
//             res.write(`${coinArr[8]} price : ${response.data.ZEC.buy_price}\n`);
//             res.write(`${coinArr[9]} price : ${response.data.QTUM.buy_price}\n`);

//             res.end();
//         }
//     }
// });

var cronJob = new cron('*/30 * * * * *', function(){
    
    console.log('yeah!');

}, null, true, timeZone);

app.listen(3000, function(){
    console.log('Connected 3000 port!');
});
