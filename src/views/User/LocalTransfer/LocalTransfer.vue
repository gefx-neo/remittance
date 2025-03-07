<template>
  <div class="content-area">
    <div class="coming-soon">
      <h1>Coming soon</h1>
      <p>We are working to bring you something awesome.</p>
    </div>
  </div>
</template>

<style scoped>
.content-area {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: calc(100vh - 140.79px);
}

.coming-soon {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-12);
  text-align: center;
  white-space: nowrap;
}

.coming-soon h1 {
  font-family: "Rubik Dirt", serif;
  color: var(--black);
  font-size: var(--size-48);
  font-weight: 400;
}

.coming-soon p {
  font-family: "Archivo Black", serif;
  color: var(--grey);
  font-weight: var(--semi-bold);
}

@media (max-width: 1023px) {
  .coming-soon {
    gap: var(--size-8);
  }

  .coming-soon h1 {
    font-size: var(--size-40);
  }

  .coming-soon p {
    white-space: normal;
  }
}
</style>
