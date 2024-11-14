import mustUseResult from "./rules/must-consume-result";
import pkg from "../package.json";

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    "must-consume-result": mustUseResult,
  },
  processors: {},
};

export default plugin;
