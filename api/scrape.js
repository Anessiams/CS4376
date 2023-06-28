import puppeteer from "puppeteer";
export default async function scrapeWebsite(
  url,
  verbose = false
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.evaluate(() => {
    //Remove all scripts, noscripts, iframes, styles, svgs, icons, and images from the page
    for (let element of document.querySelectorAll(
      "script, noscript, iframe, style, svg, i, img, header, footer"
    )) {
      element.remove();
    }
    // Return body contents
    return document.body.innerHTML;
  });
  browser.close();

  //Remove characters to cut down on the length of the string to better fit token limit
  //Remove all html tags, newlines, dashes, entities from the page
  let siteText = data.replace(/<[^>]+>|-|&[a-z]+;/gi, "");
  //Remove consecutive spaces
  siteText = siteText.replace(/\s+/g, " ");

  if (verbose) {
    // console.log(data)
    console.log(siteText);
    console.log(siteText.length);
  }
  return siteText;
}
