import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';

const repoRoot = path.resolve(new URL('.', import.meta.url).pathname, '..', '..');
const websiteRoot = path.resolve(repoRoot, 'website');
const examplesRoot = path.resolve(repoRoot, 'examples');
const outputRoot = path.resolve(websiteRoot, 'static', 'examples');
const manifestPath = path.resolve(outputRoot, 'manifest.json');
const zipPath = path.resolve(outputRoot, 'all-examples.zip');

const IGNORED_DIRS = new Set(['.git', '.docusaurus', 'node_modules', '__pycache__']);
const IGNORED_FILES = new Set(['.DS_Store']);
const BLOCKED_EXTENSIONS = new Set(['.py', '.robot', '.resource']);

async function pathExists(checkPath) {
  try {
    await fs.access(checkPath);
    return true;
  } catch {
    return false;
  }
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function getWebPath(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  if (!BLOCKED_EXTENSIONS.has(ext)) {
    return relPath;
  }
  const dir = path.dirname(relPath);
  const base = path.basename(relPath);
  const safeBase = base.replace(/\./g, '_') + '.txt';
  return dir === '.' ? safeBase : toPosix(path.join(dir, safeBase));
}

async function walk(dir, rootDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      files.push(...(await walk(path.join(dir, entry.name), rootDir)));
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      const relPath = toPosix(path.relative(rootDir, fullPath));
      files.push({ fullPath, relPath });
    }
  }
  return files;
}

function buildTree(fileList) {
  const root = { name: 'examples', path: '', type: 'dir', children: [] };
  for (const file of fileList) {
    const segments = file.relPath.split('/');
    let current = root;
    segments.forEach((segment, index) => {
      const isFile = index === segments.length - 1;
      const nextPath = current.path ? `${current.path}/${segment}` : segment;
      let existing = current.children.find((child) => child.name === segment);
      if (!existing) {
        existing = {
          name: segment,
          path: nextPath,
          type: isFile ? 'file' : 'dir',
          children: isFile ? undefined : [],
        };
        current.children.push(existing);
      }
      if (!isFile) {
        current = existing;
      }
    });
  }
  return root;
}

async function copyFileToOutput(file) {
  if (!file.webPath) {
    return;
  }
  const destPath = path.join(outputRoot, file.webPath);
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.copyFile(file.fullPath, destPath);
}

async function generateZip(fileList) {
  const zip = new JSZip();
  await Promise.all(
    fileList.map(async (file) => {
      const data = await fs.readFile(file.fullPath);
      zip.file(file.relPath, data);
    })
  );
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  await fs.writeFile(zipPath, buffer);
}

export async function generateExamplesAssets() {
  await fs.mkdir(outputRoot, { recursive: true });

  if (!(await pathExists(examplesRoot))) {
    const emptyManifest = { root: 'examples', files: [], tree: buildTree([]) };
    await fs.writeFile(manifestPath, JSON.stringify(emptyManifest, null, 2));
    return;
  }

  const files = await Promise.all(
    (await walk(examplesRoot, examplesRoot)).map(async (file) => {
      const ext = path.extname(file.relPath).toLowerCase();
      const isBlocked = BLOCKED_EXTENSIONS.has(ext);
      const contentBase64 = isBlocked
        ? (await fs.readFile(file.fullPath)).toString('base64')
        : undefined;
      return {
        ...file,
        webPath: isBlocked ? null : getWebPath(file.relPath),
        contentBase64,
      };
    })
  );
  await Promise.all(files.map(copyFileToOutput));

  const manifest = {
    root: 'examples',
    files: files.map((file) => ({
      path: file.relPath,
      webPath: file.webPath,
      contentBase64: file.contentBase64,
    })),
    tree: buildTree(files),
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  if (files.length > 0) {
    await generateZip(files);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateExamplesAssets();
}
