const winston = require('winston');
const path = require('path');

const options = {
  from: new Date() - 24 * 60 * 60 * 1000,
  until: new Date(),
  limit: 10,
  start: 0,
  order: 'desc',
  fields: ['message'],
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({ level: 'silly' }),
    // path.join(__dirname,'../../../bcb/crawllerBCC/utils/assets/logs/log.txt');
    new winston.transports.File({
      filename: path.join(
        __dirname,
        '../../../../bcb/crawllerBCC/utils/assets/logs/somefile.log'
      ),
      level: 'info',
    }),
    new winston.transports.File({
      filename: path.join(
        __dirname,
        '../../../../bcb/crawllerBCC/utils/assets/logs/error.log'
      ),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(
        __dirname,
        '../../../../bcb/crawllerBCC/utils/assets/logs/combined.log'
      ),
    }),
    new winston.transports.File({
      filename: path.join(
        __dirname,
        '../../../../bcb/crawllerBCC/utils/assets/logs/path/to/combined.log'
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'path/to/exceptions.log' }),
  ],
});

logger.query(options, (err, results) => {
  if (err) throw err;
  console.log(results);
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
