import { createMacro } from "../../../dist";

export const square$ = createMacro(({ value }: { value: number }) => ({
  value: value * value,
}));
