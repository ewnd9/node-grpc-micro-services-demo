import execa from 'execa';
import { cleanEnv, str } from 'envalid';
import fs from 'fs';

export async function turboBuild() {
  const {
    TURBO_HASH,
    TURBO_DOCKER_IMAGE_PREFIX,
    npm_package_name: pkgName,
  } = cleanEnv(process.env, {
    TURBO_HASH: str(),
    TURBO_DOCKER_IMAGE_PREFIX: str({ default: 'test' }),
    npm_package_name: str(),
  });

  await execa(`yarn build`, {
    shell: true,
    stdio: 'inherit',
  });

  const dockerImage = `${TURBO_DOCKER_IMAGE_PREFIX}/${pkgName.split('/').pop()}`;
  fs.writeFileSync(`dist/turbo-hash.json`, JSON.stringify({ hash: TURBO_HASH, dockerImage }));
}
