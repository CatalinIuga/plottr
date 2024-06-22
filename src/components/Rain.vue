<script setup lang="ts">
import { useRenderLoop } from "@tresjs/core";
import { Color, Texture } from "three";
import { shallowRef, toRefs, watchEffect } from "vue";

// Adapted from:
// https://github.com/Tresjs/cientos/blob/9e17559fc98066db79b02b7ea0c98ae3037ac906/src/core/staging/Precipitation.vue

export interface PrecipitationProps {
  size?: number;
  area?: [number, number, number];
  color?: Color;
  map?: null;
  alphaMap?: Texture;
  alphaTest?: number;
  opacity?: number;
  count?: number;
  speed?: number;
  randomness?: number;
  depthWrite?: boolean;
  transparent?: boolean;
  sizeAttenuation?: boolean;
}

const props = withDefaults(defineProps<PrecipitationProps>(), {
  size: 0.1,
  area: () => [10, 10, 20],
  color: () => new Color(0x00ffff),
  alphaTest: 0.01,
  opacity: 0.8,
  count: 5000,
  speed: 0.1,
  randomness: 0.5,
  depthWrite: false,
  transparent: true,
  sizeAttenuation: true,
});

const {
  size,
  area,
  color,
  alphaMap,
  map,
  opacity,
  alphaTest,
  depthWrite,
  transparent,
  sizeAttenuation,
  count,
  speed,
  randomness,
} = toRefs(props);

const geometryRef = shallowRef();
let positionArray: [] | Float32Array = [];
let velocityArray: [] | Float32Array = [];

const setPosition = () => {
  positionArray = new Float32Array(count.value * 3);
  for (let i = 0; i < count.value; i++) {
    const i3 = i * 3;
    positionArray[i3] = (Math.random() - 0.5) * area.value[0];
    positionArray[i3 + 1] = (Math.random() - 0.5) * area.value[1];
    positionArray[i3 + 2] = (Math.random() - 0.5) * area.value[2];
  }
};
const setSpeed = () => {
  velocityArray = new Float32Array(count.value * 2);
  for (let i = 0; i < count.value * 2; i += 2) {
    velocityArray[i] =
      ((Math.random() - 0.5) / 5) * speed.value * randomness.value;
    velocityArray[i + 1] = (Math.random() / 5) * speed.value + 0.01;
  }
};
setSpeed();
setPosition();

watchEffect(() => {
  setSpeed();
  setPosition();
});

const { onLoop } = useRenderLoop();

onLoop(() => {
  if (
    geometryRef.value?.attributes.position.array &&
    geometryRef.value?.attributes.position.count
  ) {
    const positionArray = geometryRef.value.attributes.position.array;
    for (let i = 0; i < geometryRef.value.attributes.position.count; i++) {
      const velocityX = velocityArray[i * 2];
      const velocityY = velocityArray[i * 2 + 1];

      positionArray[i * 3] += velocityX;
      positionArray[i * 3 + 1] -= velocityY;

      if (
        positionArray[i * 3] <= -area.value[0] / 2 ||
        positionArray[i * 3] >= area.value[0] / 2
      ) {
        positionArray[i * 3] = positionArray[i * 3] * -1;
      }
      if (
        positionArray[i * 3 + 1] <= -area.value[1] / 2 ||
        positionArray[i * 3 + 1] >= area.value[1] / 2
      ) {
        positionArray[i * 3 + 1] = positionArray[i * 3 + 1] * -1;
      }
    }
    geometryRef.value.attributes.position.needsUpdate = true;
  }
});
</script>

<template>
  <TresPoints>
    <TresPointsMaterial
      :size="size"
      :color="color"
      :alpha-map="alphaMap"
      :map="map"
      :opacity="opacity"
      :alpha-test="alphaTest"
      :depth-write="depthWrite"
      :transparent="transparent"
      :size-attenuation="sizeAttenuation"
    />
    <TresBufferGeometry
      ref="geometryRef"
      :position="[positionArray, 3]"
      :velocity="[velocityArray]"
    />
  </TresPoints>
</template>
