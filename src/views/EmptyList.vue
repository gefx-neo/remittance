<template>
  <div class="empty-section">
    <div class="item">
      <p>No records found.</p>
    </div>
  </div>
</template>

<style scoped>
.empty-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  height: calc(100% - 49.86px);
}

.empty-section .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--size-12);
}

.empty-section p {
  color: var(--black);
  font-weight: var(--semi-bold);
}
</style>
