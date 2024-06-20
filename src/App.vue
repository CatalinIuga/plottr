<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrbitControls, Precipitation } from "@tresjs/cientos";
import { BananaIcon, DownloadIcon, XIcon } from "lucide-vue-next";
import GridAndAxes from "./components/AxesGrid.vue";
import BoundingBox from "./components/BoundingBox.vue";
import CamerasAndLights from "./components/CamerasAndLights.vue";
import ContextEnable from "./components/ContextEnable.vue";
import FunctionHelp from "./components/FunctionHelp.vue";
import Menu from "./components/Menu.vue";
import PlotFunctions from "./components/PlotFunctions.vue";

import { options } from "@/lib/constants";
import { TresCanvas } from "@tresjs/core";

import { boxSize } from "@/lib/constants";
import { SRGBColorSpace, TextureLoader } from "three";
import { ref, shallowRef } from "vue";
import { preprocessInput } from "./lib/math";
import { Equation } from "./types/equations";

// z = 4 * exp(-1/4 * y^2) * sin(2 * x) - nice :)

interface ColorInputEvent extends InputEvent {
  target: HTMLInputElement;
}

function changeColor(f: Equation, event: ColorInputEvent) {
  f.color.set(event.target.value);
}

const context = shallowRef();

function downloadCanvas() {
  if (context.value) {
    context.value.download();
  }
}

const functionPlotData = ref<Array<Equation>>([]);

const goBananas = ref(false);

const bananaTexture = new TextureLoader().load("/banana.png", (texture) => {
  texture.colorSpace = SRGBColorSpace;
});
</script>

<template>
  <div class="dark min-h-screen relative w-screen flex">
    <Menu>
      <div class="relative p-2 flex flex-col items-start gap-2">
        <div class="flex w-full justify-center flex-col gap-2 mb-2">
          <Button
            @click="() => (goBananas = !goBananas)"
            class="p-2 mt-2 rounded-sm font-heading flex items-center justify-center gap-2"
            :class="
              !goBananas
                ? 'bg-yellow-200/80 text-yellow-900 hover:bg-yellow-200/70'
                : 'bg-red-500 text-yellow-100 hover:bg-red-500/80'
            "
            variant="outline"
          >
            {{ goBananas ? "Stop the bananas" : "Go bananas" }}
            <BananaIcon class="size-5 stroke-[3px]" />
          </Button>
          <Button
            @click="downloadCanvas"
            class="p-2 mt-2 rounded-sm font-heading flex items-center justify-center gap-2"
            variant="default"
          >
            Download
            <DownloadIcon class="size-5" />
          </Button>
        </div>
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
      <!-- Plotted functions data -->
      <div class="p-2 flex flex-col gap-2">
        <div class="text-foreground font-bold">Plotted functions</div>
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
      <ContextEnable ref="context">
        <CamerasAndLights />
        <GridAndAxes />
        <OrbitControls />
        <BoundingBox />
        <PlotFunctions :goBananas="goBananas" :data="functionPlotData" />
        <!-- @vue-expect-error Make it rain! -->
        <Precipitation
          :map="bananaTexture"
          :size="boxSize / 10"
          :area="[boxSize, boxSize, boxSize]"
          :count="goBananas ? 1000 : 0"
        />
      </ContextEnable>
    </TresCanvas>
  </div>
</template>
