import {isTesting} from '../env';
import * as _ from 'lodash';

const async = require("async");
  

const sentCache: any = {};

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

function loadSent(email: string, finalCallback: any) {
var GoogleSpreadsheet = require("google-spreadsheet");
  const doc = new GoogleSpreadsheet(getSpreadsheetId());
  let sheet: any = null;
  
  if (!sentCache[email]) {
    sentCache[email] = [];
  }

  async.series([
    function setAuth(step: any) {
      doc.useServiceAccountAuth(getAuthentication(), step);
    },
    function getInfoAndWorksheets(step: any) {
      doc.getInfo(function(err: any, info: any) {
        console.log(err);
        //console.log(JSON.stringify(info, null, 2));
        var sheetId = _.findIndex(info.worksheets,
          (worksheet: any) => worksheet['title'] === "Sent"
        ); 

        sheet = info.worksheets[sheetId];

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
        console.log("Read "+rows.length+" rows");
    
        rows.map(
          (data: any) => {
            const email = data["email"];

            const link = data["link"] + "";
            sentCache[email].push(link);
          }
        );

        step();
      });
    }
  ], function(err: any){
    if (err) {
      console.log("Error: " + err);
    }

    finalCallback(sentCache[email]);
  });
}

export { 
  loadSent
}