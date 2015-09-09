import Cron from './Cron';
// import CronParser from 'cron-parser';

function job() {
  console.log(`Run at '${new Date()}`);
}

let newJob = new Cron('*/2 * * * * *', job);

newJob.runScheduling();

// try {
//  var interval = CronParser.parseExpression('*/2 * * * * *');
//
//  console.log('Date: ', interval.next());
//  console.log('Date: ', interval.next());
//  console.log('Date: ', interval.next());
//  console.log('Date: ', interval.next());
// } catch (err) {
//  console.log('Error: ' + err.message);
// }
