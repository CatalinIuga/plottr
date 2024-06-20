<script setup lang="ts">
import { boxSize } from "@/lib/constants";
import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";

const createBoundingBox = () => {
  const geometry = new BoxGeometry(boxSize, boxSize, boxSize);
  const edgesGeometry = new EdgesGeometry(geometry);
  const material = new LineBasicMaterial({ color: 0x808080 });
  const edges = new LineSegments(edgesGeometry, material);
  return edges;
};
</script>

<template>
  <primitive :object="createBoundingBox()" />
</template>
