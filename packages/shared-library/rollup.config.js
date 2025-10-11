import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/shared.js',
      format: 'umd',
      name: 'SharedLibrary',
      sourcemap: true,
      globals: {
        'rxjs': 'rxjs'
      }
    },
    {
      file: 'dist/shared.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/shared-library.js',
      format: 'system',
      sourcemap: true
    }
  ],
  external: ['rxjs'],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist/types'
    })
  ]
});