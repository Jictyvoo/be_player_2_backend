import { config, parse } from 'dotenv';
import express from 'express';

void function getEnv() {
  config({ path: './.env' });
  const buffer = Buffer.from('BASIC=basic');
  const envConfig = parse(buffer);
};

const app = express();
const PORT = 8080;
console.log(app.settings);
app.get('/', (request, response) => response.send('Hello World'));
app.listen(PORT, () => {
  console.log('Server is running');
});
