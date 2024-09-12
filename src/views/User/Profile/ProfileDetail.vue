<template>
  <div class="content-area">
    <!-- <div class="profile">
      <div class="user-section">
        <div class="user-group">
          <span class="icon-round">GT</span>
          <span>Gary Tsai</span>
        </div>
        <button class="btn-blue">Verify account</button>
      </div>

      <div class="item-section">
        <div class="item">
          <span>Full name</span>
          <span>Gary Tsai</span>
        </div>
        <div class="item">
          <span>Account type</span>
          <span>Individual</span>
        </div>
        <div class="item">
          <span>E-mail address</span>
          <span>garytsai@gefx.sg</span>
        </div>
        <div class="item">
          <span>Phone number</span>
          <span>014-6686748</span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
}

.profile {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.profile .user-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--sky-blue);
  border-bottom: 1px solid var(--light-grey);
  border-top-left-radius: var(--border-md);
  border-top-right-radius: var(--border-md);
  padding: var(--size-24);
}

.profile .user-section .user-group {
  display: flex;
  align-items: center;
  gap: var(--size-12);
}

.profile .user-section .user-group .icon-round {
  min-width: var(--size-60);
  max-width: var(--size-60);
  min-height: var(--size-60);
  max-height: var(--size-60);
  font-size: var(--text-xl);
  font-weight: var(--semi-bold);
  background: var(--slate-blue);
  color: var(--sky-blue);
}

.profile .user-section .user-group span {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.profile .user-section button {
  border-radius: var(--border-md);
  padding: var(--size-dropdown-item);
}

.profile {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.profile .item-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: var(--size-24);
  padding: var(--size-24);
  border-bottom: 1px solid var(--light-grey);
}

.profile .item-section .item {
  display: flex;
  flex-direction: column;
}

.profile .item-section .item span:nth-child(2) {
  font-weight: var(--semi-bold);
}

@media (max-width: 768px) {
  .profile .user-section {
    padding: var(--size-16);
  }

  .profile .item-section {
    grid-template-columns: 1fr;
    padding: var(--size-16);
  }
}
</style>
