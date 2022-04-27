#!/usr/bin/env node

import minimist from 'minimist';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const argv = minimist(process.argv.slice(2), { string: '_' });
  const mapper = {
    async 'build-proto'() {
      const { buildProto } = await import('./build-proto');
      await buildProto();
    },
    async 'turbo-build'() {
      const { turboBuild } = await import('./turbo-build');
      await turboBuild();
    },
    async 'turbo-docker'() {
      const { turboDocker } = await import('./turbo-docker');
      await turboDocker();
    },
    async 'generate-package'() {
      const { generatePackage } = await import('./generate-package');
      await generatePackage({ type: argv.type, name: argv.name });
    },
  };

  const fn = mapper[argv._[0]];

  if (!fn) {
    console.error(`unknown option ${argv._[0]}, should be <${Object.keys(mapper).join('|')}>`);
    process.exit(1);
  }

  await fn();
}
