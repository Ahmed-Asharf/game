const connection = require('./connect');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

connection.connect((err) => {
  if (err) {
    console.log(`error: ${err.message}`);
  }
  console.log('connected to the mySql server');
});

app.listen(port, () => {
  console.log(`server is running on localhost:${port}`);
});
