import { MacroImplementation } from './types';

export const createMacro = <TArg extends any, TResult>(macro: (arg: TArg) => TResult): MacroImplementation<TArg, TResult> => macro;
