<template>
  <div class="banner" v-if="isOpen">
    <marquee behavior="left">
      There will be scheduled maintenance on March 25 at 2:00 PM (UTC+8). Sorry
      for any inconvenience caused.</marquee
    >

    <button type="button" @click="isOpen = false">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(true);
</script>

<style scoped>
.banner {
  background-image: linear-gradient(
    to right,
    var(--sky-blue),
    var(--cool-blue)
  );
  padding: var(--size-16) var(--size-16);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  width: 100%;
  margin-left: -24px;
}

.banner marquee {
  font-weight: var(--semi-bold);
  color: var(--black);
}

.banner button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: var(--size-16);
}

.banner button svg {
  color: black;
  width: var(--size-16);
  height: var(--size-16);
}
</style>
