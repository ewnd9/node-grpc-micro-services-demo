import execa from 'execa';
import { cleanEnv, str } from 'envalid';

export async function turboDocker() {
  const { TURBO_HASH, npm_package_name: pkgName } = cleanEnv(process.env, {
    TURBO_HASH: str(),
    npm_package_name: str(),
  });

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

  const image = `${pkgName.split('/').pop()}:${TURBO_HASH}`;
  await execa(`docker build -t ${image} --label "GIT_SHA=${gitSha}" .`, {
    shell: true,
    cwd: `${rootDir}/${distDir}`,
  });

  console.log(`${image} created`);
}
