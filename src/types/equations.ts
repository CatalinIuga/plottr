import { Color, Vector3 } from "three";

/**
 * Cele trei variabile posibile într-o ecuație 3D.
 */
export enum Variable {
  X = "x",
  Y = "y",
  Z = "z",
}

/**
 * Datele generale ale unei ecuații.
 */
export interface Equation {
  is3D?: boolean; // Poate fi 2D sau 3D
  color: Color; // Culoarea folosită în reprezentarea grafică
  dependentVariable: Variable; // Variabila dependentă (care este calculată)
  body: string; // Întregul text al ecuației
  independentVariables: Variable[]; // Variabilele independente (în funcție de care se calculează dependentVariable)
  text: string; // Textul ecuației (fără variabila dependentă)
}

/**
 * Datele de representare grafică ale unei ecuații.
 */
export interface FunctionPlotData {
  is3D?: boolean; // Poate fi 2D sau 3D
  points: Vector3[]; // Punctele ce trebuie reprezentate
  color: Color; // Culoarea folosită în reprezentarea grafică
}
