import { cleanEnv, str } from 'envalid';

export const config = cleanEnv(process.env, {
  STAR_WARS_API_URL: str({ default: 'https://swapi.dev' }),
});
