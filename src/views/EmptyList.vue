<template>
  <div class="empty-section">
    <div class="item">
      <font-awesome-icon :icon="['fas', 'folder-open']" />
      <p>There is nothing here yet</p>
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

.empty-section svg {
  min-width: var(--size-48);
  max-width: var(--size-48);
  min-height: var(--size-48);
  max-height: var(--size-48);
  color: var(--cool-blue);
}

.empty-section p {
  color: var(--cool-blue);
  font-weight: var(--semi-bold);
  font-style: italic;
}
</style>
