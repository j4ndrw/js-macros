import { example$ } from "./macros/example";
import { square$ } from "./macros/square";

const example = example$("something goes here");
const square = square$({ value: 2 });

export { example, square };
