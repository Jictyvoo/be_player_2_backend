import { generateKeyPairSync } from 'crypto';
import { V2 as pasetoV2 } from 'paseto';

const { privateKey, publicKey } = generateKeyPairSync('ed25519', {
  namedCurve: 'sect239k1',
});

export async function createPayload(
  data: any,
  expiresAt: Date,
  secretKey?: string
): Promise<string> {
  // TODO: On Node 1.16, use environment secret key to generate the KeyObject.from
  const token = await pasetoV2.sign(
    {
      data: data,
      expires_at: expiresAt,
    },
    privateKey
  );
  return token;
}

export const pasetoPrivateKey = privateKey;
