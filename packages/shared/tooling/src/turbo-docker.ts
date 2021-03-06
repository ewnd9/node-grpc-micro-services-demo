import execa from 'execa';
import { bool, cleanEnv, str } from 'envalid';
import { promises as fs } from 'fs';
import { readTurboHash } from './utils/read-turbo-hash';

export async function turboDocker() {
  const { CI: isCI, npm_package_name: pkgName } = cleanEnv(process.env, {
    CI: bool({ default: false }),
    npm_package_name: str(),
  });

  const { hash: turboHash, dockerImage } = readTurboHash();
  const image = `${dockerImage}:${turboHash}`;

  if (isCI && (await isDockerImageExists(image))) {
    console.log(`${image} already exists`);
    return;
  }

  const { stdout: rootDir } = await execa(`git rev-parse --show-toplevel`, {
    shell: true,
  });
  const { stdout: gitSha } = await execa(`git rev-parse HEAD`, { shell: true });

  const distDir = `.turbo-prune/${pkgName}`;
  await execa(`rm -rf ${distDir}`, { shell: true });
  await execa(`yarn turbo prune --scope=${pkgName} --cwd=${distDir} --docker`, {
    shell: true,
    cwd: rootDir,
  });
  await execa(`cp yarn.lock ${distDir}/out/json`, {
    shell: true,
    cwd: rootDir,
  });
  await execa(`cp provision/template.Dockerfile ${distDir}/Dockerfile`, {
    shell: true,
    cwd: rootDir,
  });

  const pkgPath = process.cwd().replace(`${rootDir}/`, '');
  await fs.appendFile(`${rootDir}/${distDir}/Dockerfile`, `CMD ["node", "${pkgPath}/dist"]\n`);

  await execa(`docker build -t ${image} --label "GIT_SHA=${gitSha}" .`, {
    shell: true,
    cwd: `${rootDir}/${distDir}`,
  });

  console.log(`${image} created`);

  if (!isCI) {
    return;
  }

  await execa(`docker push ${image}`, {
    shell: true,
  });
  console.log(`${image} pushed`);
}

async function isDockerImageExists(image: string) {
  let isDockerExists: boolean;

  try {
    await execa(`docker manifest inspect ${image}`, {
      shell: true,
      env: {
        DOCKER_CLI_EXPERIMENTAL: 'enabled',
      },
    });

    isDockerExists = true;
  } catch (err) {
    isDockerExists = false;
  }

  return isDockerExists;
}
