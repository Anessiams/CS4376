import express from "express";
import NodeCache from "node-cache";
import scrapeWebsite from "./scrape.js";
import loadInitialSites from "./load-initial-sites.js";

const app = express();
app.use(express.json());

//The site cache is used to cache the data scraped from websites
const siteTextCache = new NodeCache();
//The site index cache serves as an index of all the sites, their payment status, and their expiration date
//this can be quickly parsed to check for expired sites
const siteIndexCache = new NodeCache();

//Initial sites will be loaded into the index for testing
loadInitialSites(siteTextCache, siteIndexCache);

app.get("/", (req, res) => {
  res.send("Hello CyberMiner!");
});

app.get("/all", (req, res) => {
  const siteTextList = siteTextCache.mget(siteTextCache.keys());
  return res.json(siteTextList);
});
app.post("/add-site", async (req, res) => {
  const { url, payment = false } = req.body;

  const siteText = await scrapeWebsite(url);
  console.log(url);
  console.log(payment);
  console.log(siteText);

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  //Add the site and text to the site text cache. This index is used to match keywords to site URL's
  siteTextCache.set(url, {
    text: siteText,
    payment: payment,
    url: url,
    expirationDate: expirationDate,
    clicks: 0,
  });
  //Add the site to the site index cache. This index is used to quickly check for expired sites.
  siteIndexCache.set(url, {
    payment: payment,
    expirationDate: expirationDate,
  });

  return res.send("Site added!");
});
app.post("/search", (req, res) => {
  const { queryString } = req.body;
  console.log("Received search query for: " + queryString);

  //Filter expired sites. Delete from both caches
  const currentDate = new Date();
  let siteIndexList = siteIndexCache.mget(
    siteIndexCache.keys()
  );
  siteIndexList = Object.values(siteIndexList);
  for (let site of siteIndexList) {
    if (site.expirationDate < currentDate) {
      siteIndexCache.del(site.url);
      siteTextCache.del(site.url);
    }
  }

  //Get all the sites from the site index cache
  let siteTextList = siteTextCache.mget(siteTextCache.keys());
  siteTextList = Object.values(siteTextList);

  console.log(
    "Searching " +
      siteTextList.length +
      " sites for " +
      queryString
  );

  const searchResults = [];
  const queryStringKeywords = queryString.split(" ");
  console.log(queryStringKeywords);
  for (let site of siteTextList) {
    //Check site text for query string
    const siteText = site.text;
    let keywordMatches = 0;
    //Check if site text contains any of the query string keywords. Count how many matches there are, and add the site to the search results if there are any matches
    //Later, the search results will be sorted by the number of matches.
    for (let keyword of queryStringKeywords) {
      if (siteText.includes(keyword)) {
        keywordMatches++;
      }
    }
    //Add site to search results if there are any matches
    console.log("Keyword matches: " + keywordMatches);
    if (keywordMatches > 0) {
      searchResults.push({
        site: {
          url: site.url,
          payment: site.payment,
          expirationDate: site.expirationDate,
          clicks: site.clicks,
        },
        keywordMatches: keywordMatches,
      });
    }
  }
  //Sort search results by number of keyword matches
  searchResults.sort((a, b) => {
    return b.keywordMatches - a.keywordMatches;
  });
  //Put paid sites at the top of the search results
  for (let result of searchResults) {
    if (result.site.payment) {
      //Remove the result from its current position in the array
      searchResults.splice(searchResults.indexOf(result), 1);
      //Add the result to the front of the array
      searchResults.unshift(result);
    }
  }
  return res.json(searchResults);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
