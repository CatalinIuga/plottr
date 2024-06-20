<script setup lang="ts">
import { createGraphData } from "@/lib/math";
import { Equation } from "@/types/ecuations";
import { computed } from "vue";
const { data } = defineProps<{
  data: Array<Equation>;
}>();
const functionsPloted = computed(() => {
  try {
    return data.map((pdata) => createGraphData(pdata));
  } catch (e) {
    console.error(e);
    return [];
  }
});
</script>

<template>
  <primitive v-for="f in functionsPloted" :key="f.uuid" :object="f.clone()" />
</template>
