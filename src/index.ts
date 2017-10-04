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

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

function main() {
  const log = console.log;
  // initialize once, so that if this takes more than a day, it won't clip those people
  const startTime: Date = new Date();

  log('main');
  let todayRounded = getDayOfTime(startTime) + "";

  // TODO: this would be better as promises
  loadAlerts(
    (cb: any, context: IAlertTemplate) => {
      log('alerts loaded', context.email, context.identifier)
      // TODO this needs ;to convert what's in the spreadsheet to dates
      const eligible = isEligible(startTime, context.lastSent, context.lastEligible)
      log('isEligible', context.email, context.identifier, eligible);
      
      if (!context.unsubscribed && 
          eligible) {

        loadSent(
            context.email,
            (sentLinks: string[]) => {
              log('loadSent', sentLinks.length);

              getVideos(context.like, context.dislike, sentLinks,
                console.log,
                (error: Error, videos: IVideo[]) => {
                  if (error) {
                    console.log('getVideos - error', error);

                    cb();
                  } else {
                    log('getVideos', videos.length);

                    getArticles(context.like, context.dislike, sentLinks,
                      console.log,
                      (error: Error, articles: IArticle[]) => {
                        if (error) {
                          console.log('getArticles - error', error);

                          cb();
                        } else {
                          log(getArticles, articles.length);

                          const fullEmail = buildEmail(
                            context, 
                            getHtmlTemplate(), 
                            getTextTemplate(), 
                            articles, 
                            videos);

                          const sentData: {id: string, title: string}[] = 
                            _.map(
                              videos,
                              (video: IVideo) => {
                                return {
                                  id: video.id, 
                                  title: video.title_s
                                } 
                              }
                            ).concat(
                              _.map(
                                articles,
                                (article: IArticle) => { 
                                  return {
                                    id: article.cleanUrl, 
                                    title: article.title
                                  } 
                                }
                              )
                            );

                          recordAlertSent(context, todayRounded, () => {
                            log('recordAlertSent', context.email, context.identifier);

                            recordSentLinks(context, sentData, () => {
                              log('recordSentLinks', context.email, context.identifier)

                              sendEmail(fullEmail);

                              log('email should be sent');

                              cb();
                            });
                          });
                        }
                      });   
                  }            
                });
            }
          )
      } else {
        cb();
      }
    }, 
    () => {

    }
  );
}

main();

export default main;