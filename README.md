# clockwerk [![Build Status](https://travis-ci.org/semmatabei/clockwerk.svg?branch=master)](https://travis-ci.org/semmatabei/clockwerk)

Simple nodejs cron job scheduler.

## Usage (ES6)
```js
import { Cron } from 'clockwerk'

let cronJob = new Cron(
  'Cron Job Name',      // Name:    string
  '*/5 * * * * *',      // Date:    Crontab instructions or Date object
  () => {               // Action:  Function

    // Job to execute

  },
  () => {               // OnComplete: Function(Optional)

    // Action to run on job completed/stopped.

  });
cronJob.runScheduling();
```

## Usage (ES5)
```js
var Cron = require('clockwerk').Cron;

var cronJob = new Cron(
  'Cron Job Name',
  '*/5 * * * * *',
  function () {

    // Job to execute

  },
  function () {

    // Action to run on job completed/stopped.

  });
cronJob.runScheduling();
```

## Crontab Instruction

```bash
  *    *    *    *    *    *
  ┬    ┬    ┬    ┬    ┬    ┬
  │    │    │    │    │    |
  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  │    │    │    │    └───── month (1 - 12)
  │    │    │    └────────── day of month (1 - 31)
  │    │    └─────────────── hour (0 - 23)
  │    └──────────────────── minute (0 - 59)
  └───────────────────────── second (0 - 59, OPTIONAL)
```

## License

MIT
