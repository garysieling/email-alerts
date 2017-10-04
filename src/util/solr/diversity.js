
let http = require('http');
let _ = require('lodash');

//let url = '/solr/talks/clustering?q=article:(' + query + ')%20OR%20title:(' + query + ')^4'


function rocchio(query, cb) {
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
        /*const ids = 
          parsedData.match.docs.map(
            (doc) => doc.id
          ).map(
            (id) => {
              return 'id:' + id + ''
            }
          ).join("%20AND%20");*/

        cb(parsedData["rf.query:"], parsedData.match.docs);
      } catch (e) {
        console.error(e.message);
      }
    });
  });
}

function cluster(qq) {
  let url = '/solr/articles/clustering?q=' + qq.replace(/ /g, "%20").replace(/~5/, "");
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

        let clusters = 
          //_.fromPairs(
            _.flatten(
              parsedData.clusters.map(
                (cluster) => 
                  cluster.docs.map(
                    (doc) => [cluster.labels[0], cluster.score * cluster.docs.length, doc.id]
                  )
              )  
            ).sort(
              (a, b) => b[1] - a[1]
            )
         // );

          console.log(clusters);
          // loop through the results,
          // picking one from each cluster
          // TODO: this part
      } catch (e) {
        console.error(e.message);
      }
    });
  });
}

rocchio(
  '%22machine%20learning%22',
  cluster
)