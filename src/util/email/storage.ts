import {isTesting} from '../env';
import * as _ from 'lodash';

const GoogleSpreadsheet = require("google-spreadsheet");
const async = require("async"); 

const sentCache: { [key: string]: string[]; } = {};

import { IAlertTemplate } from "./template.type";

function getSpreadsheetId() {
  if (isTesting()) {
    return process.env.TESTING_SPREADSHEET;
  } else {
    return process.env.PRODUCTION_SPREADHSHEET;
  }
}

function getAuthentication() {
  return {
    "client_email": process.env.GOOGLE_AUTH_CLIENT_EMAIL,
    "private_key": process.env.GOOGLE_AUTH_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

function preloadSent(finalCallback: any) {
  const doc = new GoogleSpreadsheet(getSpreadsheetId());
  let sheet: any = null;
  
  async.series([
    function setAuth(step: any) {
      doc.useServiceAccountAuth(getAuthentication(), step);
    },
    function getInfoAndWorksheets(step: any) {
      doc.getInfo(function(err: any, info: any) {
        console.log(err);
        var sheetId = _.findIndex(info.worksheets,
          (worksheet: any) => worksheet['title'] === "Sent"
        ); 

        sheet = info.worksheets[sheetId];

        step();
      });
    },   
    function workingWithRows(step: any) {
      // google provides some query options 
      sheet.getRows({
        offset: 1,
        limit: 10000 // TODO
      }, function( err: any, rows: any[] ){
        console.log("Read "+rows.length+" rows");
    
        rows.map(
          (data: any) => {
            const email = data["email"];

            if (!sentCache[email]) {
              sentCache[email] = [];
            }

            sentCache[email].push(data["link"] + "");
          }
        );

        step();
      });
    }
  ], function(err: any){
    if (err) {
      console.log("Error: " + err);
    }

    finalCallback();
  });
}

function loadSent(email: string, cb: (s: String[]) => void): void {
  if (_.keys(sentCache).length === 0) {
    preloadSent(() => {
      cb(_.cloneDeep(sentCache[email]) || [])
    });
  } else {
    cb(_.cloneDeep(sentCache[email]) || []);
  }  
}


function loadAlerts(rowCallback: any, completionCallback: () => void) {
  const doc = new GoogleSpreadsheet(getSpreadsheetId());
  let sheet: any = null;
  
  async.series([
    function setAuth(step: any) {
      doc.useServiceAccountAuth(getAuthentication(), step);
    },
    function getInfoAndWorksheets(step: any) {
      doc.getInfo(function(err: any, info: any) {
        console.log(err);
        //console.log(JSON.stringify(info, null, 2));
        sheet = info.worksheets[0];
        //console.log("sheet 1: "+sheet.title+" "+sheet.rowCount+"x"+sheet.colCount);
        step();
      });
    },   
    function workingWithRows(step: any) {
      // google provides some query options 
      sheet.getRows({
        offset: 1,
        limit: 10000 // TODO
      }, function( err: any, rows: any ){   
        async.mapSeries(
          rows,
          (data: any, cb2: (data: IAlertTemplate) => void) => {
            const alertData: IAlertTemplate = {
              email: data['email'],
              like: (data['like'] || '').split(","),
              dislike: (data['dislike'] || '').split(","),
              identifier: data['identifier'],
              unsubscribed: !!data['unsubscribed'],
              lastSent: new Date(parseInt(data['lastsent'])),
              created: new Date(parseInt(data['created'])),
              lastEligible: new Date(parseInt(data['lasteligible']) * 24 * 3600 * 1000)
            }
            
            rowCallback(cb2, alertData);
          },
          () => step()
        );
      });
    }
  ], function(err: any) {
    if (err) {
      console.log("Error: "+ err);
    }

    completionCallback();
  });

}

function updateSheet(sheetName: String, worksheetName: String, data: any, cb: () => void) {
  const doc = new GoogleSpreadsheet(getSpreadsheetId());
  
  let sheetId = null;
  let sheet: any = null;

  async.series([
    function setAuth(step: any) {
      // see notes below for authentication instructions! 
      //var creds = require('./google-generated-creds.json');
      // OR, if you cannot save the file locally (like on heroku) 
      var creds_json = getAuthentication();  
      doc.useServiceAccountAuth(creds_json, step);
    },
    function getInfoAndWorksheets(step: any) {
      doc.getInfo(function(err: any, info: any) {
        console.log(err);
        //console.log(JSON.stringify(info, null, 2));
        sheetId = _.findIndex(info.worksheets,
          (worksheet: any) => worksheet.title === worksheetName
        ); 

        sheet = info.worksheets[sheetId];
        step();
      });
    },
   
    function workingWithCells(step: any) {
      sheet.getRows({
        query: "identifier = " + data.identifier + ""
      }, function( err: any, rows: any ){
        console.log(err);
        console.log("Read " + rows.length + " rows");
  
        _.keys(
          data
        ).map(
          (key) => {
            rows[0][key] = data[key];
          }
        );
        
        rows[0].save(); 
        step();
      });
    }
  ], function(err: any){
    if (err) {
      console.log('Error: '+err);
    }

    if (cb) {
      cb();
    }
  });
}

function saveRows(cb: () => void, spreadsheet: any, sheet: any, data: any) {
  const doc = new GoogleSpreadsheet(getSpreadsheetId());
  let sheetId: Number;

  async.series([
    function setAuth(step: any) {
      const creds_json = getAuthentication();
      doc.useServiceAccountAuth(creds_json, step);
    },
    function getInfoAndWorksheets(step: any) {
      doc.getInfo(function(err: any, info: any) {
        console.log(err);
        //console.log(JSON.stringify(info, null, 2));
        sheetId = _.findIndex(info.worksheets,
          (worksheet: any) => worksheet['title'] === sheet
        ) + 1; // google spreadsheets 1 indexed

        //console.log("sheetId", sheetId, sheet);

        step();
      });
    },   
    function saveRows(step: any) {
      async.mapSeries(
        data,
        (row: any, cb: any) => doc.addRow(
          sheetId, row, function(err: any, row: any) {
            //console.log(err);
            //console.log(JSON.stringify(row, null, 2));         

            cb();
          }), 
          step
      );      
    }
  ], function(err: any){
    if (err) {
      console.log("Error: "+err);
    }
  });
}


function recordAlertSent(context: IAlertTemplate, todayRounded: String, cb: () => void) {
  updateSheet("alert", "Requested Alerts", {
    identifier: context.identifier,
    "Last Sent": (new Date().getTime()) + "",
    "Last Eligible": todayRounded
  }, cb);
}

function recordSentLinks(context: any, sent: {id: string, title: string}[], completionCallback: () => void) {
  const doc = new GoogleSpreadsheet(getSpreadsheetId());
  const sentIds = sent.map( (sent: {id: string}) => sent.id );
  
  saveRows(
    () => {
      //console.log("saved sent rows");
    },
    getSpreadsheetId(),
    "Sent",
    sent.map(
      (row) => {
        return _.defaults({}, context, {
          Link: row.id,
          Title: row.title
        });
      }
    )
  );

  const emailAddress = context.email;

  // by the time you're saving this, "getSent" should have already been called
  // which would populate this
  sentCache[emailAddress] = (sentCache[emailAddress] || []).concat(sentIds);
  //console.log("set", emailAddress, sentCache[emailAddress]);  
  
  //ids.map((id) => sent[email].push(id));
}


export { 
  loadAlerts,
  preloadSent,
  loadSent,
  recordSentLinks,
  recordAlertSent
}