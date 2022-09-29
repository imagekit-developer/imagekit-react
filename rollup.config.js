import babel from '@rollup/plugin-babel';
import commonJS from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import extensions from 'rollup-plugin-extensions';

const PLUGINS = [
	peerDepsExternal(),
	resolve(),
	extensions({
		// Supporting Typescript files
		// Uses ".mjs, .js" by default
		extensions: ['.tsx', '.ts', '.jsx', '.js'],
		// Resolves index dir files based on supplied extensions
		// This is enable by default
		resolveIndex: true,
	  }),
	babel({
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	}),
	json(),
	replace({
		'process.env.NODE_ENV': JSON.stringify('production'),
	}),
	commonJS()
];

export default [
	{
		input: 'src/index.ts',
		external: ['react', 'prop-types'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' },
		],
		plugins: PLUGINS,
	},
	// UMD build with inline PropTypes
	{
		input: 'src/index.ts',
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
		input: 'src/index.ts',
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