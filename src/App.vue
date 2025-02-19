<!-- Routerview here renders Layout.vue and Layout.vue renders the children route pages -->
<template>
  <RouterView />
  <Alert />
  <ModalTokenExpiration />
</template>

<script setup>
import { RouterView } from "vue-router";
import Alert from "@/components/Alert.vue";
import ModalTokenExpiration from "@/components/Modal/ModalTokenExpiration.vue";
</script>
