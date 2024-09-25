<template>
  <div class="setting">
    <div class="title">
      <h3>Setting</h3>
    </div>
    <div class="item-section">
      <div class="item">
        <div class="label">
          <span>Set new password</span>
          <!-- Trigger Change Password on button click -->
          <ButtonAPI
            :disabled="store.isLoading"
            class="btn-blue standard-button"
            @click="handleChangePassword"
          >
            Change password
          </ButtonAPI>
        </div>
      </div>
      <div class="item">
        <div class="label">
          <span>Change language</span>
          <span>English</span>
        </div>
      </div>
    </div>

    <Modal
      :isModalOpen="isPasswordModalOpen"
      @close="closePasswordModal"
      title="Set new password"
    >
      <template #body>
        <div class="body">
          <div class="form-group">
            <label>Code</label>
            <input
              v-model="form.code"
              type="text"
              placeholder="Enter the code"
            />
            <span v-if="errors.code" class="error">{{ errors.code }}</span>
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input
              v-model="form.newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter new password"
            />
            <span v-if="errors.newPassword" class="error">{{
              errors.newPassword
            }}</span>
          </div>
          <div class="form-group">
            <label>Confirm new password</label>
            <input
              v-model="confirmNewPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Confirm new password"
            />
            <div class="checkbox-group">
              <div class="item" @click="togglePassword">
                <input
                  type="checkbox"
                  id="showPassword"
                  v-model="showPassword"
                />
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                  />
                </svg>
              </div>
              <label for="showPassword">Show password</label>
            </div>
            <div v-if="errors.confirmNewPassword" class="error">
              {{ errors.confirmNewPassword }}
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <ButtonAPI
          :disabled="store.isLoading"
          @click="handleSetNewPassword"
          class="btn-blue standard-button"
        >
          Submit
        </ButtonAPI>
      </template>
    </Modal>

    <Modal
      :isModalOpen="isSuccessModalOpen"
      title="Changed successfully"
      :success="true"
      @close="closeSuccessModal"
    >
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useStore } from "@/stores/useStore";
import { useForgotPasswordStore } from "@/stores/forgotPasswordStore";
import Modal from "@/components/Modal.vue";
import ButtonAPI from "@/components/ButtonAPI.vue";
import { getLocalStorageWithExpiry } from "@/services/localStorageService.js";
import { validationService } from "@/services/validationService.js";

const store = useStore();
const forgotPasswordStore = useForgotPasswordStore();

const confirmNewPassword = ref("");
const showPassword = ref(false);
const isPasswordModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const username = ref("");
const form = reactive({
  code: "",
  username: "",
  newPassword: "",
});
const errors = reactive({});

onMounted(() => {
  username.value = getLocalStorageWithExpiry("username");
  form.username = username.value;
});

const openPasswordModal = () => {
  isPasswordModalOpen.value = true;
};

const closePasswordModal = () => {
  isPasswordModalOpen.value = false;
};

const openSuccessModal = () => {
  isSuccessModalOpen.value = true;
};

const closeSuccessModal = () => {
  isSuccessModalOpen.value = false;
};

const handleChangePassword = async () => {
  try {
    await forgotPasswordStore.changePassword(username.value);
    openPasswordModal();
  } catch (error) {
    console.error("Change password failed:", error);
  }
};

const handleSetNewPassword = async () => {
  clearErrors();

  const validationErrors = validationService.validateStep2(form);
  Object.assign(errors, validationErrors);

  // Check if confirmNewPassword is empty
  if (confirmNewPassword.value === "") {
    errors.confirmNewPassword = "Please confirm your new password.";
    console.error("Confirm new password is required");
  }

  // Check for password mismatch
  if (
    form.newPassword !== confirmNewPassword.value &&
    confirmNewPassword.value !== ""
  ) {
    errors.confirmNewPassword = "Passwords do not match.";
    console.error("Passwords do not match");
  }

  if (Object.keys(errors).length > 0) {
    console.error("Validation errors:", errors);
    return;
  }

  try {
    await forgotPasswordStore.setNewPassword(form);
    closePasswordModal();
    openSuccessModal();
  } catch (error) {
    console.error("Set new password failed:", error);
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Watch for when the password modal opens, then fetch the encryption keys
watch(
  () => isPasswordModalOpen.value,
  async (isOpen) => {
    if (isOpen) {
      try {
        console.log("Fetching encryption keys...");
        await forgotPasswordStore.getReqKey(username.value);
        console.log("Encryption keys fetched successfully.");
      } catch (error) {
        console.error("Fetching encryption keys failed:", error);
      }
    }
  }
);

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
};
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
}

.setting {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.setting .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-12) 0;
  border-bottom: 1px solid var(--light-grey);
}

.setting .title a {
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
}

.setting .item-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.setting .item {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: calc(100% + 16px);
  min-height: var(--size-60);
  padding: var(--size-8);
  cursor: pointer;
  border-radius: var(--border-md);
}

/* .setting .item:hover {
  background: var(--sky-blue);
  margin-inline: -16px;
} */

.setting .item .label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.setting .item .label span {
  font-weight: var(--semi-bold);
}

.setting .item .label button {
  min-width: unset;
  max-width: unset;
  min-height: unset;
  max-height: unset;
  padding: var(--size-12) var(--size-32);
}

.setting .item .detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.body {
  display: flex;
  flex-direction: column;
  padding: var(--size-12) 0;
  gap: var(--size-24);
}

.checkbox-group {
  display: flex;
  gap: var(--size-8);
  margin-top: var(--size-8);
}

.checkbox-group .item {
  position: relative;
  appearance: none;
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  padding: unset;
}

.checkbox-group .item input[type="checkbox"] {
  position: relative;
  appearance: none;
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  padding: 0;
  border-radius: var(--border-sm);
  background: var(--sky-blue);
  box-shadow: unset;
  cursor: pointer;
}

.checkbox-group .item svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: var(--size-12);
  max-width: var(--size-12);
  min-height: var(--size-16);
  max-height: var(--size-16);
  fill: var(--slate-blue);
  cursor: pointer;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
  min-height: var(--size-16);
  max-height: var(--size-16);
  margin-bottom: 0;
  cursor: pointer;
}
@media (max-width: 767px) {
}
</style>
