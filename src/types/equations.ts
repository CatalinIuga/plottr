export enum Variable {
  X = 0,
  Y = 1,
  Z = 2,
}

export interface Equation {
  dependentVariable: Variable;
  function: string;
  independentVariables: Variable[];
  text: string;
}
