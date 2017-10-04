import * as http from 'http';
import * as _ from 'lodash';

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
  like = normalize(like || []);
  dislike = normalize(dislike || []);
  previouslySent = previouslySent || [];

  const articleQuery = queryForLikeAndDislike(like, dislike);

  const articleParams = [
    ["qf", "article"],
    ["defType", "edismax"],
    ["rf.q", articleQuery], 
    ["q:*:*"],
    ["df", "title"],
    //["bf", "add(log(add(10,comments,points)),log(sub(weekoftime,104920)))"],
    // TODO - quality filtering
    // TODO - recency
    // TODO filter "github", "youtube" domains
   // ["rows", "5"],
    ["wt", "json"],
    ["fl", "cleanUrl,title,url"],
    ["fq", "-domain:\"github.com\""],
    ["fq", "-domain:\"sourceforge.net\""],
    ["fq", "-domain:\"codepen.io\""],
    
    ["fq", "-domain:\"twitter.com\""],

    ["fq", "-domain:\"youtu.be\""],   
    ["fq", "-domain:\"youtube.com\""],      
    ["fq", "-domain:\"soundcloud.com\""],
    ["fq", "-domain:\"vimeo.com\""],

   // ["fq", "points:[50%20TO%2010000000]"],
   // ["fq", "comments:[10%20TO%2010000000]"]
  ];

  if (previouslySent.length > 0) {
    previouslySent.filter(
      (value) => value !== ""
    ).map(
      (id) => 
        articleParams.push(
          ['fq', '-cleanUrl:"' + id + '"']
        )
    );    
  }

  const articleUrl = "/solr/articles/rf?" + 
    articleParams.map( 
      (tuple) => tuple.join("=") 
    ).join("&");

  return articleUrl;
}

function normalize(queries: string[]) {
  return queries.map(
    (q) => q.replace(/%/g, "")
  ).filter(
    (q) => q !== ""
  )
}

function getVideoUrl(
  like: string[], 
  dislike: string[], 
  previouslySent: string[]
): any {
  like = like || [];
  dislike = dislike || [];
  previouslySent = previouslySent || [];

  const videoQuery = queryForLikeAndDislike(
    normalize(like), 
    normalize(dislike)
  );
  const videoParams = [
    //["qf", "article"],
    ["defType", "edismax"],
    ["rf.q", videoQuery], 
    ["q:*:*"],
    ["df", "title_s"],    
    ["fq", "has_content_b%3Atrue"], 
    ["fq", "audio_length_f:[1200%20TO%203600]"],
    ["fq", "total_quality_f:[0%20TO%2010000]"],
    ["rows", "3"],
    ["wt", "json"],
    ["fl", "id,title_s,audio_length_f,description_txt_en,url_s"]
  ];

  if (previouslySent.length > 0) {
    _.uniq(previouslySent).filter(
      (value) => value !== ""
    ).map(
      (id) => 
        videoParams.push(
          ['fq', '-id:"' + id + '"']
        )
    );    
  }

  const videoUrl = "/solr/talks/rf?" + 
    videoParams.map( 
      (tuple) => tuple.join("=") 
    ).join("&");

  return videoUrl;
}

function getVideos(
  like: string[], 
  dislike: string[], 
  previouslySent: string[], 
  log: (a: string, b: string) => void,
  cb: (error: Error, data: IVideo[]) => void
): any {
  try {
    const options = {
      host: process.env.SOLR_URL,
      port: '8983',
      path: getVideoUrl(like, dislike, previouslySent),
      method: 'GET'
    };

    let data = '';

    console.log('getVideos', options.host + options.path);

    const maxVideos = 3;

    const req = http.request(options, function(res) {
      res.on('data', (d) => {
        data += d;
      });

      res.on('end', 
        () => {
          try {
            const response = JSON.parse(data);

            if (response.match) {
              let videos: IVideo[] = _.take(response.match.docs, maxVideos);
              cb(null, videos);
            } else {
              cb(new Error(JSON.stringify(response.error, null, 2)), null);
            }
          } catch (e) {
            cb(e, null);
          }
        }
      );

      res.on('error', (error: Error) => {
        console.log('caught error');
        cb(error, null);
      })
    });

    req.end();    
  } catch (e) {
    cb(e, null);
  }
}

function getArticles(
  like: string[], 
  dislike: string[], 
  previouslySent: string[], 
  log: (a: string, b: string) => void,
  cb: (error: Error, data: IArticle[]
) => void): any {
  try {
    const options = {
      host: process.env.SOLR_URL,
      port: '8983',
      path: getArticleUrl(like, dislike, previouslySent),
      method: 'GET'
    };

    console.log('getArticles', 'http://' + options.host + ':8983' + options.path);

    const maxArticles = 7;

    let data = '';
    const req = http.request(options, function(res) {
      res.on('data', (d) => {
        data += d;
      });

      res.on('end', 
        () => {
          try {
            const response = JSON.parse(data);
            if (response.match) {
              let articles: IArticle[] = _.take(response.match.docs, maxArticles);
              cb(null, articles);
            } else {
              cb(new Error(JSON.stringify(response.error, null, 2)), null);          
            }
          } catch (e) {
            cb(e, null);
          }
        }
      );

      res.on('error',
        (error: Error) => {
          cb(error, null);
        }
      );
    });

    req.end();    
  } catch (e) {
    cb(e, null);
  }
}

export {
  queryForLikeAndDislike,
  boostLike,
  boostDislike,
  getVideoUrl,
  getVideos,
  getArticles
}