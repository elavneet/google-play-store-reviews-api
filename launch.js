const cheerio = require("cheerio");
let axios = require("axios");
const RJSON = require("relaxed-json");
const httpClient = axios.create();
httpClient.defaults.timeout = 50000;

const PACKAGE_NAME = "com.ramarya.pb35";

(async () => {
  try {
    const response = await httpClient.get(
      `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}&showAllReviews=true`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:84.0) Gecko/20100101 Firefox/84.0",
        },
      }
    );
    //console.log(response.data);
    const $ = cheerio.load(response.data);
    const scriptTags = $("script");
    for (let i = 0; i < scriptTags.length; i++) {
      let scriptTag = $(scriptTags[i]).html();
      if (scriptTag.toLowerCase().includes("vaf_")) {
        scriptTag = scriptTag.slice(20).slice(0, -2);

        scriptTag = RJSON.parse(scriptTag);
        const reviews = scriptTag.data[0];

        for (j = 0; j < reviews.length; j++) {
          const starRatings = reviews[j][2];
          const reviewText = reviews[j][4];
          const userName = reviews[j][1][0];
          const userImage = reviews[j][1][1][3][2];

          console.log({ starRatings, reviewText, userName, userImage });
        }
        break;
      }
    }

    return;
  } catch (err) {
    console.log(`error while retrieving reviews`, err);
  }
})();
