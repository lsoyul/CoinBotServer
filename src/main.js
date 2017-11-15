var express = require('express');
var cron = require('cron').CronJob;

var timeZone = 'Asia/Seoul';

var app = express();

var httpReq = require('request');


var coinArr = ["BTC(비트코인)", "ETH(이더리움)", "BCH(비트코인캐시)", "XRP(리플)", "ETC(이더리움클래식)", "LTC(라이트코인)", "DASH(대시)", "XMR(모네로)", "ZEC(제트캐시)", "QTUM(퀀텀)"];

var curPriceString;

const appVersion = "1.1";

// var postDoorayBotOptions = {
//     url: 'https://hook.dooray.com/services/1387695619080878080/2077203703197801228/J2vP4EFWR5O_1qRjZ3Z4MA',
//     method: "POST",
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: `{ "botName": "Coin Bot", "botIconImage": "http://blogpfthumb.phinf.naver.net/20151020_246/wantutopia_1445335384694u88Fg_JPEG/ori+-+%BA%B9%BB%E7%BA%BB.jpg","attachments": [{"title":"시세 알림","text": ${curPriceString},"color": "darkgreen"}]    }`
// };

var getCoinPricesOptions = {
    url: 'https://api.bithumb.com/public/ticker/all',
    method: "GET",
    headers: {
      'Content-type': 'application/json'
    }
};

var getHanRiverTemperOptions = {
    url: 'http://hangang.dkserver.wo.tc',
    method: "GET",
    headers: {
        'Content-type': 'application/json'
    }
}

function postReqCallback(error, response, body) {
    console.log("POST DoorayBot callback!");
    if (!error) {
      console.log("status 200");
    }
    else {
      //console.log(JSON.parse(body));
    }
}

function getRiverReqCallback(error, response, body){
    console.log("GET Han river temperature Callback!");
    if(!error){
        var info = (JSON.parse(body));
        console.log(info);

        
    }
}

function getReqCallback(error, response, body) {
    console.log("GET Coin Price Callback!");
    if (!error) {
      var info = (JSON.parse(body));
      console.log(info);
      console.log("status 200");

      curPriceString = '';

      curPriceString = 
      `${coinArr[0]}  : ${info.data.BTC.buy_price}\n` +
      `${coinArr[1]}  : ${info.data.ETH.buy_price}\n` +
      `${coinArr[2]}  : ${info.data.BCH.buy_price}\n` +
      `${coinArr[3]}  : ${info.data.XRP.buy_price}\n` +
      `${coinArr[4]}  : ${info.data.ETC.buy_price}\n` +
      `${coinArr[5]}  : ${info.data.LTC.buy_price}\n` +
      `${coinArr[6]}  : ${info.data.DASH.buy_price}\n` +
      `${coinArr[7]}  : ${info.data.XMR.buy_price}\n` +
      `${coinArr[8]}  : ${info.data.ZEC.buy_price}\n` +
      `${coinArr[9]}  : ${info.data.QTUM.buy_price}\n`;

      console.log(`${curPriceString}`);

      var postDoorayBotOptions = {
        //url:"https://hook.dooray.com/services/1387695619080878080/2077237717894724234/Z23w-9UfQ9yZn3bQIYYltQ", //테스트
        url: "https://hook.dooray.com/services/1387695619080878080/2042404607776494474/IsYkDTyhQ2eoTc8mdrwOBw",
        headers: {
          "Content-type": "application/json"
        },
        body: { 
            "title" : "hi",
            "botName": `콜라비 v${appVersion}`, 
            "botIconImage": "https://i.imgur.com/pne02Pe.png",
            "attachments": [
                {
                    "title":"Coin Market Price",
                    "image": "https://i.imgur.com/1qwqR6f.jpg",
                    "text": `<h5><font color="red">${curPriceString}</font></h5>`,
                    "color": "darkgreen"
                }
            ]    
        },
        json:true
    };

      httpReq.post(postDoorayBotOptions, postReqCallback);
      
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


app.get('/getCurrency', function(req, res){

    var target = req.query.coin;

    httpReq.get(`https://api.bithumb.com/public/ticker/${target}`, processRequest);
     

    function processRequest(error, response, body){
        if(!error){
            var info = (JSON.parse(body));
            console.log(info);
    
            res.send(`${target} price : ${info.data.buy_price}`);
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


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

// var cronJob = new cron('*/2 * * * * *', function(){
var cronJob = new cron('00 00 12 * * *', function(){

    httpReq.get(getCoinPricesOptions, getReqCallback);

    console.log('yeah!');

}, null, true, timeZone);

app.listen(3000, function(){
    console.log('Connected 3000 port!');
});
