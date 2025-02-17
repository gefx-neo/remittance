<template>
  <div class="footer-area">
    <p>Great East Forex © {{ currentYear }} All Rights Reserved</p>
    <!-- <p v-if="tokenCountdown">Token Expires In: {{ tokenCountdown }}</p>
    <p v-else>No Token Found</p> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentYear = ref(null);
const tokenCountdown = ref(null);

let intervalId = null;

onMounted(() => {
  currentYear.value = new Date().getFullYear();
  // startCountdown();
});

// onUnmounted(() => {
//   clearInterval(intervalId); // Clear the interval when the component is unmounted
// });

// function startCountdown() {
//   const expiryTime = getLocalStorageExpiryTime("token");
//   if (!expiryTime) {
//     tokenCountdown.value = null; // No token found
//     return;
//   }

//   intervalId = setInterval(() => {
//     const now = new Date().getTime();
//     const remainingTime = parseInt(expiryTime) - now;

//     if (remainingTime <= 0) {
//       // Token has expired
//       clearInterval(intervalId);
//       tokenCountdown.value = "Expired";
//       return;
//     }

//     // Format the remaining time into days, hours, minutes, and seconds
//     const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(
//       (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//     );
//     const minutes = Math.floor(
//       (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
//     );
//     const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

//     tokenCountdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
//   }, 1000); // Update every second
// }
</script>

<style scoped>
.footer-area {
  display: flex;
  justify-content: end;
  padding: var(--size-12) 0;
}
.footer-area p {
  color: var(--grey);
  font-size: var(--text-xs);
}
@media (max-width: 767px) {
  .footer-area {
    display: none;
  }
}
</style>
