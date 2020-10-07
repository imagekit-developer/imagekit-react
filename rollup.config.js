import babel from '@rollup/plugin-babel';
import commonJS from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const PLUGINS = [
	peerDepsExternal(),
	resolve(),
	babel({
		extensions: ['.js'],
	}),
	json(),
	replace({
		'process.env.NODE_ENV': JSON.stringify('production'),
	}),
	commonJS()
];

export default [
	{
		input: 'src/index.js',
		external: ['react', 'prop-types'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' },
		],
		plugins: PLUGINS,
	},
	// UMD build with inline PropTypes
	{
		input: 'src/index.js',
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
		input: 'src/index.js',
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