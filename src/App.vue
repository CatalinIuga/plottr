<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-vue-next";

import { OrbitControls } from "@tresjs/cientos";
import { TresCanvas } from "@tresjs/core";
import { evaluate } from "mathjs";
import {
  BasicShadowMap,
  BufferGeometry,
  Color,
  Line,
  LineBasicMaterial,
  NoToneMapping,
  Plane,
  SRGBColorSpace,
  Vector3,
} from "three";
import { ref, shallowRef, watch } from "vue";

const open = ref(true);
const functions = ref<Array<string>>([]);
const func = ref<string>("");

const gl = {
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
};

// plotting things
interface GraphData {
  points: Vector3[];
  color: Color;
}

const graphData = ref<Array<GraphData>>([]);

const createGraphData = (fn: string) => {
  const points: Array<Vector3> = [];
  for (let x = -100; x < 100; x += 0.1) {
    try {
      const y = evaluate(fn, { x });
      points.push(new Vector3(x, y, 0));
    } catch (e) {
      console.error(`Error in function ${fn}: ${e}`);
    }
  }
  return { points, color: new Color(Math.random() * 0xffffff) };
};

const createLine = (points: Vector3[], color: Color) => {
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({
    color,
    linewidth: 10,
    clippingPlanes: clipPlanes,
    clipIntersection: false,
  });
  console.log(material);

  return new Line(geometry, material);
};

watch(
  () => functions.value,
  (newFunctions) => {
    const newGraphData = newFunctions.map(createGraphData);
    graphData.value = newGraphData;
  },
  { deep: true, immediate: true }
);

// will clip the graphs in a box 100x100x100
const clipPlanes = [
  new Plane(new Vector3(1, 0, 0), 50),
  new Plane(new Vector3(-1, 0, 0), 50),
  new Plane(new Vector3(0, 1, 0), 50),
  new Plane(new Vector3(0, -1, 0), 50),
  new Plane(new Vector3(0, 0, 1), 50),
  new Plane(new Vector3(0, 0, -1), 50),
];

const ctxRef = shallowRef();

watch(ctxRef, (ctx) => {
  const { renderer } = ctx.context;
  renderer.value.localClippingEnabled = true;
});
</script>

<template>
  <div class="min-h-screen relative w-screen flex">
    <div
      :class="`absolute bg-background z-50 w-60 shadow-md transition-all duration-300 ease-in-out p-2 ${
        open ? 'block' : 'hidden'
      }`"
    >
      <div class="px-2 py-1 flex items-center justify-between">
        <div class="text-fuchsia-500 font-extrabold text-2xl">Plottr</div>
        <Button @click="() => (open = false)" variant="outline" :size="'icon'">
          <ChevronLeftIcon />
        </Button>
      </div>
      <div class="p-2 flex items-center gap-2">
        <Input
          v-model="func"
          @keyup.enter="
            () => {
              functions.push(func);
              func = '';
            }
          "
          placeholder="Enter a function"
        />
      </div>
      <div
        v-for="(_, index) in functions"
        :key="index"
        class="flex items-center justify-between px-2 py-1"
      >
        <div>{{ functions[index] }}</div>
        <Button
          class="size-4 rounded-full text-red-500"
          @click="() => functions.splice(index, 1)"
          variant="outline"
          :size="'icon'"
        >
          <XIcon />
        </Button>
      </div>
    </div>
    <div
      v-show="!open"
      class="absolute transition-all duration-300 ease-in-out z-50 left-2 top-2 shadow-md"
    >
      <Button @click="() => (open = true)" variant="outline" :size="'icon'">
        <ChevronRightIcon />
      </Button>
    </div>
    <TresCanvas ref="ctxRef" v-bind="gl" :clear-color="'#f2f2f2'" window-size>
      <TresPerspectiveCamera :position="new Vector3(50, 50, 50)" />
      <OrbitControls />
      <primitive
        v-for="(graph, index) in graphData"
        :key="index"
        :object="createLine(graph.points, graph.color)"
      />
      <!-- <TresPlaneHelper :args="[clipPlanes[0], 100, 0xff0000]" />
      <TresPlaneHelper :args="[clipPlanes[1], 100, 0x00ff00]" />
      <TresPlaneHelper :args="[clipPlanes[2], 100, 0x0000ff]" />
      <TresPlaneHelper :args="[clipPlanes[3], 100, 0xff00ff]" />
      <TresPlaneHelper :args="[clipPlanes[4], 100, 0xffff00]" />
      <TresPlaneHelper :args="[clipPlanes[5], 100, 0x00ffff]" /> -->
      <TresGridHelper :args="[100, 100]" />
    </TresCanvas>
  </div>
</template>
