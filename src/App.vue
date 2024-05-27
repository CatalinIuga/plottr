<script setup lang="ts">
import { OrbitControls } from "@tresjs/cientos";
import { TresCanvas } from "@tresjs/core";
import { evaluate } from "mathjs";
import {
  AxesHelper,
  BasicShadowMap,
  BufferGeometry,
  Color,
  GridHelper,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  NoToneMapping,
  SRGBColorSpace,
  SphereGeometry,
  Vector3,
} from "three";
import { ref, watch } from "vue";

const gl = {
  clearColor: "#f2f2f2",
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
};

const ecuations = ref<Array<string>>(["x^2"]);
const ecuation = ref("");

const addEcuation = () => {
  ecuations.value.push(ecuation.value);
  ecuation.value = "";
};

const graphData = ref<Array<{ points: Vector3[]; color: Color }>>([]);

watch(
  () => ecuations.value,
  (newEcuations) => {
    const newGraphData = newEcuations.map((eq, index) => {
      const points: Vector3[] = [];
      for (let x = -10; x <= 10; x += 0.1) {
        try {
          const y = evaluate(eq, { x });
          points.push(new Vector3(x, y, 0));
        } catch (error) {
          console.error(`Invalid equation: ${eq}`, error);
        }
      }
      return { points, color: new Color(`hsl(${index * 60}, 100%, 50%)`) }; // Different color for each equation
    });
    graphData.value = newGraphData;
  },
  {
    deep: true,
    immediate: true,
  }
);

const createLine = (points: Vector3[], color: Color) => {
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color, linewidth: 2 });
  return new Line(geometry, material);
};

const axesHelper = new AxesHelper(10);
const gidHelper = new GridHelper(20, 20);

const createSphere = () => {
  const geometry = new SphereGeometry(0.1, 32, 32);
  const material = new MeshBasicMaterial({ color: new Color("red") });
  // position the sphere at (0, 0, 0)
  geometry.translate(1, 1, 0);
  return new Mesh(geometry, material);
};

const coords = ref({ x: 0, y: 0, z: 0 });
</script>

<template>
  <div class="min-h-screen w-screen flex">
    <div class="w-60 p-4">
      <input
        v-model="ecuation"
        @keyup.enter="addEcuation"
        class="w-full p-2 mb-4 border border-gray-300"
        placeholder="Add equation"
      />
      <ul class="px-2 list-disc space-y-2">
        <li v-for="(e, index) in ecuations" :key="index">
          {{ e }}
          <button @click="ecuations.splice(index, 1)" class="ml-2 text-red-500">
            ❌
          </button>
        </li>
      </ul>
      <div class="">
        Coordinates:
        <div class="text-pretty">
          {{ JSON.stringify(coords, null, 4) }}
        </div>
      </div>
    </div>
    <div class="flex-1">
      <TresCanvas class="h-full" v-bind="gl">
        <TresPerspectiveCamera :position="new Vector3(5, 5, 5)" />
        <OrbitControls />
        <primitive
          v-for="(graph, index) in graphData"
          :key="index"
          :object="createLine(graph.points, graph.color)"
          @click="(intersection:any) => console.log(intersection.point)"
          @pointer-move="(intersection:any) => (coords = intersection.point)"
        />
        <primitive :object="createSphere()" />
        <primitive :object="axesHelper" />
        <primitive :object="gidHelper" />
      </TresCanvas>
    </div>
  </div>
</template>
