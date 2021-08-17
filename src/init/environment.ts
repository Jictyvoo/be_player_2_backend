import { config, parse } from 'dotenv';

export interface IDefaultEnvironmnet {
  secretKey: string;
  databaseURL: string;
}

function getEnv(): IDefaultEnvironmnet {
  const envConfig = config({ path: './.env' });
  const parsedEnv = envConfig.parsed;
  return { secretKey: parsedEnv['SECRET_KEY'] ?? 'No-KEY', databaseURL: '' };
}

export const defaultEnv = getEnv();
