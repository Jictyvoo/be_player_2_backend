import { buildServer } from './app';

const serverPromise = buildServer();
const PORT = 8080;

serverPromise.then((server) =>
  server.listen(PORT, '0.0.0.0', (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  })
);
