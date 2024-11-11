import { RuleTester } from "@typescript-eslint/rule-tester";
import TSESLint from "typescript-eslint";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: TSESLint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      projectService: {
        allowDefaultProject: ["*.ts"],
      },
    },
  },
});

export default ruleTester;
