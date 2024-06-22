import { describe, expect, it } from "vitest";
import { parse as parser } from "acorn";
import { createMacro, createMacroTransform } from "..";

describe("Macro Resolver", () => {
  it("should expand macro to the result described in the macro's implementation", () => {
    // Given
    const codeToCompile = `
const x = "something";
const y = macroThatReplacesArgumentWithWhatever$("something else");
`;
    const macroThatReplacesArgumentWithWhatever$ = createMacro(
      () => "whatever",
    );
    const macros = { macroThatReplacesArgumentWithWhatever$ };
    const transform = createMacroTransform({ macros });

    // When
    const { code = codeToCompile } = transform(codeToCompile, parser) ?? {};

    // Then
    const expectedCode = `
const x = "something";
const y = "whatever";
`;
    expect(code).toBe(expectedCode);
  });

  it("should elide macro if it is in the list of elisions", () => {
    // Given
    const codeToCompile = `
const x = "something";
const y = macroThatReplacesArgumentWithWhatever$("something else");
`;
    const macroThatReplacesArgumentWithWhatever$ = createMacro(
      () => "whatever",
    );
    const elisions = { macroThatReplacesArgumentWithWhatever$ };
    const transform = createMacroTransform({ elisions });

    // When
    const { code = codeToCompile } = transform(codeToCompile, parser) ?? {};

    // Then
    const expectedCode = `
const x = "something";
const y = ("something else");
`;
    expect(code).toBe(expectedCode);
  });

  it("should expand macro to the result described in the macro's implementation and use the given argument", () => {
    // Given
    const codeToCompile = `
const x = "something";
const y = hello$("j4ndrw");
const z = square$({ value: 2 });
`;
    const hello$ = createMacro((name: string) => `hello ${name}`);
    const square$ = createMacro(({ value }: { value: number }) => ({
      value: value * value,
    }));

    const macros = { hello$, square$ };
    const transform = createMacroTransform({ macros });

    // When
    const { code = codeToCompile } = transform(codeToCompile, parser) ?? {};

    // Then
    const expectedCode = `
const x = "something";
const y = "hello j4ndrw";
const z = {"value":4};
`;
    expect(code).toBe(expectedCode);
  });
});
