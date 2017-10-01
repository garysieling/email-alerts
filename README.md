# email-alerts
Weekly Emails

![Build Status](https://travis-ci.org/garysieling/email-alerts.svg?branch=master)

This sends weekly email alerts for talks / articles for FindLectures.com.

Concept Search
==============
This is part of an application to do concept search:
- If you search for "python" and "machine learning", you'll get "tensorflow"
- If you search for "writing NOT code" you'll get topics like "essay writing", "fiction", etc, rather than "writing CSS"
- If two articles are very similar (e.g. press release on the same topic), only send one (WIP)
- If you request articles on / not on a topic, expand that to related terms (e.g. no recipes with dairy -> no cheese, milk, etc) (WIP)

Design goals
============
- Reliable, fully tested email platform
- Don't send an article or video twice, no matter how many alerts a user requests
- Every email sent can be tracked - each template and generated email has a unique ID
- Track performance of emails over time using these identifiers
- Low operational overhead - all data stored in a Google Spreadsheet, so you only need a server to run the script

Other Features
==============
- Includes email sentiment widget from AWeber (https://codepen.io/cvasquez/pen/oxBvMP)
- Includes simple email template

Requirements
============
- Mailgun or Postmark
- Google spreadsheet
- Service account for Google Spreadsheet
- Share Google spreadsheet with the service account
- Solr server you want alerts on

TODO
====
- GeoIP tracking

The data for this is a mix of a manually constructed dataset of talks, and articles crawled from Reddit - see https://github.com/garysieling/video-crawler

Resources
=========
Use this plugin to improve ranking:
https://github.com/DiceTechJobs/RelevancyFeedback
