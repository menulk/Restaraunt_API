var express = require('express');
var app = express();
var zomato = require('zomato');
var ejs = require('ejs');

app.set("view engine", "ejs")

app.use(express.static(__dirname + "views"))
const client = zomato.createClient({userKey: '810f08bc7bcda63583223f45d2905ec4'})




app.get("/locations/:geocode", (req, res)=>{
    let name = req.params.geocode;
  
    client.getLocations({query: name,}, (err, result) =>{
    
        if(!err){
            let main_data = JSON.parse(result).location_suggestions;

            let latitude = JSON.stringify (main_data[0].latitude);
            let longitude = JSON.stringify (main_data[0].longitude);
            
            client.getGeocode({lat:latitude, lon:longitude},(err, result)=>{
                if(!err){
                    
                    let data = JSON.parse(result).nearby_restaurants;
                    
                    var restaurant_list = [];
                    for(var i of data){
                    
                        let Dict = {
                            name: i.restaurant.name,
                            res_address: i.restaurant.location.res_address,
                            res_town: i.restaurant.location.res_town,
                            res_situation : i.restaurant.location.res_situation,
                            res_image: i.restaurant.res_image
                        }
                      
                        restaurant_list.push(Dict)
                    }

                    
                    res.render('zomato.ejs', {data: restaurant_list})
                }else{
                    console.log(err);
                }
            })
        }else{
            console.log(err);
        }
    })
});



var server = app.listen(3000,()=>{
	console.log('server running');
})
