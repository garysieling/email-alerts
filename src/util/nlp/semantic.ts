import * as sqlite3 from 'sqlite3';
import * as http from 'http';

function closeWords(term: string, cb: (result: string[]) => void) {
  let q = term.replace(/ /g, '%20');
  const url = `http://104.237.151.183:8983/solr/topics/select?q=word%3A${q}&wt=json`;

  http.get(
    url,
    (result) => {
      let rawData = '';

      result.on('data', (chunk) => { 
        rawData += chunk; 
      });

      result.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          cb(parsedData.response.docs[0].suggestions)
        } catch (e) {
          console.error(e.message);
        }
      });

    }
  )
}


function initializeDatabase() {
  const db = new sqlite3.Database("data/words.db");

  db.serialize(function() {
    db.run("CREATE TABLE lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err: any, row: any) {
        console.log(row.id + ": " + row.info);
    });
  });

  db.close();
}

export {
  initializeDatabase,
  closeWords
}