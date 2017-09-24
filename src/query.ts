let _ = require("lodash");

import {
  isTesting
} from './util/env'

import {
  loadAlerts,
  loadSent,
  recordAlertSent,
  recordSentLinks
} from './util/email/storage'

import {
  getVideos,
  getArticles
} from './util/solr/rules'

import { 
  buildEmail,
  getHtmlTemplate,
  getTextTemplate,
  sendEmail
} from './util/email/template'

import {
  IAlertTemplate,
  IVideo,
  IArticle
} from './util/email/template.type'

import {
  getDayOfTime,
  isEligible
} from './util/email/schedule'

function sendAlert() {
  console.log('sendAlert');
}

function main(like: string[]) {
  const log = console.log;
  // initialize once, so that if this takes more than a day, it won't clip those people
  const startTime: Date = new Date();

  log('main');
  let todayRounded = getDayOfTime(startTime) + "";

  const context = {
    like: like,
    dislike: [""]
  };

  const sentLinks: string[] = [];

  getVideos(context.like, context.dislike, sentLinks,
    (a: string, b: string) => {},
    (error: Error, videos: IVideo[]) => {
      if (error) {
        console.log('getVideos - error', error);
      } else {
        for (let i = 0; i < videos.length; i++) {
          console.log("Video", videos[i].title_s)
        }

        getArticles(context.like, context.dislike, sentLinks,
          (a: string, b: string) => {},
          (error: Error, articles: IArticle[]) => {
            if (error) {
              console.log('getArticles - error', error);
            } else {
              for (let i = 0; i < articles.length; i++) {
                console.log("Article", articles[i].title)
              }
            }
          });   
      }            
    });
}

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  main(d.toString().trim().split(","));
});
