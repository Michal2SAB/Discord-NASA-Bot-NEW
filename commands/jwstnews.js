const fetch = require("node-fetch");

module.exports = {
  name: "jwstnews",
  description: "Get the latest james webb telescope news.",

  async execute(message) {
    const url =
      "https://www.nasa.gov/api/2/ubernode/_search?size=24&from=0&sort=promo-date-time%3Adesc&q=((ubernode-type%3Afeature%20OR%20ubernode-type%3Aimage%20OR%20ubernode-type%3Apress_release%20OR%20ubernode-type%3Acollection_asset)%20AND%20(missions%3A3627))&_source_include=promo-date-time%2Cmaster-image%2Cnid%2Ctitle%2Ctopics%2Cmissions%2Ccollections%2Cother-tags%2Cubernode-type%2Cprimary-tag%2Csecondary-tag%2Ccardfeed-title%2Ctype%2Ccollection-asset-link%2Clink-or-attachment%2Cpr-leader-sentence%2Cimage-feature-caption%2Cattachments%2Curi";
    try {
      const response = await fetch(url);
      const data = await response.json();
      const newestElement = data.hits.hits[0]._source;
      const date = newestElement['promo-date-time'].substring(0, 10);
      const pageUrl = "https://www.nasa.gov" + newestElement.uri;
      
      message.channel.send(pageUrl);
      message.channel.send(date);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while fetching data from NASA API");
    }
  },
};
