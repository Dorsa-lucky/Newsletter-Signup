const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const util = require("util");

const PORT = 3000;

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

mailchimp.setConfig({
    apiKey: "92fb43bf79b128bb3a3b450eb240a89d-us21",
    server: "us21"
});

app.get('/', function(req, res){
    res.sendFile(__dirname + "/signup.html");
});



app.post('/', function(req, res){
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);
    // console.log(req.body);

    const data = {
        members: [
            {
                email_address : email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/f7305f2e5";
    const options = {
        method: "POST",
        auth: "dorsa1:92fb43bf79b128bb3a3b450eb240a89d-us21"
    }

    const request = https.request(url, options, function(response){
  
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        // attach an event listener to the "data" event
        // response.on("data", function(data){
        //     console.log("Response Code:", response.statusCode);
        //     console.log(JSON.parse(data));
        //     console.log("full response: ", util.inspect(response));
        // })
    });
    
    request.write(jsonData);
    request.end();
})


app.post('/failure', function(req, res){
    res.redirect("/");
});

// API key: 92fb43bf79b128bb3a3b450eb240a89d-us21
// audience ID: f7305f2e51


app.listen(PORT, function(){
    console.log("the server is running on port 3000");
})