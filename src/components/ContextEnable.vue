<script setup lang="ts">
import { useTresContext } from "@tresjs/core";

const { renderer } = useTresContext();

// anti-aliasing
renderer.value.localClippingEnabled = true;
renderer.value.shadowMap.autoUpdate = true;
renderer.value.shadowMap.enabled = true;
</script>

<template>
  <slot />
</template>
