import * as _ from 'lodash';

interface IBoost {
  term: string;
  value: number;
}


function shellExec(
  command: string, 
  args: string[], 
  cb: (error: string, value: string[]) => any
) {
  const spawn = require('child_process').spawn;
  const prc = spawn(command, args);

  prc.stdout.setEncoding('utf8');
  prc.stdout.on('data', function (data: string) {
    const str = data.toString();
    const lines: string[] = str.split(/(\r?\n)/g)
        
    cb(null, lines.filter(
      (line) => line != "\r\n"
    ));
  });

  prc.stderr.on('data', function (data: string) {
    console.log(data + '');
  });

  prc.on('close', function (code: string) {
    console.log('process exit code ' + code);
    cb(code, null);
  });
}


function getHypernyms(terms: string[], cb: (error: string, terms: string[]) => any): void {
  shellExec(
    'python',
    [
      'src/topics.py'
    ].concat(
      terms.map(
        (term) => '"' + term.replace('"', '\\"') + '"'
      )
    ),
    (err, lines: string[]) => 
      cb(err, _.tail(_.tail(lines)))
  )
}

function boostLike(field: string, like: IBoost[]): string {
  if (like) {
    return like.map(
      (kw) => field + ":" + kw.term + "^" + kw.value
    ).join("%20");
  }

  return null;
}

function boostDislike(field: string, like: IBoost[]): string {
  if (like) {
    return like.map(
      (kw) => field + ":" + kw.term + "^" + kw.value
    ).join("%20");
  }

  return null;
}

function queryForLike(like: string[]): string {
  if (like) {
    return like.map(
      (kw) => "\"" + kw.replace(/ /g, "%20") + "\""
    ).join("%20OR%20");
  }

  return null;
}

function queryForDislike(dislike: string[]) {
  if (dislike) {
    return (
      "-(" +
        dislike
        .map(
          (kw) => "\"" + kw.replace(/ /g, "%20") + "\""
        ).join("%20AND%20") +
      ")"
    );
  }

  return null;
}

function queryForLikeAndDislike(like: string, dislike: string) {
  if (like && dislike) {
    return "(" + queryForLike(like.split(",")) + ")%20" + queryForDislike(dislike.split(","));
  }

  if (like && !dislike) {
    return queryForLike(like.split(","));
  }

  if (!like && dislike) {
    return queryForDislike(dislike.split(","));
  }

  if (!like && !dislike) {
    return "*:*";
  }
}

export {
  queryForLikeAndDislike,
  boostLike,
  boostDislike,
  getHypernyms
}