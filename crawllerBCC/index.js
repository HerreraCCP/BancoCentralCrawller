const customExpress = require('./config/customExpress');
const connection = require('./infrastructure/database/connection');
const Tables = require('./infrastructure/database/tables');

connection.connect((error) => {
  if (error) console.log(error);
  else console.log('Connect');

  Tables.init(connection);

  const app = customExpress();
  app.listen(3000, () => console.log('The server is running!!!!'));
});
