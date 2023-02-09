// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
//app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
//app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', async(req, res)  => {
  	const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
	const page = await browser.newPage();
	await page.goto("https://jobviewtrack.com/fr-fr/job-1a13416048160c06461a440a1b041b15676206010a1c464a5a482f371fad8e17490204081da4cc21415f/abd846d5ff8abce585b15251956ee068.html?affid=0afaf0173305e4b8");
	const jobDescription = await page.$eval('.content', el => el.innerHTML).catch((e)=> {
		return "";
	});	
	const logo = await page.$eval('.container > header > img', el => el.getAttribute('src')).catch((e)=> {
		return "";
	});
	var applyUrl = await page.$eval('.btn-apply', el => el.getAttribute('href')).catch((e)=> {
		return "";
	});
	
	
	await browser.close();

	res.send({"jobDescription":jobDescription,"logo":logo});
}
);


// starting the server
app.listen(3000, async() => {
  console.log('Listening on port 3000');
});
