<script setup lang="ts">
import { useTresContext } from "@tresjs/core";

defineExpose({ download });

const { renderer, scene, camera } = useTresContext();

// anti-aliasing
renderer.value.localClippingEnabled = true;
renderer.value.shadowMap.autoUpdate = true;
renderer.value.shadowMap.enabled = true;

function download() {
  const link = document.createElement("a");
  renderer.value.render(scene.value, camera.value!);
  link.href = renderer.value.domElement.toDataURL();
  link.download = "plottr.png";
  link.click();
}
</script>

<template>
  <slot />
</template>
