const connection = require('./connection');

const executaQuery = (query, params = '') => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results, fields) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

module.exports = executaQuery;
