<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { boxSize, setBoxSize } from "@/lib/constants";
import { ChevronLeftIcon, ChevronRightIcon, CircleHelp } from "lucide-vue-next";
import { ref } from "vue";

const boxSizeRef = ref(boxSize);
const open = ref(true);
</script>

<template>
  <div
    :class="`absolute top-2 left-2 rounded-md border bg-background z-50 w-80 shadow-md transition-transform duration-1000 ease-in-out p-2 ${
      open ? 'block' : 'hidden'
    }`"
  >
    <div class="relative px-2 py-1 flex items-center justify-between">
      <div class="text-foreground tracking-wider font-heading text-2xl">
        Plottr
      </div>
      <!-- Help Trigger -->

      <Dialog>
        <DialogTrigger class="absolute right-14">
          <CircleHelp class="cursor-pointer right-14 text-foreground" />
        </DialogTrigger>
        <DialogContent class="dark text-foreground bg-background">
          <DialogHeader>
            <DialogTitle
              class="text-foreground tracking-wider font-heading text-2xl"
            >
              About Plottr
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Plottr is a simple 3D function plotter. You can add functions to the
            plot by typing them in the input field and pressing enter.
          </DialogDescription>
          <DialogDescription class="flex items-center gap-2">
            <div class="">
              You can also change the size of the bounding box by typing a
              number in the input field below.
            </div>
            <Input
              v-model="boxSizeRef"
              :autofocus="false"
              class="text-foreground text-center w-12"
              @keyup.enter="() => setBoxSize(boxSizeRef)"
              placeholder="10"
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Button @click="() => (open = false)" variant="outline" :size="'icon'">
        <ChevronLeftIcon class="text-foreground" />
      </Button>
    </div>
    <!-- Main slot -->
    <slot />
  </div>
  <div
    v-show="!open"
    class="absolute transition-all duration-300 ease-in-out z-50 left-2 top-2 shadow-md"
  >
    <Button
      class="hover:ring-1 ring-foreground/10"
      @click="() => (open = true)"
      variant="outline"
      :size="'icon'"
    >
      <ChevronRightIcon class="text-foreground" />
    </Button>
  </div>
</template>
