import * as sqlite3 from 'sqlite3';

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
  initializeDatabase
}