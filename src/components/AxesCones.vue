<script setup lang="ts">
import { boxSize } from "@/lib/constants";
import { ConeGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";

// cones for axes
const coneX = new ConeGeometry(boxSize / 100, boxSize / 20, 32);
const coneY = new ConeGeometry(boxSize / 100, boxSize / 20, 32);
const coneZ = new ConeGeometry(boxSize / 100, boxSize / 20, 32);

const coneMaterialX = new MeshStandardMaterial({ color: 0xf2f2f2f2 });
const coneMaterialY = new MeshStandardMaterial({ color: 0xf2f2f2f2 });
const coneMaterialZ = new MeshStandardMaterial({ color: 0xf2f2f2f2 });

const coneMeshX = new Mesh(coneX, coneMaterialX);
const coneMeshY = new Mesh(coneY, coneMaterialY);
const coneMeshZ = new Mesh(coneZ, coneMaterialZ);

const coneXPos = new Vector3(boxSize / 2 - boxSize / 40, 0, 0);
const coneYPos = new Vector3(0, boxSize / 2 - boxSize / 40, 0);
const coneZPos = new Vector3(0, 0, boxSize / 2 - boxSize / 40);

coneMeshX.position.copy(coneXPos);
coneMeshY.position.copy(coneYPos);
coneMeshZ.position.copy(coneZPos);

// cones direction
coneMeshX.rotation.z = -Math.PI / 2;
coneMeshZ.rotation.x = Math.PI / 2;

const coneMeshes = [coneMeshX, coneMeshY, coneMeshZ];
</script>

<template>
  <primitive v-for="cone in coneMeshes" :key="cone.uuid" :object="cone" />
</template>
