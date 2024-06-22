export type MacroMarker<TResult> = <TObj>(obj: TObj) => TResult;
export type MacroImplementation<T = unknown> = () => T;
export type IdentityMacroMarker = <T>(obj: T) => T;

