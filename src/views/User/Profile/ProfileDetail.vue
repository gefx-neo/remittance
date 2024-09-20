<template>
  <div class="content-area">
    <div class="profile">
      <div class="user-section">
        <div class="user-group">
          <span class="icon-round">{{ initials }}</span>
          <span
            >{{ profileDetails.givenName }} {{ profileDetails.surname }}</span
          >
        </div>
        <button class="btn-blue">Verify account</button>
      </div>

      <div class="item-section">
        <div class="item">
          <span>Given name</span>
          <span>{{ profileDetails.givenName }}</span>
        </div>
        <div class="item">
          <span>Surname</span>
          <span>{{ profileDetails.surname }}</span>
        </div>
        <div class="item">
          <span>E-mail address</span>
          <span>{{ username }}</span>
        </div>
        <div class="item">
          <span>Account type</span>
          <span>{{ profileDetails.accountType }}</span>
        </div>
        <div
          class="item"
          v-if="profileDetails.accountType === 'Corporate & Trading Comp'"
        >
          <span>Company Name</span>
          <span>{{ profileDetails.companyName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import cookieService from "@/services/cookieService";

const userStore = useUserStore();

const profileDetails = ref({
  givenName: "",
  surname: "",
  accountType: "",
  email: "",
  phoneNumber: "",
});

const username = ref("");

const initials = computed(() => {
  const firstInitial = profileDetails.value.givenName.charAt(0) || "";
  const lastInitial = profileDetails.value.surname.charAt(0) || "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
});

// Fetch profile details when the component is mounted
onMounted(async () => {
  await userStore.getProfileDetail();
  profileDetails.value = userStore.profileDetails;
  username.value = cookieService.getCookie("username");
});
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
