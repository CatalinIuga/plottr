<script setup lang="ts">
import { createGraphData } from "@/lib/math";
import { Equation } from "@/types/equations";
import gsap from "gsap";
import { computed, ref, shallowRef, toRefs, watch } from "vue";

const props = defineProps<{
  discoMode: boolean;
  data: Array<Equation>;
}>();

const refs = toRefs(props);
const { data } = props;

const plotedFunctionsRef = shallowRef();
const recomputeTrigger = ref(0);

const functionsPloted = computed(() => {
  recomputeTrigger.value;
  try {
    return data.map((pdata) => createGraphData(pdata));
  } catch (e) {
    console.error(e);
    return [];
  }
});

watch(refs.discoMode, (newVal) => {
  if (newVal) {
    const animate = () => {
      plotedFunctionsRef.value.children.forEach((f: any) => {
        const randomPosition = {
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
          z: Math.random() * 10 - 5,
        };
        gsap.to(f.position, {
          duration: 1,
          ...randomPosition,
          ease: "sine.inOut",
        });

        const randomRotation = {
          x: Math.random() * Math.PI * 2,
          y: Math.random() * Math.PI * 2,
          z: Math.random() * Math.PI * 2,
        };
        gsap.to(f.rotation, {
          duration: 1,
          ...randomRotation,
          ease: "sine.inOut",
        });

        const randomScale = Math.random() * 2;
        gsap.to(f.scale, {
          duration: 1,
          x: randomScale,
          y: randomScale,
          z: randomScale,
          ease: "sine.inOut",
        });
      });
      gsap.delayedCall(1, animate);
    };

    animate();
  } else {
    gsap.globalTimeline.clear();
    recomputeTrigger.value++;
  }
});
</script>

<template>
  <TresGroup ref="plotedFunctionsRef">
    <primitive v-for="f in functionsPloted" :key="f.uuid" :object="f.clone()" />
  </TresGroup>
</template>
