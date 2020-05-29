const swiggy = require("./swiggy");
const zomato = require('./zomato');
const db = require("./db").db;
const Restaurant = require("./models/restaurant");
const Toppick = require("./models/toppicks");        
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request=require('request-promise');
const Logger = require('./services/logger_service');
const logger = new Logger('app')

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended : true}));
 
var server = app.listen(3000, function(){
    //console.log("hey its working");
    logger.info("app launched in port 3000");
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/toppick', (req, res) => {
    
    (async () => {
                     const body = req.body
                     let error = {}
                    // Adding body of the request as log data
                    logger.setLogData(body)
                    let query = req.query.location;
                    logger.info("Request recieved at /toppick got location" , query)
                    await swiggy.initialize(query);
                    var url="https://developers.zomato.com/api/v2.1/locations?query="+query+"&apikey=ccfa077c40cc8120e254980fad6adade";
                    request(url,function(error,response,body){
                            if(error)
                            {
                                logger.error("error occured in zomato api while  providing location");
                            }
                            else if(!error&&response.statusCode==200)
                            {
                                res.redirect('/restaurant_details?valid=' + body);
                            }
                        
                     });
    })();   
});


app.get("/restaurant_details",function(req,res){
    
    
	var body = req.query.valid;
	var data=JSON.parse(body);
	var entity_type=data.location_suggestions[0].entity_type;
	var entity_id=data.location_suggestions[0].entity_id;
	var url="https://developers.zomato.com/api/v2.1/location_details?entity_id="+entity_id+"&entity_type="+entity_type+"&apikey=ccfa077c40cc8120e254980fad6adade";
	request(url,function(error,response,body){
       // console.log(url);
		if(!error&&response.statusCode==200)
		{
                        var data=JSON.parse(body);
                        data2 = [];
                        for(let i=0; i<data["best_rated_restaurant"].length; i++)
                        {
                                        obj = {};
                                        obj["restaurantName"] = data["best_rated_restaurant"][i]["restaurant"]["name"];
                                        obj["tag"] = "";
                                        obj["rating"] = data["best_rated_restaurant"][i]["restaurant"]["user_rating"]["aggregate_rating"];
                                        let url1=data["best_rated_restaurant"][i]["restaurant"]["url"];
                                        let url2=url1.split("?")[0];
                                        let ord="/order";
                                        let url3=url2.concat(ord);

                                        obj["ztolink"] = url3;
                                        data2.push(obj);
                        }
                        ( async () => {
                                   // console.log(data2[0]);
                                    const data1 = await swiggy.bestseller();
                                    //console.log(data1[0]);
                                    let rest = [];
                                    if(data1 == null ||data1.length == 0)
                                    {
                                        logger.error("did not get any top restaurant details");
                                        return;
                                    }
                                    for(let i=0; i<data1.length; i++)
                                    {
                                        let j = 0;
                                        let flag = 0;
                                        while(j < data2.length)
                                        {
                                                if(data1[i]["restaurantName"] == data2[j]["restaurantName"])
                                                {
                                                        obj = {};
                                                        obj["restaurantName"] = data1[i]["restaurantName"];
                                                        obj["tag"] = data1[i]["tag"];
                                                        obj["rating"] = data1[i]["rating"];
                                                        obj["sgylink"] = data1[i]["sgylink"];
                                                        obj["ztolink"] = data2[j]["ztolink"];
                                                        rest.push(obj);
                                                        data2.splice(j,1);
                                                        flag = 1;
                                                        break;
                                                }
                                                j++;
                                        }
                                        if(flag == 0)
                                        {
                                                        let ob = data1[i];
                                                        ob["ztolink"] = "";
                                                        rest.push(ob);
                                        }
                                    }
                                    for(let j=0; j<data2.length; j++)
                                    {
                                                let ob = data2[j];
                                                ob["sgylink"] = "";
                                                rest.push(ob);
                                    }
                                    
                                    res.render('toppick.ejs', {restrant : rest});
                        })();	 
			
		}
    });
    
});

app.get("/items", function(req, res){
   // console.log(req.body);
    var sgylink = req.query.sgylink;
    var ztolink = req.query.ztolink;
   // console.log(sgylink);
   // console.log(ztolink);
    logger.info("Request recieved at /items", sgylink);
    if(sgylink == "")
    {
      //  console.log("sgylink is null");
    }
    else if(ztolink == "")
    {
      //  console.log(" ztolink is null");
    }
});


module.exports = server;