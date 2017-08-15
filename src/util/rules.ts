interface IBoost {
  term: string;
  value: number;
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

function getHypernyms(terms: string[], cb: (terms: IBoost[]) => any): IBoost[] {
  const wordNet = require( 'wordnet-magic' );
  const wn = wordNet('/d/projects/email-alerts/data/sqlite-31.db', true);

 wn.isNoun( 'callback', function( err, data ) {
    cb(data);
  });
  
//wn.isNoun( 'promise' ).then( console.log );

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