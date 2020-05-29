const puppeteer = require('puppeteer');

let browser = null;
let page = null;

/* Constants */
const BASE_URL = 'https://zomato.com/';

const zomato = {

    initialize: async () => {
        console.log('Starting the scraper..');

        browser = await puppeteer.launch({
            headless: false
        })
        
        page = await browser.newPage();
        page.on('console', message => {
            console.log(`Message from puppeteer: ${message.text()}`);
        })


        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

        console.log('Initialization completed..');
    },

    getProductDetails: async (link) => {

        console.log(`Going to the Product Page.. ( ${link} )`);

        await page.goto(link, { waitUntil: 'networkidle2' });
        // let webcontent=await page.content();
        // return webcontent;

        let details = await page.evaluate(() => {
            
            // let title = document.querySelector('#productTitle').innerText;
            // let manufacturer = document.querySelector('#bylineInfo').innerText;
            // let currentPrice = document.querySelector('#priceblock_ourprice,#priceblock_dealprice').innerText;
            // let rating = document.querySelector('#acrPopover').getAttribute('title');
            // let totalRatings = document.querySelector('#acrCustomerReviewText').innerText;
            
           // let restname=document.getElementsByClassName('sc-7kepeu-0 sc-cCbXAZ jVrsaq').innerText;

           let din=document.getElementsByClassName("sc-1s0saks-7 fIgnDe");
           let dins=[];
           let  n1=din.length;
           for(var i=0;i<n1;i++)
           {
               dins.push(din[i].innerText);
           }
           //return dins[0].innerText.innerText;
           return{
               dins
           }




            let restname=document.querySelector('h1').innerText;
            //let restnames=[];
            let rates=[];
            let rate=document.getElementsByClassName('sc-17hyc2s-1 fnhnBd');

            let dishname=document.getElementsByClassName("sc-1s0saks-11 cDXzZl");
            let dishes=[];
            let n=dishname.length;
            for(var i=0;i<n;i++)
            {
                dishes.push(dishname[i].innerText);
            }

            //let n=rate.length;
            for(var i=0;i<n;i++)
            {
                rates.push(rate[i].innerHTML);
            }
            return{
                restname,
                dishes,
                rates
            }

            //<span class="sc-17hyc2s-1 fnhnBd">₹99</span>

            // <h1 class="sc-7kepeu-0 sc-cCbXAZ jVrsaq">Sri Anjaneya Restaurant</h1>
            // sc-7kepeu-0 sc-cCbXAZ jVrsaq
            //  console.log(restnames);
            //  //console.log('another test message');
           

            // return {
            //     // title,
            //     // manufacturer,
            //     // currentPrice,
            //     // rating,
            //     // totalRatings,
            //     restnames
            // }

        });

        return details;
    },

    end: async () => {
        console.log('Stopping the scraper..');
        
        await browser.close();
    }

}

module.exports = zomato;