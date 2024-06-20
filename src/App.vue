<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-vue-next";
import GridAndAxes from "./components/AxesGrid.vue";
import BoundingBox from "./components/BoundingBox.vue";
import CamerasAndLights from "./components/CamerasAndLights.vue";
import ContextEnable from "./components/ContextEnable.vue";
import FunctionHelp from "./components/FunctionHelp.vue";
import Menu from "./components/Menu.vue";
import PlotFunctions from "./components/PlotFunctions.vue";

import { options } from "@/lib/constants";
import { OrbitControls } from "@tresjs/cientos";
import { TresCanvas } from "@tresjs/core";

import { ref } from "vue";
import { preprocessInput } from "./lib/math";
import { Equation } from "./types/ecuations";

// z = 4 * exp(-1/4 * y^2) * sin(2 * x) - nice :)

interface ColorInputEvent extends InputEvent {
  target: HTMLInputElement;
}

function changeColor(f: Equation, event: ColorInputEvent) {
  f.color.set(event.target.value);
}

const functionPlotData = ref<Array<Equation>>([]);
</script>

<template>
  <div class="dark min-h-screen relative w-screen flex">
    <Menu>
      <div class="relative p-2 flex flex-col items-start gap-2">
        <Label class="text-foreground text-base px-1 flex items-center gap-2">
          Add a function
          <FunctionHelp />
        </Label>
        <Input
          class="text-foreground text-base h-10"
          @keyup.enter="
            (e:InputEvent) => {
              try {
                const s = preprocessInput((e.target as HTMLInputElement).value);
                functionPlotData.push(s);
              } catch (e) {
                console.error(e);
              }
            }
          "
          placeholder="x = 2 * sin(y) + 3 * cos(z)"
        />
      </div>
      <!-- Ploted functions data -->
      <div class="p-2 flex flex-col gap-2">
        <div class="text-foreground font-bold">Ploted functions</div>
        <div class="flex flex-col">
          <div v-if="functionPlotData.length === 0" class="">
            <div class="text-muted-foreground text-sm text-center">
              No functions plotted
            </div>
          </div>
          <div
            v-for="(f, i) in functionPlotData"
            :key="i"
            class="flex p-1 first:rounded-t border-border border-x border-t last:border-b last:rounded-b items-center justify-between w-full"
          >
            <input
              type="color"
              class="bg-transparent border-none size-8 block cursor-pointer"
              :value="'#' + f.color.getHexString()"
              @input="changeColor(f, $event as ColorInputEvent)"
              title="Choose your color"
            />
            <div
              class="flex-1 cursor-not-allowed text-foreground break-words text-pretty max-w-[50%]"
            >
              {{ f.text }}
            </div>
            <!-- button to force 3d for functions that have 1 independent variable -->
            <Button
              v-if="f.independentVariables.length < 2"
              @click="
                () => {
                  functionPlotData[i].is3D = !functionPlotData[i].is3D;
                }
              "
              variant="outline"
              :size="'icon'"
            >
              <div
                :class="{
                  'text-foreground': functionPlotData[i].is3D,
                  'text-muted-foreground': !functionPlotData[i].is3D,
                }"
              >
                {{ functionPlotData[i].is3D ? "3D" : "2D" }}
              </div>
            </Button>
            <!-- button to remove the function -->

            <XIcon
              @click="
                () => {
                  functionPlotData.splice(i, 1);
                }
              "
              class="text-foreground size-6 cursor-pointer hover:text-foreground/60 transition-colors"
            />
          </div>
        </div>
      </div>
    </Menu>

    <TresCanvas v-bind="options" window-size>
      <ContextEnable>
        <CamerasAndLights />
        <GridAndAxes />
        <OrbitControls />
        <BoundingBox />
        <PlotFunctions :data="functionPlotData" />
      </ContextEnable>
    </TresCanvas>
  </div>
</template>
