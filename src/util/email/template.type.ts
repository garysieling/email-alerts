interface IEmailTemplate {
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

interface IAlertTemplate {
  identifier: string; // GUID
  email: string;
  like: string[];
  dislike: string[];
  lastSent: Date;
  created: Date;
  lastEligible: Date;
  unsubscribed: boolean;
}

export {
  IEmailTemplate,
  IVideo,
  IArticle,
  IAlertTemplate
}