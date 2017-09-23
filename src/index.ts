let _ = require("lodash");

import {
  isTesting
} from './util/env'

import {
  loadAlerts,
  loadSent
} from './util/email/storage'

import { 
  buildEmail,
  getHtmlTemplate,
  getTextTemplate
} from './util/email/template'

import {
  IAlertTemplate,
  IVideo,
  IArticle
} from './util/email/template.type'

import {
  isEligible
} from './util/email/schedule'

function sendAlert() {
  console.log('sendAlert');
}

function main() {
  // initialize once, so that if this takes more than a day, it won't clip those people
  const startTime: Date = new Date();

  console.log('main');
  
  // TODO: this would be better as promises
  loadAlerts(
    (cb: any, context: IAlertTemplate) => {
      // TODO this needs to convert what's in the spreadsheet to dates
      if (isEligible(startTime, context.lastSent, context.lastEligible)) {
        loadSent(
            context.email,
            (sentLinks: string[]) => {

              // TODO implement these
              const videos: IVideo[] = getNextVideos(sentLinks);
              const articles: IArticle[] = getNextArticles(sentLinks);

              const fullEmail = buildEmail(
                context, 
                getHtmlTemplate(), 
                getTextTemplate(), 
                articles, 
                videos);

              sendEmail(fullEmail);

              recordSent(context);

              cb();
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