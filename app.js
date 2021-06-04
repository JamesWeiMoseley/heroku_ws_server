const { urlencoded } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const cheerio = require("cheerio");
const { default: axios } = require("axios");
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(cors());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("connected on port 3000"));

// for get requests when using as api
app.get('/', (req, res) => {
    const urlLink = "https://en.wikipedia.org/wiki/Feast_of_Corpus_Christi";

    axios.get(urlLink).then(urlResponse => {
            let config = {
                    headers: {
                        "Content-Type" : "text/plain"}, 
                    responseType: "text"
                }
            const $ = cheerio.load(urlResponse.data);
            $('body').each((i, element) => {
                const bodyText = $(element)
                .find("p")
                .text();
                
                res.send(bodyText);

            })
        }, (error) => console.log("server side err"));
})

// post requests for using with my front end.  
app.post('/', (req, res) => {
    let urlLink = req.body.url_box;
    let api = req.body.api_box;
    let text_type = req.body.text_type;

    console.log("server is linked to url:", urlLink);
    // res.send(urlLink);

    axios.get(urlLink).then(urlResponse => {
            let config = {
                    headers: {
                        "Content-Type" : "text/plain"}, 
                    responseType: "text"
                }
            const $ = cheerio.load(urlResponse.data);
            $('body').each((i, element) => {
                const head = $(element) 
                .find("h1")
                .text();
    
                const bodyText = $(element)
                .find("p")
                .text();
                
                if(text_type==="p")
                    axios.post(api, bodyText, config)
                    .then(translated_text => res.send(translated_text.data))
                        .catch(error=> console.log(error));
                else 
                    axios.post(api, head, config)
                    .then(translated_text => res.send(translated_text.data))
                        .catch(error=> console.log(error));

                
            })
        }, (error) => console.log("server side err"));

})