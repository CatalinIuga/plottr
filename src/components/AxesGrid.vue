<script setup lang="ts">
import { boxSize } from "@/lib/constants";
import { Line2 } from "@tresjs/cientos";
import { Vector3 } from "three";
import { ref } from "vue";
import AxesLabels from "./AxesLabels.vue";

const points = ref([new Vector3(0, 0, 0), new Vector3(0, boxSize / 2, 0)]);
const width = ref(0.001);
</script>

<template>
  <TresGridHelper :args="[boxSize, boxSize, 0xf2f2f2f2]" />
  <Line2 :points="points" :line-width="width" :color="0xf2f2f2" />
  <AxesLabels />
</template>
