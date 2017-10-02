const Guid = require("guid");
import * as fs from 'fs';
import * as _ from 'lodash';

const querystring = require("querystring");

import { 
  IAlertTemplate, 
  IVideo, 
  IArticle,
  IEmailTemplate
} from './template.type';

function formatLength(length: number) {
  try {
    if (length >= 60 * 70) {
      return (length / 3600).toFixed(1) + ' hours';
    } else {
      const showLength = Math.round(length / 60);
      if (showLength === 1) {
        return showLength + ' minute';
      } else {
        return showLength + ' minutes';
      }
    }    
  } catch (e) {
    console.error(e)
  }
}

function getHtmlTemplate() {
  return fs.readFileSync("./resources/alerts.html", "utf-8");
}

function getTextTemplate() {
  return fs.readFileSync("./resources/alerts.txt", "utf-8");
}

function buildEmail(
  data: IAlertTemplate, 
  htmlTemplate: string, 
  textTemplate: string, 
  articleRecommendations: IArticle[], 
  videoRecommendations: IVideo[]
): IEmailTemplate {
  let {email, like, dislike} = data;

  let alertId = data.identifier;
  let emailId = Guid.create().value.replace(/-/g, "");

  let keywords = data.like.join(", ");

  const context = {
    AlertID: alertId,
    EmailID: emailId,
    email: email
  };  

  const unsubscribeUrl = 
    "https://www.findlectures.com/alert-unsubscribe?" +
    querystring.stringify(
      { 
        id: alertId
      }
  );

  const htmlVideoLinks =
    _.map(
      videoRecommendations,
    // TODO this is going to need help with url encoding
      (video: IVideo) => {
        const talkUrl = 
          "https://www.findlectures.com/talk-redirect?" +
          querystring.stringify(
            {
              id: video.id,
              url: video.url_s, 
              title: video.title_s, 
              email: email, 
              emailId: emailId, 
              alertId: alertId
            }
          );

            return `<strong>
<a href="${talkUrl}">${video.title_s} (${formatLength(video.audio_length_f)})</a>
</strong><br />
<br />
`;
          }
      ).join("");

      const htmlArticleLinks = 
        _.map(
          articleRecommendations,
          (article) => {
            // TODO - utm_medium, and clicker
            const articleUrl =  article.url;

          // TODO hovers
          // TODO categories (e.g colors)
           return `<strong>
<a href="${article.url}">${article.title}</a>
</strong><br />
<br />
`;
         }).join("");

      const htmlEmail = htmlTemplate.replace(
          /{alertId}/g,
          alertId
        ).replace(
          /{unsubscribeUrl}/g,
          unsubscribeUrl
        ).replace(
          /{email}/g,
          email
        ).replace(
          /{emailId}/g,
          emailId
        ).replace(
          /{articles}/g, 
          htmlArticleLinks
        ).replace(
          /{videos}/g, 
          htmlVideoLinks
        ).replace(
          /{keywords}/g,
          keywords
        );

      const videoLinks = _.map(
        videoRecommendations,
        (video: IVideo, index: number, array: IVideo[]) => {
          const talkUrl = 
            "https://www.findlectures.com/talk-redirect?" +
            querystring.stringify(
              {
                id: video.id,
                url: video.url_s, 
                title: video.title_s, 
                email: email, 
                emailId: emailId, 
                alertId: alertId
              }
            );

          return `${video.title_s} (${formatLength(video.audio_length_f)})

${talkUrl}

`;
        }).join("");

      const articleLinks = articleRecommendations.map(
        (article: IArticle, index: number, array: IArticle[]): string => {
          return `${article.title}

${article.url}

`;
        }).join("");

    const textEmail = 
      textTemplate.replace(
        /{alertId}/g,
        alertId
      ).replace(
        /{unsubscribeUrl}/g,
        unsubscribeUrl
      ).replace(
        /{emailId}/g,
        emailId
      ).replace(
        /{email}/g,
          email
      ).replace(
        /{videos}/g, 
        videoLinks
      ).replace(
        /{articles}/g, 
        articleLinks
      ).replace(
        /{keywords}/g,
        keywords
      );
      
  return {
    htmlEmail,
    textEmail,
    email,
    subject: "FindLectures.com Topic Alert: " + like
  }
}


function sendEmail(data: IEmailTemplate) {
    const mailgun = require('mailgun-js')({
      apiKey: process.env.MAILGUN_API_KEY, 
      domain: process.env.MAILGUN_DOMAIN
    });

    mailgun.messages().send({
      "from": "gary@findlectures.com", 
      "to": data.email, 
      "subject": data.subject, 
      "html": data.htmlEmail,
      "text": data.textEmail 
    }, (error: any, body: any) => {
      if (error) {
        console.log("Error sending", error);
      } else {
        console.log("Email sent successfully", body)
      }
    });
}

export {
  formatLength,
  buildEmail,
  getHtmlTemplate,
  getTextTemplate,
  sendEmail
}