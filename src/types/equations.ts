import { Color, Vector3 } from "three";

export enum Variable {
  X = "x",
  Y = "y",
  Z = "z",
}

export interface Equation {
  is3D?: boolean;
  color: Color;
  dependentVariable: Variable;
  body: string;
  independentVariables: Variable[];
  text: string;
}

export interface FunctionPlotData {
  is3D?: boolean;
  points: Vector3[];
  color: Color;
}
