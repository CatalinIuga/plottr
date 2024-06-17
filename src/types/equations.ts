export enum Variable {
  X = "x",
  Y = "y",
  Z = "z",
}

export interface Equation {
  dependentVariable: Variable;
  function: string;
  independentVariables: Variable[];
  text: string;
}
