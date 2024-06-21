<script setup lang="ts">
import { boxSize } from "@/lib/constants";
import { Stars } from "@tresjs/cientos";
import { useRenderLoop, useTresContext } from "@tresjs/core";
import {
  Color,
  CubeCamera,
  HalfFloatType,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLCubeRenderTarget,
} from "three";
import Rain from "./Rain.vue";

const props = defineProps<{ discoMode: boolean }>();

props;
// TODO: actual colors
const colors: Color[] = Array.from(
  { length: 10 },
  () => new Color(Math.random() * 0xffffff)
);

// DISCO BALL
const cubeRenderTarget = new WebGLCubeRenderTarget(512);
cubeRenderTarget.texture.type = HalfFloatType;

const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);

const baseTexture = new TextureLoader().load("/disco.jpg");

const material = new MeshStandardMaterial({
  envMap: cubeRenderTarget.texture,
  roughness: 0.05,
  metalness: 1,
  normalMap: baseTexture,
});

const discoBall = new Mesh(new SphereGeometry(1, 32, 32), material);

// Update the cube camera
const { renderer, scene } = useTresContext();
const { onLoop } = useRenderLoop();
onLoop(() => {
  cubeCamera.update(renderer.value, scene.value);
});

const discoBallPosition = new Vector3(0, boxSize / 2 - boxSize / 8, 0);
</script>

<template>
  <Rain
    v-for="(color, idx) in colors"
    :area="[boxSize, boxSize, boxSize]"
    :key="idx"
    :color="color"
    :size="0.3"
    :count="discoMode ? 100 : 0"
    :speed="Math.random() * 0.5"
    :randomness="5"
  />
  <TresGroup v-if="discoMode">
    <!-- DiscoBallv2 -->
    <Stars />
  </TresGroup>
  <primitive :position="discoBallPosition" :object="discoBall" />
</template>
