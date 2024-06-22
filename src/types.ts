export type MacroMarker<TArg, TResult> = (obj: TArg) => TResult;
export type MacroImplementation<TArg extends unknown = unknown, TResult = unknown> = (
  arg: TArg,
) => TResult;
export type IdentityMacroMarker = <T>(obj: T) => T;
