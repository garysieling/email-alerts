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

function main() {
  // initialize once, so that if this takes more than a day, it won't clip those people
  const startTime: Date = new Date();

  console.log('main');
  let todayRounded = getDayOfTime(startTime) + "";

  // TODO: this would be better as promises
  loadAlerts(
    (cb: any, context: IAlertTemplate) => {
      // TODO this needs to convert what's in the spreadsheet to dates
      if (!context.unsubscribed && 
          isEligible(startTime, context.lastSent, context.lastEligible)) {
        loadSent(
            context.email,
            (sentLinks: string[]) => {

              // TODO implement these
              getVideos(context.like, context.dislike, sentLinks,
                (videos: IVideo[]) => {
                  getArticles(context.like, context.dislike, sentLinks,
                    (articles: IArticle[]) => {
                      const fullEmail = buildEmail(
                        context, 
                        getHtmlTemplate(), 
                        getTextTemplate(), 
                        articles, 
                        videos);

                      const sentData: {id: string, title: string}[] = 
                        videos.map(
                          ({id, title_s}) => { return {id, title: title_s} }
                        ).concat(articles.map(
                          ({id, title}) => { return {id, title} }
                        ))

                      recordAlertSent(context, todayRounded, () => {
                        recordSentLinks(context, sentData, () => {
                          sendEmail(fullEmail);

                          cb();
                        });
                      });
                  });               
                });
            }
          )
      }
    }, 
    () => {

    }
  );
}

main();

export default main;