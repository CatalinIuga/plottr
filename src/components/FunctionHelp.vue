<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-vue-next";
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <InfoIcon class="size-4 cursor-pointer text-foreground" />
    </DialogTrigger>
    <DialogContent class="dark text-foreground bg-background">
      <DialogHeader>
        <DialogTitle
          class="text-foreground tracking-wider font-heading text-2xl"
        >
          Functions Help
        </DialogTitle>
      </DialogHeader>
      <DialogDescription class="text-foreground">
        Plottr currently supports 2D and 3D functions. You can add a function in
        the following formats:
        <div class="text-secondary-foreground/80">
          <div class="">- 2D: y = 2 * sin(x) + 3 * cos(x)</div>
          <div class="">- 3D: z = 4 * exp(-1/4 * y^2) * sin(2 * x)</div>
          <div class="">
            - 3D: 2 * sin(y) + 3 * cos(z)
            <span class="text-muted-foreground/60 text-xs">
              # x is auto assigned
            </span>
          </div>
        </div>
      </DialogDescription>
      <DialogDescription class="text-foreground">
        After a successful addition, the function will be plotted on the canvas
        and you will be able to see it in the "Ploted functions" section.
      </DialogDescription>
      <DialogDescription class="text-foreground">
        If you want to change the color of the function, you can do so by
        clicking on the color picker next to the function name.
      </DialogDescription>
      <DialogDescription class="text-foreground">
        If you want to remove a function, you can do so by clicking on the trash
        icon next to the function name.
      </DialogDescription>
      <DialogDescription class="text-foreground">
        If the function you chose is 2D (like u = f(v)) and you want to force it
        to be plotted in 3D, you can do so by clicking on the 3D/2D button next
        to the function name.
      </DialogDescription>
      <DialogDescription class="text-foreground">
        You can remove functions from the plot by clicking on the X icon next to
        the function.
      </DialogDescription>
    </DialogContent>
  </Dialog>
</template>
