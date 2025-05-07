import babel from "@rollup/plugin-babel";
import commonJS from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const PLUGINS = [
  peerDepsExternal(),
  resolve({ extensions }),
  typescript({ tsconfig: "./tsconfig.json" }),
  babel({
    extensions,
    babelHelpers: "bundled",
    include: ["src/**/*"],
  }),
  json(),
  commonJS(),
];

export default [
  // Main entry build (client and shared code)
  {
    input: "src/index.ts",
    external: ["react"],
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true },
    ],
    plugins: PLUGINS,
  }
];
