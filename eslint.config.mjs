import globals, { node } from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { trace } from "console";


export default [
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
 
];
