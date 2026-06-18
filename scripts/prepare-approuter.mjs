import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const projectRoot = process.cwd();
const approuterRoot = join(projectRoot, 'approuter');
const resourcesRoot = join(approuterRoot, 'resources');

const sourceItems = [
  'Component.js',
  'index.html',
  'manifest.json',
  'Staticfile',
  'css',
  'controller',
  'model',
  'view',
  'Sample_Template',
];

rmSync(resourcesRoot, { recursive: true, force: true });
mkdirSync(resourcesRoot, { recursive: true });

for (const item of sourceItems) {
  const sourcePath = join(projectRoot, item);
  if (!existsSync(sourcePath)) {
    continue;
  }

  cpSync(sourcePath, join(resourcesRoot, item), { recursive: true });
}

console.log(`Prepared approuter resources at ${resourcesRoot}`);