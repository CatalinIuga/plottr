import { Equation, Variable } from "@/types/equations";
import { evaluate, parse } from "mathjs";
import { Color, Mesh, MeshStandardMaterial, Vector3 } from "three";
import {
  Line2,
  LineGeometry,
  LineMaterial,
  ParametricGeometry,
} from "three/examples/jsm/Addons.js";
import { boxSize, clipPlanes } from "./constants";

function assignVariables(
  independentVars: Variable[],
  dependentVar: Variable,
  u: number,
  v: number
) {
  let missingVars: Variable[] | undefined;
  missingVars = Object.values(Variable).filter(
    (variable) =>
      !independentVars.includes(variable) && variable !== dependentVar
  );

  // if there is more than
  if (!missingVars) throw new Error("Invalid function, missing variable");

  switch (missingVars.length) {
    case 0:
      return {
        [independentVars[0]]: u,
        [independentVars[1]]: v,
      };
    case 1:
      return {
        [independentVars[0]]: u,
        [missingVars[0]]: v,
      };
    // 2 missing keys means that the function is 3D
    default:
      return {
        [missingVars[0]]: u,
        [missingVars[1]]: v,
      };
  }
}

export const preprocessInput = (func: string): Equation => {
  const variables = Object.values(Variable);
  func = func.replace(/\s/g, " ").toLowerCase();
  const sides = func.split("=").map((side) => side.trim());
  const color = new Color(Math.random() * 0xffffff);

  switch (sides.length) {
    case 1: {
      const dependentVariables = variables.filter(
        (variable) => !func.includes(variable)
      );
      if (dependentVariables.length !== 1)
        throw new Error("Invalid function, no dependent variable");

      const dependentVariable = dependentVariables[0] as Variable;
      const independentVariables = variables.filter((variable) =>
        func.includes(variable)
      );

      // better then nothing lol
      let vars: string[] = [];
      try {
        vars = [
          ...new Set(
            parse(func)
              .filter(
                (node) =>
                  node.type === "SymbolNode" &&
                  !["sin", "cos", "tan", "sqrt", "log", "exp"].includes(
                    node.toString()
                  )
              )
              .map((node) => node.toString())
          ),
        ];
      } catch (e) {
        throw new Error("Invalid function, could not evaluate");
      }

      if (vars.some((v) => !["x", "y", "z"].includes(v)))
        throw new Error("Invalid function, unknown variable");

      return {
        is3D: independentVariables.length === 2 || false,
        dependentVariable,
        body: func,
        independentVariables,
        text: dependentVariable.concat(" = ", func),
        color,
      };
    }
    case 2: {
      const [leftSide, rightSide] = sides as [Variable, string];
      if (!variables.includes(leftSide) || rightSide.includes(leftSide)) {
        throw new Error("Invalid function, same variable on both sides");
      }
      const independentVariables = variables.filter((variable) =>
        rightSide.includes(variable)
      );
      if (rightSide.trim() === "")
        throw new Error("Invalid function, empty right side");

      // better then nothing lol
      let vars: string[] = [];
      try {
        vars = [
          ...new Set(
            parse(func)
              .filter(
                (node) =>
                  node.type === "SymbolNode" &&
                  !["sin", "cos", "tan", "sqrt", "log", "exp"].includes(
                    node.toString()
                  )
              )

              .map((node) => node.toString())
          ),
        ];
      } catch (e) {
        throw new Error("Invalid function, could not evaluate");
      }
      if (vars.some((v) => !["x", "y", "z"].includes(v)))
        throw new Error("Invalid function, unknown variable");

      return {
        is3D: independentVariables.length === 2 || false,
        dependentVariable: leftSide,
        body: rightSide,
        independentVariables,
        text: func,
        color,
      };
    }
    default:
      throw new Error("Invalid function, too many = signs");
  }
};

export const createGraphData = (fn: Equation): Mesh | Line2 => {
  const range = boxSize;
  const maxRange = range / 2;
  const minRange = -maxRange;

  const points: Vector3[] = [];

  if (fn.is3D) {
    const meshFunction = (u: number, v: number, target: Vector3) => {
      u = range * u + minRange;
      v = range * v + minRange;

      const assignedVariables = assignVariables(
        fn.independentVariables,
        fn.dependentVariable,
        u,
        v
      );

      try {
        const w = evaluate(fn.body, assignedVariables);
        const fullVariables = {
          ...assignedVariables,
          [fn.dependentVariable]: w,
        };
        target.set(fullVariables.x, fullVariables.y, fullVariables.z);
      } catch (e) {
        console.error("Invalid function", e);
        target.set(0, 0, 0);
      }
    };

    const graphGeometry = new ParametricGeometry(meshFunction, 100, 100);
    const graphMaterial = new MeshStandardMaterial({
      side: 2,
      color: fn.color,
      clippingPlanes: clipPlanes,
      clipShadows: true,
    });

    return new Mesh(graphGeometry, graphMaterial);
  } else {
    for (let i = minRange; i <= maxRange; i += 0.1) {
      let assignedVariables = {
        [fn.independentVariables[0]]: i,
        [fn.independentVariables[1]]: 0,
      };

      if (
        fn.independentVariables.length === 0 &&
        fn.dependentVariable === Variable.Z
      ) {
        console.error(
          "Invalid function, Z cannot be a dependent variable in a 2D function"
        );
        fn.is3D = true;
      }

      if (fn.independentVariables.length === 0) {
        assignedVariables = {
          x: i,
          y: i,
          z: 0,
        };
      }

      try {
        const w = evaluate(fn.body, assignedVariables);
        const fullVariables = {
          ...assignedVariables,
          [fn.dependentVariable]: w,
        };

        points.push(
          new Vector3(fullVariables.x, fullVariables.y, fullVariables.z)
        );
      } catch {
        console.error("Invalid function");
      }
    }
    return createThickLine(points, fn.color);
  }
};

function createThickLine(points: Vector3[], color: Color) {
  const geometry = new LineGeometry().setPositions(
    points.map((point) => [point.x, point.y, point.z]).flat()
  );
  const material = new LineMaterial({
    color,
    linewidth: 0.005,
    clippingPlanes: clipPlanes,
    clipIntersection: false,
  });

  return new Line2(geometry, material);
}
