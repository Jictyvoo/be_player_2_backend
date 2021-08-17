import fp from 'fastify-plugin';

export interface IPasetoConfig {
  secretKey: string;
}

export default fp(
  async function (fastify, opts) {
    fastify.decorate('exampleDecorator', () => {
      return 'decorated';
    });
  },
  { fastify: '3.x' }
);
