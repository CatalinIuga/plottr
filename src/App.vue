<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-vue-next";

import { OrbitControls } from "@tresjs/cientos";
import { TresCanvas, TresContext } from "@tresjs/core";
import {
  BasicShadowMap,
  BoxGeometry,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  NoToneMapping,
  Plane,
  SRGBColorSpace,
  Vector3,
} from "three";

import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { ShallowRef, ref, shallowRef, watch } from "vue";
import { createGraphData, preprocessInput } from "./lib/utils";
import { Equation } from "./types/equations";

const open = ref(true);
const functions = ref<Array<Equation>>([]);
const func = ref<string>("");

const gl = {
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
};

// will clip the graphs in a box 100x100x100
const clipPlanes = [
  new Plane(new Vector3(1, 0, 0), 5),
  new Plane(new Vector3(-1, 0, 0), 5),
  new Plane(new Vector3(0, 1, 0), 5),
  new Plane(new Vector3(0, -1, 0), 5),
  new Plane(new Vector3(0, 0, 1), 5),
  new Plane(new Vector3(0, 0, -1), 5),
];

// Enable clipping
const ctxRef: ShallowRef<{ context: TresContext } | undefined> = shallowRef();
watch(ctxRef, (ctx) => {
  if (!ctx) return;
  const { renderer } = ctx.context;
  renderer.value.localClippingEnabled = true;
});

// plotting things
interface GraphData {
  points: Vector3[];
  color: Color;
}

const graphData = ref<Array<GraphData>>([]);

watch(
  () => functions.value,
  (newFunctions) => {
    const newGraphData = newFunctions.map(createGraphData);
    graphData.value = newGraphData;
  },
  { deep: true, immediate: true }
);

const createThickLine = (points: Vector3[], color: Color) => {
  const geometry = new LineGeometry().setPositions(
    points.map((point) => [point.x, point.y, point.z]).flat()
  );
  const material = new LineMaterial({
    color,
    linewidth: 0.005,
    clippingPlanes: clipPlanes,
    clipIntersection: false,
  });

  return new Line2(geometry, material);
};

const createBoundingBox = () => {
  const geometry = new BoxGeometry(10, 10, 10);
  const edgesGeometry = new EdgesGeometry(geometry);
  const material = new LineBasicMaterial({ color: 0x808080 });
  const edges = new LineSegments(edgesGeometry, material);
  return edges;
};
</script>

<template>
  <div class="dark min-h-screen relative w-screen flex">
    <div
      :class="`absolute top-2 left-2 rounded-md border bg-background z-50 w-60 shadow-md transition-transform duration-1000 ease-in-out p-2 ${
        open ? 'block' : 'hidden'
      }`"
    >
      <div class="px-2 py-1 flex items-center justify-between">
        <div class="text-foreground font-extrabold text-2xl">Plottr</div>
        <Button @click="() => (open = false)" variant="outline" :size="'icon'">
          <ChevronLeftIcon class="text-foreground" />
        </Button>
      </div>
      <div class="p-2 flex items-center gap-2">
        <Input
          v-model="func"
          class="text-foreground"
          @keyup.enter="
            () => {
              try {
                functions.push(preprocessInput(func));
                func = '';
              } catch (e) {
                console.error('Invalid function: ', func);
              }
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
        <div
          class="text-foreground font-semibold text-sm truncate"
          :title="functions[index].text"
        >
          {{ functions[index].text }}
        </div>
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
        <ChevronRightIcon class="text-foreground" />
      </Button>
    </div>
    <TresCanvas ref="ctxRef" v-bind="gl" :clear-color="'#252525'" window-size>
      <TresPerspectiveCamera :position="new Vector3(10, 8, 12)" />
      <OrbitControls />
      <primitive
        v-for="(graph, index) in graphData"
        :key="index"
        :object="createThickLine(graph.points, graph.color)"
      />
      <primitive :object="createBoundingBox()" />
      <TresGridHelper :args="[10, 10, 0xf2f2f2f2]" />
      <!-- <TresAxesHelper :args="[5]" /> -->
    </TresCanvas>
  </div>
</template>
