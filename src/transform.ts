import { Node, walk } from 'estree-walker';
import MagicString from 'magic-string';
import { Program, Options } from 'acorn';
import { MacroImplementation } from './types';

export type Parser = (code: string, options: Options) => Program;

export const createMacroTransform = <
  TMacros extends Record<string, MacroImplementation>,
  TElisions extends Record<string, MacroImplementation>
>({
  macros = {},
  elisions = {},
}: {
  macros?: TMacros | object;
  elisions?: TElisions | object;
}) => {
  const registeredMacros = Object.keys(macros);
  const elidedMacros = Object.keys(elisions);

  const hasMacro = (code: string): boolean => registeredMacros.concat(elidedMacros).some(key => code.includes(key));

  const getArgumentValue = (node: Node | null): any | any[] => {
    switch (node?.type) {
      case 'Literal':
        return node.value;
      case 'ArrayExpression':
        return node.elements.map(getArgumentValue);
      case 'ObjectExpression':
        return Object.fromEntries(
          node.properties.map(prop => [
            // @ts-ignore-comment
            prop.key.name,
            // @ts-ignore-comment
            getArgumentValue(prop.value),
          ]),
        );
      default:
        return undefined;
    }
  };

  return (code: string, parser: Parser) => {
      if (!hasMacro(code)) return undefined;

      let areMacrosElided = false;
      for (const elidedMacro of elidedMacros) {
        if (code.includes(elidedMacro)) {
          // @ts-ignore-comment
          code = code.replaceAll(elidedMacro, '');
          areMacrosElided = true;
        }
      }

      const s = new MagicString(code);

      walk(
        // @ts-ignore
        parser(code, {
          sourceType: 'module',
          ecmaVersion: 'latest',
        }),
        {
          enter(node) {
            if (
              node.type !== 'CallExpression'
              || node.callee.type !== 'Identifier'
              || !registeredMacros.includes(node.callee.name)
            ) {
              return;
            }
            const macroReturnValue = JSON.stringify(
              // @ts-ignore-comment
              macros[node.callee.name](...node.arguments.map(getArgumentValue)),
            );
            // @ts-ignore-comment
            s.update(node.start, node.end, macroReturnValue);
          },
        },
      );

      if (areMacrosElided || s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap(),
        };
      }
      return undefined;
  }
};

