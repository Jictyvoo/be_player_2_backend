import {
  FastifyInstance,
  FastifyLoggerInstance,
  FastifyPluginCallback,
} from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

abstract class AbstractRouter {
  abstract get prefix(): string;
  abstract get middlewares(): FastifyPluginCallback[];

  abstract routes(
    server: FastifyInstance<
      Server,
      IncomingMessage,
      ServerResponse,
      FastifyLoggerInstance
    >
  ): void;

  buildRoutes(server: FastifyInstance): void {
    //server.register(this.middlewares);
  }
}

export { AbstractRouter };
