import { describe, expect, it } from 'vitest';
import { parse as parser } from "acorn";
import { createMacro, createMacroTransform } from "..";

describe("Macro Resolver", () => {
  it("should expand macro to the result describe in the macro's implementation", () => {
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
});
