import * as https from 'https';
import * as http from 'http';

interface IBoost {
  term: string;
  value: number;
}

import {
  IVideo,
  IArticle
} from '../email/template.type'

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

function getArticleUrl(like: string[], dislike: string[], previouslySent: string[]): any {
  like = like || [];
  dislike = dislike || [];
  previouslySent = previouslySent || [];

  const articleQuery = queryForLikeAndDislike(like, dislike);

  const articleParams = [
    ["q", articleQuery], 
    // TODO - quality filtering
    // TODO - recency
    // TODO filter "github", "youtube" domains
    ["rows", "5"],
    ["wt", "json"],
    ["fl", "id,title,url"],
    ["fq", "-domain:\"github.com\""],
    ["fq", "-domain:\"sourceforge.net\""],
    ["fq", "-domain:\"codepen.io\""],
    
    ["fq", "-domain:\"twitter.com\""],

    ["fq", "-domain:\"youtu.be\""],   
    ["fq", "-domain:\"youtube.com\""],      
    ["fq", "-domain:\"soundcloud.com\""],
    ["fq", "-domain:\"vimeo.com\""],

   // ["fq", "points:[50%20TO%2010000000]"],
    ["fq", "comments:[10%20TO%2010000000]"]
  ];

  if (previouslySent.length > 0) {
    previouslySent.map(
      (id) => 
        articleParams.push(
          ["fq", "-id:" + id]
        )
    );    
  }

  const articleUrl = "/solr/articles/select?" + 
    articleParams.map( 
      (tuple) => tuple.join("=") 
    ).join("&");

  return articleUrl;
}

function getVideoUrl(like: string[], dislike: string[], previouslySent: string[]): any {
  like = like || [];
  dislike = dislike || [];
  previouslySent = previouslySent || [];

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

  const videoUrl = "/select?" + 
    videoParams.map( 
      (tuple) => tuple.join("=") 
    ).join("&");

  return videoUrl;
}

function getVideos(like: string[], dislike: string[], previouslySent: string[], cb: (data: IVideo[]) => void): any {
  const options = {
    host: 'findlectures.com',
    port: '80',
    path: getVideoUrl(like, dislike, previouslySent),
    method: 'GET'
  };

  let data = '';
  const req = https.request(options, function(res) {
    res.on('data', (d) => {
      data += d;
    });

    res.on('end', 
      () => {
        let videos: IVideo[] = JSON.parse(data);
        cb(videos);
      }
    );
  });

  req.end();    
}

function getArticles(like: string[], dislike: string[], previouslySent: string[], cb: (data: IArticle[]) => void): any {
  const options = {
    host: process.env.SOLR_URL,
    port: '80',
    path: getArticleUrl(like, dislike, previouslySent),
    method: 'GET'
  };

  let data = '';
  const req = http.request(options, function(res) {
    res.on('data', (d) => {
      data += d;
    });

    res.on('end', 
      () => {
        let articles: IArticle[] = JSON.parse(data);
        cb(articles);
      }
    );
  });

  req.end();    
}

export {
  queryForLikeAndDislike,
  boostLike,
  boostDislike,
  getVideoUrl,
  getVideos,
  getArticles
}