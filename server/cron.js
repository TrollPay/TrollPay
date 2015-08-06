/********************************* NPM MODULES ********************************/

var CronJob = require('cron').CronJob;

/******************************* GLOBAL IMPORTS *******************************/

var EmailController = require('./database/emails/EmailController.js');

/******************************* PUBLIC METHODS *******************************/

/*
 * setCron
 * Runs the crontask every day of the week at 11:30am.
 */
module.exports.setCron = function(){
  new CronJob('00 30 11 * * 0-6', cronTask, postCronTask, true, 'America/Los_Angeles');
};

/******************************* PRIVATE METHODS ******************************/

var cronTask = function(){ EmailController.sendDailyEmails(); };
var postCronTask = function(){
  console.log('[SUCCESS] sent out daily emails.');
};
