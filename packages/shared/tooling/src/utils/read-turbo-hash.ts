import fs from 'fs';

export function readTurboHash(): { hash: string; dockerImage: string } {
  const filePath = `dist/turbo-hash.json`;

  if (!fs.existsSync(filePath)) {
    throw new Error(`${filePath} doesn't exist`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
