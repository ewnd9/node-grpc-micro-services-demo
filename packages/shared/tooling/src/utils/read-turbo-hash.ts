import fs from 'fs';

export function readTurboHash(): string {
  const filePath = `dist/turbo-hash.json`;

  if (!fs.existsSync(filePath)) {
    throw new Error(`${filePath} doesn't exist`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8')).hash;
}
