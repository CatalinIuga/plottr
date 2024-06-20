<script setup lang="ts">
import { boxSize } from "@/lib/constants";
import { Vector3 } from "three";
</script>

<template>
  <TresPerspectiveCamera
    :position="
      new Vector3(boxSize, boxSize - boxSize / 3, boxSize + boxSize / 3)
    "
  />
  <TresDirectionalLight
    :position="new Vector3(boxSize, boxSize / 2, boxSize / 2)"
    :castShadow="true"
  />
  <TresDirectionalLight
    :position="new Vector3(-boxSize / 2, boxSize / 2, -boxSize / 2)"
    :castShadow="true"
  />
  <TresAmbientLight :intensity="1" />
</template>
