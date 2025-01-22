<template>
  <div class="loading">
    <div class="item">
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  height: calc(100% - 49.86px);
}

.loading .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--size-12);
}

.loading p {
  color: var(--black);
  font-weight: var(--semi-bold);
}
</style>
