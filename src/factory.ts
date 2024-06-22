import { MacroImplementation } from './types';

export const createMacro = <T>(macro: () => T): MacroImplementation<T> => macro;
