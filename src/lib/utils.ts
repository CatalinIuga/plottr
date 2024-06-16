import { type ClassValue, clsx } from "clsx";
import { evaluate } from "mathjs";
import { twMerge } from "tailwind-merge";
import { Color, Vector3 } from "three";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const preprocessInput = (func: string): string => {
  const variables = ["x", "y", "z"];
  const sides = func.split("=").map((side) => side.trim());
  switch (sides.length) {
    case 1: {
      const dependentVariables = variables.filter(
        (variable) => !func.includes(variable)
      );
      if (dependentVariables.length !== 1) throw new Error("Invalid function");
      func = dependentVariables.toString().concat(" = ", func);
      return func;
    }
    case 2: {
      const leftSide = sides[0];
      const rightSide = sides[1];
      if (!variables.includes(leftSide) || rightSide.includes(leftSide)) {
        throw new Error("Invalid function");
      }
      return func;
    }
    default:
      throw new Error("Invalid function");
  }
};

export const createGraphData = (fn: string) => {
  const points: Array<Vector3> = [];
  const sides = fn.split("=").map((side) => side.trim());
  const dependentVariable = sides[0];
  const equation = sides[1];
  for (let u = -10; u < 10; u += 0.1) {
    for (let v = -10; v < 10; v += 0.1) {
      try {
        let x, y, z;
        switch (dependentVariable) {
          case "x": {
            y = u;
            z = v;
            x = evaluate(equation, { y, z });
            break;
          }
          case "y": {
            x = u;
            z = v;
            y = evaluate(equation, { x, z });
            break;
          }
          case "z": {
            x = u;
            y = v;
            z = evaluate(equation, { x, y });
            break;
          }
        }
        points.push(new Vector3(x, y, z));
      } catch (e) {
        console.error(`Error in function ${fn}: ${e}`);
      }
    }
  }
  return { points, color: new Color(Math.random() * 0xffffff) };
};
