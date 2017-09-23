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

function queryForLikeAndDislike(like: string[], dislike: string[]) {
  like = (like || []).filter(
    (p) => !!p && p.trim() !== ""
  );

  dislike = (dislike || []).filter(
    (p) => !!p && p.trim() !== ""
  );

  if (like.length > 0 && dislike.length > 0) {
    return "(" + queryForLike(like) + ")%20" + queryForDislike(dislike);
  }

  if (like.length > 0 && dislike.length == 0) {
    return queryForLike(like);
  }

  if (like.length == 0 && dislike.length > 0) {
    return queryForDislike(dislike);
  }

  if (like.length == 0 && dislike.length == 0) {
    return "*:*";
  }
}

function getVideos(like: string[], dislike: string[], previouslySent: string[]) {
  const request = require("ajax-request");

  const videoQuery = queryForLikeAndDislike(like, dislike);
  const videoParams = [
    ["q", videoQuery], 
    ["fq", "has_content_b%3Atrue"], 
    ["fq", "audio_length_f:[1200%20TO%203600]"],
    ["fq", "total_quality_f:[0%20TO%2010000]"],
    ["rows", "3"],
    ["wt", "json"],
    ["fl", "id,title_s,audio_length_f,description_txt_en,url_s"]
  ];

  if (previouslySent.length > 0) {
    previouslySent.map(
      (id) => 
        videoParams.push(
          ["fq", "-id:" + id]
        )
    );    
  }

  console.log(JSON.stringify(previouslySent, null, 2));

  const videoUrl = "https://www.findlectures.com/select?" + 
    videoParams.map( 
      (tuple) => tuple.join("=") 
    ).join("&");

  

}

function getArticles() {

}

export {
  queryForLikeAndDislike,
  boostLike,
  boostDislike,
  getVideos,
  getArticles
}