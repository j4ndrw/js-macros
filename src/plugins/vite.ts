import { SourceMap } from "magic-string";
import { createMacroTransform } from "../transform";
import { MacroImplementation } from "../types";

type MacroPlugin = {
  name: string;
  transform: (
    code: string,
    filename: string,
  ) => { code: string; map: SourceMap } | undefined;
};

export default <
  TMacros extends Record<string, MacroImplementation>,
  TElisions extends Record<string, MacroImplementation>,
>({
  macros = {},
  elisions = {},
}: {
  macros?: TMacros | object;
  elisions?: TElisions | object;
}): MacroPlugin => {
  const macroTransform = createMacroTransform({ macros, elisions });
  return {
    name: "macros",
    transform(code) {
      // @ts-ignore
      return macroTransform(code, this.parse);
    },
  };
};
