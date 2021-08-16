import { config, parse } from 'dotenv';

export interface IDefaultEnvironmnet {
  secretKey: string;
  databaseURL: string;
}

function getEnv(): IDefaultEnvironmnet {
  config({ path: './.env' });
  const buffer = Buffer.from('BASIC=basic');
  const envConfig = parse(buffer);
  return { secretKey: envConfig['SECRET_KEY'], databaseURL: '' };
}

export const defaultEnv = getEnv();
