import fs from 'fs';
import path from 'path';

export function* directoryCrawler(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      yield* directoryCrawler(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}
