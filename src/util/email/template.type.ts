interface IEmailTemplate {
  htmlEmail: string;
  textEmail: String;
  email: string;
  subject: string;
}

interface IVideo {
  id: string;
  url_s: string;
  title_s: string;
  audio_length_f: number;
}

interface IArticle {
  cleanUrl: string;
  url: string;
  title: string;
  points: number;
  comments: number;
  created: string;
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
  failure: boolean;
  index: number;
}

export {
  IEmailTemplate,
  IVideo,
  IArticle,
  IAlertTemplate
}