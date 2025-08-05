import { build } from 'esbuild';
import { copy } from 'fs-extra';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '..');
const distDir = resolve(projectRoot, 'dist');

console.log('🏗️  Building Medical Admissions Platform...');

try {
  // Clean dist directory
  await copy(resolve(projectRoot, 'public'), distDir, { overwrite: true });
  
  // Build with esbuild
  const result = await build({
    entryPoints: [resolve(projectRoot, 'src/main.jsx')],
    bundle: true,
    outdir: resolve(distDir, 'assets'),
    format: 'esm',
    target: ['es2020'],
    minify: true,
    sourcemap: false,
    splitting: true,
    chunkNames: 'chunks/[name]-[hash]',
    metafile: true,
    loader: {
      '.jsx': 'jsx',
      '.js': 'js',
      '.css': 'css',
      '.svg': 'file',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.ico': 'file'
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    plugins: [
      {
        name: 'css-chunks',
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, async (args) => {
            const css = await build.fs.readFile(args.path, 'utf8');
            return {
              contents: css,
              loader: 'css'
            };
          });
        }
      }
    ]
  });

  console.log('✅ Build completed successfully!');
  console.log(`📁 Output directory: ${distDir}`);
  
  // Copy additional assets
  await copy(resolve(projectRoot, 'public'), distDir, { overwrite: true });
  
  console.log('🎉 Medical Admissions Platform is ready for deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}