import execa from 'execa';
import fs from 'fs';
import path from 'path';

export async function buildProto() {
  const rootDir = path.resolve(`${__dirname}/../../../..`);
  const cwd = process.cwd();
  const files = fs.readdirSync(`${cwd}/proto`);

  fs.mkdirSync('dist', { recursive: true });

  for (const file of files) {
    await execa('protoc', [
      `--plugin=protoc-gen-ts_proto=${rootDir}/node_modules/.bin/protoc-gen-ts_proto`,
      `--ts_proto_out=${cwd}/dist`,
      `--ts_proto_opt=outputServices=generic-definitions,useExactTypes=false,esModuleInterop=true`,
      `--descriptor_set_out=${cwd}/dist/${file}.bin`,
      `--include_imports`,
      `--proto_path=${cwd}/proto`,
      `${cwd}/proto/${file}`,
    ]);

    await execa(`${rootDir}/node_modules/.bin/tsc`);
    fs.unlinkSync(`${cwd}/dist/${file.split('.')[0]}.ts`);
  }
}
