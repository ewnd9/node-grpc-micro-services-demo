import execa from 'execa';
import { cleanEnv, str } from 'envalid';
import fs from 'fs';

export async function turboBuild() {
  const { TURBO_HASH } = cleanEnv(process.env, {
    TURBO_HASH: str(),
    npm_package_name: str(),
  });

  await execa(`yarn build`, {
    shell: true,
    stdio: 'inherit',
  });

  fs.writeFileSync(`dist/turbo-hash.json`, JSON.stringify({ hash: TURBO_HASH }));
}
