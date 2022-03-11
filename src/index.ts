import type { Plugin } from "vite";
import { name } from "../package.json";

function remainExports(): Plugin {
  return {
    name,
    enforce: "post",
    apply: "build",
    options(options) {
      return {
        ...options,
        preserveEntrySignatures: "strict",
      };
    },
    transform(code, id) {
      if (id.endsWith("html") && this.getModuleInfo(id)?.isEntry) {
        return code.replace(/import/g, "export * from");
      }
      return null;
    },
  };
}

export default remainExports;
