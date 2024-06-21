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

/**
 * Atribuie valorile variabilelor independente în funcție de variabila dependentă.
 */
function assignVariables(
  independentVars: Variable[],
  dependentVar: Variable,
  u: number,
  v: number
) {
  let missingVars: Variable[] | undefined; // Variabilele care lipsesc din ecuație
  missingVars = Object.values(Variable).filter(
    (variable) =>
      !independentVars.includes(variable) && variable !== dependentVar
  );

  // if there is more than
  if (!missingVars) throw new Error("Invalid function, missing variable");

  // în funcție de numărul de variabile lipsă, se atribuie valorile variabilelor independente
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
    // dacă lipsesc ambele variabile independente, se atribuie valorile lui u și v variabilelor lipsă
    default:
      return {
        [missingVars[0]]: u,
        [missingVars[1]]: v,
      };
  }
}

/**
 * Preprocesează inputul primit de la utilizator și îl transformă într-o ecuație.
 */
export const preprocessInput = (func: string): Equation => {
  const variables = Object.values(Variable);
  func = func.replace(/\s/g, " ").toLowerCase(); // Se elimină spațiile inutile și se transformă totul în litere mici
  const sides = func.split("=").map((side) => side.trim()); // Se separă partea stângă de cea dreaptă a ecuației
  const color = new Color(Math.random() * 0xffffff); // Se generează o culoare aleatoare pentru reprezentarea grafică

  // Se verifică dacă ecuația este validă și se extrag variabilele independente și dependente
  switch (sides.length) {
    case 1: {
      // Dacă nu există semnul egal, se consideră că variabila lipsă este cea dependentă
      const dependentVariables = variables.filter(
        (variable) => !func.includes(variable)
      ); // Se extrag variabilele dependente
      if (dependentVariables.length !== 1)
        throw new Error("Invalid function, no dependent variable");

      const dependentVariable = dependentVariables[0] as Variable;
      const independentVariables = variables.filter((variable) =>
        func.includes(variable)
      );

      // Se folosește math.js pentru verificarea funcției și validarea variabilelor din funcție
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

      // Se verifică dacă variabilele din funcție sunt valide
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
      // Dacă există un singur semn egal, se consideră că funcția este de forma w = f(u, v)
      const [leftSide, rightSide] = sides as [Variable, string];
      if (!variables.includes(leftSide) || rightSide.includes(leftSide)) {
        throw new Error("Invalid function, same variable on both sides");
      }
      const independentVariables = variables.filter((variable) =>
        rightSide.includes(variable)
      );
      if (rightSide.trim() === "")
        throw new Error("Invalid function, empty right side");

      // Se folosește math.js pentru verificarea funcției și validarea variabilelor din funcție
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
      // Se verifică dacă variabilele din funcție sunt valide
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

/**
 * Creează datele de reprezentare grafică ale unei ecuații. Acestea pot fi sub forma unui mesh (plan) sau a unei linii.
 */
export const createGraphData = (fn: Equation): Mesh | Line2 => {
  const range = boxSize; // Plaja de valori pentru care se calculează funcția
  const maxRange = range / 2;
  const minRange = -maxRange;

  const points: Vector3[] = []; // Punctele ce trebuie reprezentate

  if (fn.is3D) {
    // Dacă funcția este 3D, se creează un mesh (plan)
    const meshFunction = (u: number, v: number, target: Vector3) => {
      u = range * u + minRange; // Se mapează valoarea lui u în intervalul [-range/2, range/2]
      v = range * v + minRange; // Se mapează valoarea lui v în intervalul [-range/2, range/2]

      const assignedVariables = assignVariables(
        fn.independentVariables,
        fn.dependentVariable,
        u,
        v
      ); // Se atribuie valorile variabilelor independente

      try {
        const w = evaluate(fn.body, assignedVariables); // Se calculează valoarea variabilei dependente
        const fullVariables = {
          ...assignedVariables,
          [fn.dependentVariable]: w,
        }; // Se adaugă valoarea variabilei dependente în variabilele atribuite
        target.set(fullVariables.x, fullVariables.y, fullVariables.z);
      } catch (e) {
        console.error("Invalid function", e);
        target.set(0, 0, 0);
      }
    };

    const graphGeometry = new ParametricGeometry(meshFunction, 100, 100); // Se creează geometria mesh-ului
    const graphMaterial = new MeshStandardMaterial({
      side: 2,
      color: fn.color,
      clippingPlanes: clipPlanes,
      clipShadows: true,
    }); // Se creează materialul mesh-ului

    return new Mesh(graphGeometry, graphMaterial);
  } else {
    // Dacă funcția este 2D, se creează o linie
    for (let i = minRange; i <= maxRange; i += 0.1) {
      let assignedVariables = {
        [fn.independentVariables[0]]: i,
        [fn.independentVariables[1]]: 0,
      }; // Se atribuie valorile variabilei independente

      // Dacă variabile dependente este Z, atunci trebuie specificată și variabile independentă
      if (
        fn.independentVariables.length === 0 &&
        fn.dependentVariable === Variable.Z
      ) {
        console.error(
          "Invalid function, Z cannot be a dependent variable in a 2D function"
        );
        fn.is3D = true;
      }

      // Altfel, planul este XY
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

/**
 *  Crează o linie pentru reprezentarea unei funcții în 2D.
 */
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
