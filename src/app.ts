import { userRouter } from '@routes/user_routes';
import { enterpriseRouter } from '@routes/enterprise_routes';
import { fastify, FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';

export async function buildServer(): Promise<FastifyInstance> {
  const mainServer = fastify({
    logger: true,
  });

  // MIDDLEWARES

  mainServer.register(fastifyCors, (instance) => (req, callback) => {
    let corsOptions;
    // do not include CORS headers for requests from localhost
    if (/localhost/.test(req.hostname)) {
      console.log(req.hostname);
      corsOptions = { origin: false };
    } else {
      corsOptions = { origin: true };
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  });

  // Adding our custom routes to the app
  userRouter(mainServer);
  enterpriseRouter(mainServer);
  return mainServer;
}
