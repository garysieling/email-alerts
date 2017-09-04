const Guid = require("guid");
const fs = require("fs");

const htmlTemplate = fs.readFileSync("./resources/alerts.html", "utf-8");
const textTemplate = fs.readFileSync("./resources/alerts.txt", "utf-8");
const querystring = require("querystring");

interface EmailTemplate {
  htmlEmail: string;
  textEmail: String;
  email: string;
  subject: string;
}

interface IVideo {
  url_s: string;
  title_s: string;
  id: string;
  audio_length_f: number;
}

interface IArticle {
  url: string;
  title: string;
}

interface IAlert {
  email: string;
  like: string[];
  dislike: string[];
  identifier: string; // GUID
}

// TODO recordSent(context, videoRecommendations);
// "895b990f-ac62-47a0-a984-a380edd59d54"
//     const client = new postmark.Client(process.env.POSTMARK_API_KEY);
//   let todayRounded = getDayOfTime(testDay);


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

function buildEmail(data: IAlert, articleRecommendations: IArticle[], videoRecommendations: IVideo[]) {
  let {email, like, dislike} = data;

  const postmark = require("postmark");

  let alertId = data.identifier;
  let emailId = Guid.create().value.replace(/-/g, "");

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
    videoRecommendations.map(
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

      const htmlArticleLinks = articleRecommendations.map(
        (article) => {
           // TODO - utm_medium, and clicker
          const articleUrl =  article.url;
            /*"https://www.findlectures.com/article-redirect?" +*/
/*            
            querystring.stringify(
              {
                id: article.url,
                url: article.url, 
                title: article.title, 
                email: email, 
                emailId: emailId, 
                alertId: alertId
              }
            );*/

          // TODO hovers
          // TODO categories (e.g colors)
          return `<strong>
<a href="${articleUrl}">${article.title}</a>
</strong><br />
<br />
`;
        }).join("");

      const links = 
        "<h1>Videos</h1>" + 
        htmlVideoLinks;
   //     "<br />" + 
   //     "<h1>Articles</h1>" + 
   //     htmlArticleLinks;

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
          /{links}/g, 
          links
      );

      const videoLinks = videoRecommendations.map(
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

          return `${video.title_s} (${formatLength(video.audio_length_f)})

${talkUrl}

`;
        }).join("");

   /*const articleLinks = articleRecommendations.map(
        (talk: IVideo) => {
          const articleUrl = 
            "https://www.findlectures.com/article-redirect?" +
            querystring.stringify(
              {
                id: talk.id,
                url: talk.url_s, 
                title: talk.title_s, 
                email: email, 
                emailId: emailId, 
                alertId: alertId
              }
            );

          return `${talk.title_s}

${articleUrl}

`;
        }).join("");
*/
    const textEmail = 
      textTemplate.replace(
        "{alertId}",
        alertId
      ).replace(
        "{emailId}",
        emailId
      ).replace(
        "{links}", 
        videoLinks //+ " " + articleLinks
      );
      
  return {
    htmlEmail,
    textEmail,
    email,
    like
  }
}

export {
  formatLength,
  buildEmail
}