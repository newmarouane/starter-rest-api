const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')
const puppeteer = require('puppeteer')
const fetch = require("node-fetch");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

// Create or Update an item
app.post('/:col/:key', async (req, res) => {
  console.log(req.body)

  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).set(key, req.body)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Delete an item
app.delete('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).delete(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a single item
app.get('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).get(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a full listing
app.get('/:col', async (req, res) => {
  const col = req.params.col
  console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`)
  const items = await db.collection(col).list()
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})


	
app.get('/job', async (req, res) => {
try {
  let browser;

    browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',]} );
  const page = await browser.newPage();
  
  var url = 'https://jobviewtrack.com/fr-fr/job-1a13416048160c06461a440a1b041b15676206010a1c464a5a482f371fad8e17490204081da4cc21415f/abd846d5ff8abce585b15251956ee068.html?affid=0afaf0173305e4b8';
  console.log(url);
  
  await page.goto(url, {waitUntil: 'load', timeout: 90000});
    
	var jobDescription = await page.$eval('.content', el => el.innerHTML).catch((e)=> {
		return "";
	});
    
	const logo = await page.$eval('.container > header > img', el => el.getAttribute('src')).catch((e)=> {
		return "";
	});
  
	var applyUrl = await page.$eval('.btn-apply', el => el.getAttribute('href')).catch((e)=> {
		return "";
	});
	if(applyUrl != null && applyUrl.startsWith("/")) applyUrl = await stringToOriginUrl(page.url()) + applyUrl.replace("/job/register/","/job/");
    
  var jobContract = await page.$eval('#job > div > header > ul.details > li:has([*|href*="contract"])', el => el.textContent.replace(/\n/g, "").replaceAll("  ", "")).catch((e)=> {
		return "";
	});
	
  var jobDuration = await page.$eval('#job > div > header > ul.details > li:has([*|href*="duration"])', el => el.textContent.replace(/\n/g, "").replaceAll("  ", "")).catch((e)=> {
		return "";
	});
  
  page.close();
  browser.close();
  var items= {"jobDescription":jobDescription,"logo":logo,"applyUrl":applyUrl, "jobContract": jobContract, "jobDuration": jobDuration};
  res.json(items).end();
}
  catch(e) {console.log(
            JSON.stringify({
                error : true,
                errorMessage : e.message
            })
        );
    } finally {
       // await browser.close();
    } 
});


// Catch all handler for all other request.
app.use('*', async (req, res) => {
   let animals = db.collection('animals')

    // create an item in collection with key "leo"
    let leo = await animals.set('leo', {
        type:'cat',
        color:'orange'
    })

    // get an item at key "leo" from collection animals
    let item = await animals.get('leo')
    console.log(item)
  res.json({ msg: 'no route handler found',value: item }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
	var url="https://confused-talented-poet.glitch.me/";
	  cron.schedule('0 */4 * * * *', async () => {
	    console.log("cron executed");
	    const response = await fetch(url);
	  });
})
