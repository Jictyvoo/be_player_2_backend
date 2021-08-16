import { buildServer } from './app';

const serverPromise = buildServer();
const PORT = 8080;

serverPromise.then((server) =>
  server.listen(PORT, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  })
);
