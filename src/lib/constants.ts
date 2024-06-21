import {
  BasicShadowMap,
  NoToneMapping,
  Plane,
  SRGBColorSpace,
  Vector3,
} from "three";

/**
 * Dimensiunea spațiului de desenare.
 */
export const boxSize = parseInt(localStorage.getItem("boxSize") || "10") || 10; // fallback to fallback. nice :)

/**
 * Setează dimensiunea spațiului de desenare.
 */
export function setBoxSize(newBoxSize: number) {
  localStorage.setItem("boxSize", newBoxSize.toString());
  location.reload();
}

/**
 * Opțiunile de randare ale scenei.
 */
export const options = {
  shadows: true,
  alpha: false,
  antialias: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
  clearColor: "#252525",
};

/**
 * Planurile de limitare ale spațiului de desenare.
 */
export const clipPlanes = [
  new Plane(new Vector3(1, 0, 0), boxSize / 2),
  new Plane(new Vector3(-1, 0, 0), boxSize / 2),
  new Plane(new Vector3(0, 1, 0), boxSize / 2),
  new Plane(new Vector3(0, -1, 0), boxSize / 2),
  new Plane(new Vector3(0, 0, 1), boxSize / 2),
  new Plane(new Vector3(0, 0, -1), boxSize / 2),
];
