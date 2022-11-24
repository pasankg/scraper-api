const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const verge = 'verge';
const gizmodo = 'gizmodo';

const articles = [];

// List of websites to scrape.
const websites = [
 {
  name: verge,
  address: 'https://www.theverge.com/tech',
  base: 'https://www.theverge.com/tech',
 },
 {
  name: gizmodo,
  address: 'https://gizmodo.com/tech',
  base: '',
 }
];

// Scrape each site.
websites.forEach(website => {
 axios.get(website.address)
  .then(response => {
   const html = response.data
   const $ = cheerio.load(html);

   if (website.name === verge) {
    // @TODO Need to improve selector
    $('h2 a', html).each(function () {
     const title = $(this).text()
     const url = $(this).attr('href')
     if (title) {
      articles.push({
       title: title,
       url: website.base + url,
       source: website.name
      })
     }
    })
   }

   if (website.name === gizmodo) {
    // @TODO Need to improve selector
    $('article div a', html).each(function () {
     const title = $(this).attr('title')
     const url = $(this).attr('href')
     if (title) {
      articles.push({
       title: title,
       url: website.base + url,
       source: website.name
      })
     }
    })
   }

  })
  .catch(function (error) {
   console.log(error);
  })
})

// Routes
app.get('/', (req, res) => {
 res.json('News API.');
})

app.get('/news', (req, res) => {
 res.json(articles)
})

app.listen(PORT, () => console.log(`Application running on port ${PORT}`));
