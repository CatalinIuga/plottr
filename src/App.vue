<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrbitControls } from "@tresjs/cientos";
import { DownloadIcon, PartyPopperIcon, XIcon } from "lucide-vue-next";
import GridAndAxes from "./components/AxesGrid.vue";
import BoundingBox from "./components/BoundingBox.vue";
import CamerasAndLights from "./components/CamerasAndLights.vue";
import ContextEnable from "./components/ContextEnable.vue";
import DiscoRain from "./components/DiscoRain.vue";
import FunctionHelp from "./components/FunctionHelp.vue";
import Menu from "./components/Menu.vue";
import PlotFunctions from "./components/PlotFunctions.vue";

import { options } from "@/lib/constants";
import { TresCanvas } from "@tresjs/core";

import { ref, shallowRef } from "vue";
import { preprocessInput } from "./lib/math";
import { Equation } from "./types/equations";

// z = 4 * exp(-1/4 * y^2) * sin(2 * x) - nice :)

interface ColorInputEvent extends InputEvent {
  target: HTMLInputElement;
}

/**
 * Schimbarea culorii reprezentării unei funcții
 */
function changeColor(f: Equation, event: ColorInputEvent) {
  f.color.set(event.target.value);
}

const context = shallowRef();

/**
 * Descarcă canvas-ul ca imagine
 */
function downloadCanvas() {
  if (context.value) {
    context.value.download();
  }
}

const functionPlotData = ref<Array<Equation>>([]); // datele funcțiilor reprezentate
const error = ref<string | null>(null);

/**
 * Modul disco; easter egg pentru a demonstra posibilitățile de animație ale Tres.js
 */
const discoMode = ref(false);
</script>

<template>
  <!-- Fundalul aplicatiei -->
  <div class="dark min-h-screen relative w-screen flex">
    <!-- Meniul principal al aplicatiei -->
    <Menu>
      <!-- Input-urile pentru utilizator -->
      <div class="relative p-2 flex flex-col items-start gap-2">
        <div class="flex w-full justify-center flex-col gap-2 mb-2">
          <!-- Button toggle pentru modul disco -->
          <Button
            @click="() => (discoMode = !discoMode)"
            class="p-2 mt-2 rounded-sm font-heading flex items-center justify-center gap-2"
            variant="secondary"
            :class="
              discoMode
                ? 'bg-green-500 hover:bg-green-500/80'
                : 'bg-red-500 hover:bg-red-500/80'
            "
          >
            Disco mode {{ discoMode ? "on" : "off" }}
            <PartyPopperIcon class="size-4 stroke-[3px]" />
          </Button>
          <!-- Button pentru a descărca canvas-ul -->
          <Button
            @click="downloadCanvas"
            class="p-2 mt-2 rounded-sm font-heading flex items-center justify-center gap-2"
            variant="default"
          >
            Download
            <DownloadIcon class="size-5" />
          </Button>
        </div>
        <!-- Zona de adăugare a unei funcții -->
        <Label class="text-foreground text-base px-1 flex items-center gap-2">
          Add a function
          <FunctionHelp />
        </Label>
        <Input
          class="text-foreground text-base h-10"
          @keyup.enter="
            (e:InputEvent) => {
              error = null;
              try {
                const s = preprocessInput((e.target as HTMLInputElement).value);
                functionPlotData.push(s);
              } catch (e: any) {
                console.error(e);
                error = e.message;
              }
            }
          "
          placeholder="x = 2 * sin(y) + 3 * cos(z)"
        />
        <div v-if="error" class="text-red-500 text-sm text-center w-full">
          {{ error }}
        </div>
      </div>
      <!-- Lista funcțiilor reprezentate -->
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
            <!-- Selectarea culorii funcției -->
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
            <!-- Buton pentru a schimba între reprezentarea 2D și 3D -->
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
            <!-- Buton pentru a șterge funcția -->
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

    <!-- Canvas-ul principal al aplicației -->
    <TresCanvas v-bind="options" window-size>
      <ContextEnable ref="context">
        <!-- Camerele și luminile din scenă -->
        <CamerasAndLights />
        <!-- Planul de coordonate și axele de coordonate -->
        <GridAndAxes />
        <!-- Controlul camerei -->
        <OrbitControls />
        <!-- Bounding box-ul care delimitează zona de vizualizare -->
        <BoundingBox />
        <!-- Reprezentarea funcțiilor -->
        <PlotFunctions :discoMode="discoMode" :data="functionPlotData" />
        <!-- Efectele pentrul modul disco -->
        <DiscoRain :discoMode="discoMode" />
      </ContextEnable>
    </TresCanvas>
  </div>
</template>
