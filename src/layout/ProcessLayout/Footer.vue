<template>
  <div class="footer-area">
    <p>Great East Forex © {{ currentYear }} All Rights Reserved.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const currentYear = ref(null);

onMounted(() => {
  currentYear.value = new Date().getFullYear();
});
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
