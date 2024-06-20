<script setup lang="ts">
import { boxSize } from "@/lib/constants";
import { Text3D } from "@tresjs/cientos";
import { Vector3 } from "three";
import AxesCones from "./AxesCones.vue";
</script>

<template>
  <Suspense>
    <Text3D
      font="/FiraCodeRegular.json"
      :position="new Vector3(boxSize / 2 + boxSize / 20, 0, 0)"
      :size="boxSize / 20"
      :height="0.05"
      text="x"
    />
  </Suspense>
  <Suspense>
    <Text3D
      font="/FiraCodeRegular.json"
      :position="new Vector3(0, boxSize / 2 + boxSize / 20, 0)"
      :size="boxSize / 20"
      :height="0.05"
      text="y"
    />
  </Suspense>
  <Suspense>
    <Text3D
      font="/FiraCodeRegular.json"
      :position="new Vector3(0, 0, boxSize / 2 + boxSize / 20)"
      :size="boxSize / 20"
      :height="0.05"
      text="z"
    />
  </Suspense>
  <AxesCones />
</template>
