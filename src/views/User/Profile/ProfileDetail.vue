<template>
  <div class="content-area">
    <div class="profile">
      <div class="user-section">
        <div class="user-group">
          <span class="icon-round">{{ initials }}</span>
          <span
            >{{ profileDetails.givenName }} {{ profileDetails.surname }}</span
          >
          <span>
            <Tooltip
              text="Verified"
              v-if="profileDetails.userStatus === 1"
              class="verified"
            >
              <div>
                <font-awesome-icon :icon="['fas', 'certificate']" />
                <font-awesome-icon :icon="['fas', 'check']" />
              </div>
            </Tooltip>
            <Tooltip
              text="Pending processing"
              v-if="profileDetails.userStatus === 2"
              class="pending"
            >
              <font-awesome-icon :icon="['fas', 'clock']" />
            </Tooltip>
            <Tooltip
              text="In priority processing"
              v-if="isPriorityProcessing"
              class="priority"
            >
              <font-awesome-icon :icon="['fas', 'hourglass-half']" />
            </Tooltip>
            <Tooltip
              text="Rejected"
              v-if="profileDetails.userStatus === 3"
              class="rejected"
            >
              <font-awesome-icon :icon="['fas', 'ban']" />
            </Tooltip>
          </span>
        </div>
        <button
          @click="navigateToAccountVerification"
          v-if="profileDetails.userStatus === 0"
          class="btn-blue"
        >
          Verify account
        </button>

        <ButtonAPI
          v-if="showReminderButton"
          @click="handleReminder"
          class="btn-blue"
          :disabled="isLoading"
        >
          Send reminder
        </ButtonAPI>
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
          v-if="profileDetails.accountType === 'Corporate & Trading Company'"
        >
          <span>Company Name</span>
          <span>{{ profileDetails.companyName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted, reactive } from "vue";
import { useProfileStore } from "@/stores/profileStore";
import { useAlertStore } from "@/stores/alertStore";
import cookieService from "@/services/cookieService";
import { getLocalStorageWithExpiry } from "@/services/localStorageService.js";
import ButtonAPI from "@/components/ButtonAPI.vue";
import Tooltip from "@/components/Tooltip.vue";

const router = useRouter();

const profileStore = useProfileStore();
const alertStore = useAlertStore();

const profileDetails = reactive({
  givenName: "",
  surname: "",
  accountType: "",
  email: "",
  phoneNumber: "",
  companyName: "",
});

const username = ref("");

// Computed property to get initials
const initials = computed(() => {
  const firstInitial = profileDetails.givenName.charAt(0) || "";
  const lastInitial = profileDetails.surname.charAt(0) || "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
});

const handleReminder = async () => {
  try {
    const response = await profileStore.sendReminder(username.value);

    if (response.status === 1) {
      cookieService.setCookie("reminderSent", "true", 365 * 10);

      alertStore.alert("success", "You have submitted successfully.");
      window.location.reload();

      console.log("success", response);
    } else {
      console.log("Failed to remind:", profileStore.error);
    }
  } catch (error) {
    alertStore.alert("error", "Reminder failed");
    console.log("Failed to remind:", profileStore.error);
  }
};

const showReminderButton = computed(() => {
  const reminderCookieExists = !!cookieService.getCookie("reminderSent");
  return profileDetails.userStatus === 2 && !reminderCookieExists;
});

const isPriorityProcessing = computed(() => {
  const reminderCookieExists = cookieService.getCookie("reminderSent");
  return profileDetails.userStatus === 2 && reminderCookieExists;
});

onMounted(async () => {
  await profileStore.getProfileDetail();
  Object.assign(profileDetails, profileStore.profileDetails); // Assign store data to reactive object
  username.value = getLocalStorageWithExpiry("username");
  console.log(profileDetails);
});

const navigateToAccountVerification = () => {
  router.push({ name: "accountverification" });
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
  margin-right: var(--size-12);
}

.profile .user-section .user-group span:nth-child(2) {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
  margin-right: var(--size-8);
}

.profile .user-section .user-group span:nth-child(3) {
  display: flex;
  gap: var(--size-8);
}

.profile .user-section .user-group span:nth-child(3) .tooltip.verified svg {
  color: var(--pastel-green);
  position: relative;
}

.profile
  .user-section
  .user-group
  span:nth-child(3)
  .tooltip.verified
  svg:nth-child(2) {
  color: var(--white);
  min-width: var(--size-8);
  max-width: var(--size-8);
  min-height: var(--size-12);
  max-height: var(--size-12);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.profile .user-section .user-group span:nth-child(3) .tooltip svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  color: var(--black);
  cursor: pointer;
}

.profile .user-section .user-group span:nth-child(3) .tooltip.priority svg {
  color: var(--dark-yellow);
}

.profile .user-section .user-group span:nth-child(3) .tooltip.rejected svg {
  color: var(--dark-crimson-red);
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
