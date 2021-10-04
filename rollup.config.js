import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import externals from "rollup-plugin-node-externals";
import pkg from "./package.json";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

const ENV_PRODUCTION = "production";
const ENV_DEVELOPMENT = "development";
const env = process.env.NODE_ENV || ENV_PRODUCTION;

if (env !== ENV_DEVELOPMENT && env !== ENV_PRODUCTION) {
  console.error(`
Unsupported NODE_ENV: ${env}
Should be either "${ENV_DEVELOPMENT}" or "${ENV_PRODUCTION}"
`);
  process.exit(1);
}
const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: `src/${pkg.name}.ts`,
  output: [
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      preserveModulesRoot: "src",
    },
  ].filter(Boolean),
  watch: {
    include: "src/**",
  },
  plugins: [
    externals({ peerDeps: true, deps: true, exclude: ["azure-maps-control", "azure-maps-drawing-tools"] }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env),
      preventAssignment: true,
    }),
    json(),
    postcss({
      extensions: [".css"],
    }),
    resolve({
      browser: true,
      extensions,
    }),
    commonjs(),
    babel({
      rootMode: "upward",
      extensions,
      babelHelpers: "runtime",
      include: ["./src/**/*"],
    }),
    terser(),
  ],
};
