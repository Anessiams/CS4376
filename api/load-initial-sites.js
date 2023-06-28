import scrapeWebsite from "./scrape.js";
//Initial sites will be loaded into the index
const initialSiteList = [
  "https://www.fda.gov/consumers/consumer-updates/gluten-free-means-what-it-says",
  "https://www.fda.gov/consumers/consumer-updates/what-ask-your-doctor-taking-opioids",
  "https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages",
  "https://www.fda.gov/consumers/consumer-updates/facts-about-home-hiv-testing",
  "https://www.fda.gov/news-events/press-announcements/fda-issues-first-draft-guidance-clinical-trials-psychedelic-drugs",
];
export default async function loadInitialSites(
  siteTextCache,
  siteIndexCache
) {
  for (let site of initialSiteList) {
    const siteText = await scrapeWebsite(site);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    siteTextCache.set(site, {
      text: siteText,
      payment: false,
      url: site,
      expirationDate: expirationDate,
      clicks: 0,
    });
    siteIndexCache.set(site, {
      payment: false,
      expirationDate: expirationDate,
    });
  }
}
