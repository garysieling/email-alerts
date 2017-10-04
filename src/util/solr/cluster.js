
let http = require('http');

let query = 'python';

//let url = '/solr/talks/clustering?q=article:(' + query + ')%20OR%20title:(' + query + ')^4'
let url = '/solr/talks/clustering?q=title_s:' + query;
console.log("http://40.87.64.225:8983" + url);

http.get({
  hostname: '40.87.64.225',
  port: 8983,
  path: url,
  agent: false  // create a new agent just for this one request
}, (res) => {
  res.setEncoding('utf8');
  let rawData = '';

  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(
        (
          parsedData.clusters.map(
            (cluster) => [cluster.labels[0], cluster.score]
          ).sort(
            (a, b) => b[1] - a[1]
          ).map(
            (a) => a[0] + ": " + a[1].toFixed(1)
          ).join(
            "\n"
          )
        )
      );
    } catch (e) {
      console.error(e.message);
    }
  });
});
