<!-- Routerview here renders Layout.vue and Layout.vue renders the children route pages -->
<template>
  <RouterView />
  <Alert />
</template>

<script setup>
import { RouterView } from "vue-router";
import Alert from "@/components/Alert.vue"; // Import the alert component globally
</script>
