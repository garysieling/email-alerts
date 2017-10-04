
let http = require('http');

let query = '%22machine%20learning%22';

//let url = '/solr/talks/clustering?q=article:(' + query + ')%20OR%20title:(' + query + ')^4'
let url = '/solr/articles/rf?q=*:*&rf.q=article:' + 
  query + 
  '&rows=10&df=title&fl=title,url,id&wt=json';

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
      parsedData.match.docs.map(
        (doc) => {
          console.log(doc.title);
        }
      )
    } catch (e) {
      console.error(e.message);
    }
  });
});
