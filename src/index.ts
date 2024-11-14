import mustUseResult from "./rules/must-consume-result";
import pkg from "../package.json";
import recommended from "./configs/recommended";

export = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    "must-consume-result": mustUseResult,
  },
  processors: {},
  configs: {
    recommended,
  },
};
