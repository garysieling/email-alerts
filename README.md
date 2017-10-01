# email-alerts
Weekly Emails

![Build Status](https://travis-ci.org/garysieling/email-alerts.svg?branch=master)

This sends weekly email alerts for talks / articles for FindLectures.com.

This is part of an application to do concept search:
- If you search for "python" and "machine learning", you'll get "tensorflow"
- If you search for "writing NOT code" you'll get topics like "essay writing", "fiction", etc, rather than "writing CSS"

Design goals:
- Fully tested email platform
- Every email sent can be tracked - each template and generated email has a unique ID
- Track performance of emails over time using these identifiers
- Low operational overhead - all data stored in a Google Spreadsheet, so you only need a server to run the script

To use this, you need the following:
- Mailgun or Postmark
- Google spreadsheet
- Service account for Google Spreadsheet
- Share Google spreadsheet with the service account
- Solr server you want alerts on

The data for this is a mix of a manually constructed dataset of talks, and articles crawled from Reddit - see https://github.com/garysieling/video-crawler

Resources
=========
Use this plugin to improve ranking:
https://github.com/DiceTechJobs/RelevancyFeedback
