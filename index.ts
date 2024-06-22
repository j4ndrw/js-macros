import ViteMacroPlugin from './src/plugins/vite';
import type { MacroMarker, IdentityMacroMarker, MacroImplementation } from './src/types';
import { createMacro } from './src/factory';
import { createMacroTransform } from './src/transform';

export {
  ViteMacroPlugin,
  MacroMarker,
  IdentityMacroMarker,
  MacroImplementation,
  createMacro,
  createMacroTransform
}
