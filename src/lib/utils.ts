import { Equation, Variable } from "@/types/equations";
import { type ClassValue, clsx } from "clsx";
import { evaluate } from "mathjs";
import { twMerge } from "tailwind-merge";
import { Color, Vector3 } from "three";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const preprocessInput = (func: string): Equation => {
  const variables = Object.values(Variable);
  func = func.replace(/\s/g, " ").toLowerCase();
  const sides = func.split("=").map((side) => side.trim());
  switch (sides.length) {
    case 1: {
      const dependentVariables = variables.filter(
        (variable) => !func.includes(variable)
      );
      if (dependentVariables.length !== 1) throw new Error("Invalid function");
      const dependentVariable = dependentVariables[0] as Variable;
      return {
        dependentVariable: dependentVariable,
        function: func,
        independentVariables: variables.filter((variable) => func.includes(variable)),
        text: dependentVariable.concat(" = ", func),
      };
    }
    case 2: {
      const [leftSide, rightSide] = sides as [Variable, string];
      if (!variables.includes(leftSide) || rightSide.includes(leftSide)) {
        throw new Error("Invalid function");
      }
      return {
        dependentVariable: leftSide,
        function: rightSide,
        independentVariables: variables.filter((variable) => rightSide.includes(variable)),
        text: func,
      };
    }
    default:
      throw new Error("Invalid function");
  }
};

export const createGraphData = (fn: Equation) => {
  const points: Array<Vector3> = [];
  for (let u = -10; u < 10; u += 0.1) {
    for (let v = -10; v < 10; v += 0.1) {
      try {
        let x, y, z;
        switch (fn.dependentVariable) {
          case Variable.X: {
            y = u;
            z = v;
            x = evaluate(fn.function, { y, z });
            break;
          }
          case Variable.Y: {
            x = u;
            z = v;
            y = evaluate(fn.function, { x, z });
            break;
          }
          case Variable.Z: {
            x = u;
            y = v;
            z = evaluate(fn.function, { x, y });
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
