<script setup lang="ts">
import { boxSize } from "@/lib/constants";
import { Sparkles, Stars, useFBO } from "@tresjs/cientos";
import { Color, Vector3 } from "three";
import Rain from "./Rain.vue";

const props = defineProps<{ discoMode: boolean }>();

props;
// TODO: actual colors
const colors: Color[] = Array.from(
  { length: 10 },
  () => new Color(Math.random() * 0xffffff)
);

// DISCO BALL
const fboTarget = useFBO({
  depth: true,
  width: 512,
  height: 512,
  settings: {
    samples: 1,
  },
});

const discoBallPosition = new Vector3(0, boxSize / 2 + 1, 0);
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
    <Sparkles
      :map="'/star.png'"
      :sequence-alpha="[
        [0, 0],
        [0.3, 1.0],
        [0.5, 0.5],
        [0.7, 0.8],
        [1.0, 0.0],
      ]"
      :sequence-color="[
        [0.0, '#ff0000'],
        [0.25, '#ff8c00'],
        [0.5, '#ffff00'],
        [0.75, '#00ff00'],
        [1.0, '#0000ff'],
      ]"
      :sequence-offset="[
        [0.0, [0, -5, 0]],
        [0.5, [0, 10, 0]],
        [1.0, [0, 5, 0]],
      ]"
      :sequence-size="[
        [0.0, 0.5],
        [0.3, 1.5],
        [0.7, 1.0],
        [1.0, 2.0],
      ]"
      :sequence-surface-distance="[
        [0.0, 0.0],
        [0.3, 0.5],
        [0.7, 1.0],
        [1.0, 1.5],
      ]"
      :lifetime-sec="0.5"
      :size="2.5"
      :surface-distance="1.2"
      :mix-color="0.8"
      :noise-scale="5.0"
      :scale-noise="1.5"
      :offset-noise="0.3"
      :lifetime-noise="0.2"
      :blending="2"
      :transparent="true"
      :depth-write="false"
    />
    <TresMesh
      :position="discoBallPosition"
      :rotation="[0, Math.PI / 2, Math.PI / 2]"
    >
      <TresOctahedronGeometry :args="[1, 2]" />
      <TresMeshPhongMaterial
        :color="new Color(0xf2f2f2)"
        :flat-shading="true"
        :transparent="false"
        :map="fboTarget?.texture ?? null"
      />
    </TresMesh>
    <Stars />
  </TresGroup>
</template>
