import babel from '@rollup/plugin-babel';
import commonJS from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const extensions = ['.js', '.ts', '.jsx', '.tsx'];

const PLUGINS = [
	peerDepsExternal(),
	resolve(),
	babel({
		extensions: extensions,
	}),
	typescript({
		tsconfig: './tsconfig.build.json',
		declaration: true,
		declarationDir: 'dist',
	  }),
	json(),
	replace({
		'process.env.NODE_ENV': JSON.stringify('production'),
	}),
	commonJS()
];

export default [
	{
		input: 'src/index.tsx',
		external: ['react', 'prop-types'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' },
		],
		plugins: PLUGINS,
	},
	// UMD build with inline PropTypes
	{
		input: 'src/index.tsx',
		external: ['react'],
		output: [
			{
				name: 'ImageKitReact',
				file: pkg.browser,
				format: 'umd',
				globals: {
					react: 'React',
				},
			},
		],
		plugins: PLUGINS,
	},
	// Minified UMD Build With PropTypes
	{
		input: 'src/index.tsx',
		output: [
			{
				name: 'ImageKitReact',
				file: pkg['browser:min'],
				format: 'umd',
				globals: {
					react: 'React',
				},
			},
		],
		plugins: [...PLUGINS, terser()],
	},
];