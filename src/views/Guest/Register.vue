<template>
  <div class="content-area">
    <div class="heading">
      <h1>Create an account</h1>
      <div>
        Already signed up?
        <router-link to="/">Login here</router-link>
      </div>
    </div>

    <form @submit.prevent="handleRegister">
      <fieldset :disabled="store.isLoading">
        <div class="form-group">
          <label for="surname">Surname</label>
          <input type="text" id="surname" v-model="form.surname" />
          <span v-if="errors.surname" class="error">{{ errors.surname }}</span>
        </div>
        <div class="form-group">
          <label for="givenName">Given name</label>
          <input type="text" id="givenName" v-model="form.givenName" />
          <span v-if="errors.givenName" class="error">{{
            errors.givenName
          }}</span>
        </div>
        <div class="form-group">
          <label for="emailAddress">E-mail address</label>
          <input type="text" id="emailAddress" v-model="form.emailAddress" />
          <span v-if="errors.emailAddress" class="error">
            {{ errors.emailAddress }}
          </span>
        </div>

        <div class="form-group">
          <label>Account type</label>
          <div class="radio-group">
            <div class="item">
              <input
                type="radio"
                id="individual"
                name="accountType"
                value="Natural Person"
                v-model="form.accountType"
              />
              <label for="individual">Individual</label>
            </div>
            <div class="item">
              <input
                type="radio"
                id="business"
                name="accountType"
                value="Corporate & Trading Company"
                v-model="form.accountType"
              />
              <label for="business">Business</label>
            </div>
          </div>
          <span v-if="errors.accountType" class="error">
            {{ errors.accountType }}
          </span>
        </div>

        <div
          class="form-group"
          v-if="form.accountType === 'Corporate & Trading Company'"
        >
          <label for="companyName">Registered company name</label>
          <input type="text" id="companyName" v-model="form.companyName" />
          <span v-if="errors.companyName" class="error">
            {{ errors.companyName }}
          </span>
        </div>

        <ButtonAPI class="btn-red standard-button"> Register </ButtonAPI>
      </fieldset>
    </form>

    <div v-if="registerStore.error" class="error">
      {{ registerStore.error }}
    </div>
    <div class="footer">
      By clicking Register, you agree to our
      <span @click="openTermsModal">Terms</span> and
      <span @click="openPolicyModal">Privacy Policy</span>
    </div>
    <Modal
      :isModalOpen="store.isModalOpen"
      title="Account created"
      :success="true"
      :footerMessage="'Please check your e-mail for temporary passcode.'"
    />
    <ModalTerms
      :isModalOpen="isTermsModal"
      title="Terms and conditions"
      @close="isTermsModal = false"
    />
    <ModalPolicy
      :isModalOpen="isPolicyModal"
      title="Privacy Policy"
      @close="isPolicyModal = false"
    />
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from "vue-router";
import { ref, reactive } from "vue";
import { useRegisterStore } from "@/stores/registerStore";
import { useStore } from "@/stores/store";
import { useAlertStore } from "@/stores/alertStore";
import { validationService } from "@/services/validationUserService.js";
import Modal from "@/components/Modal/Modal.vue";
import ModalTerms from "./components/ModalTerms.vue";
import ModalPolicy from "./components/ModalPolicy.vue";
import { ButtonAPI } from "@/components/Form";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";

const registerStore = useRegisterStore();
const store = useStore();
const alertStore = useAlertStore();

const form = reactive({
  surname: "",
  givenName: "",
  emailAddress: "",
  accountType: "",
  companyName: "",
});

const errors = reactive({});
const isTermsModal = ref(false);
const isPolicyModal = ref(false);
const openTermsModal = () => {
  isTermsModal.value = true;
};
const openPolicyModal = () => {
  isPolicyModal.value = true;
};

const handleRegister = async () => {
  // Clear previous errors before validation
  clearErrors();

  // Revalidate on submit
  const validationErrors = validationService.validateRegister(form);
  Object.assign(errors, validationErrors);

  // Prevent submit if error exists
  if (Object.keys(errors).length > 0) {
    return;
  }

  try {
    const response = await registerStore.register(form);

    if (response.status === 1) {
      store.openModal();
    } else {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
};

onBeforeRouteLeave((to, from, next) => {
  registerStore.$reset();
  next();
});
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-24);
  min-height: calc(100vh - 140px);
}

.heading {
  text-align: center;
}

.heading h1 {
  margin-bottom: var(--size-8);
}

.heading a {
  color: var(--grey) !important;
  font-weight: var(--semi-bold);
  text-decoration: underline;
  cursor: pointer;
}

.footer {
  color: var(--grey) !important;
  font-size: var(--text-sm);
}

.footer span {
  font-weight: var(--semi-bold);
  cursor: pointer;
}

form {
  width: 100%;
  max-width: 400px;
  gap: var(--size-24);
}

.form-group {
  margin-bottom: var(--size-24);
}

.btn-red {
  border-radius: var(--border-md);
  width: 100%;
  min-height: var(--size-48);
  padding: var(--size-dropdown-item);
}

.checkbox-group {
  display: flex;
  margin-top: var(--size-8);
  gap: var(--size-8);
}

.checkbox-group .item {
  position: relative;
  appearance: none;
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
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

.radio-group {
  display: flex;
  gap: var(--size-24);
  margin-top: var(--size-4);
}

.radio-group .item {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.radio-group .item label {
  margin-bottom: 0;
  cursor: pointer;
}

@media (max-width: 1023px) {
  .content-area {
    padding: var(--size-24);
  }
}

@media (max-width: 767px) {
  .content-area {
    padding: var(--size-16);
  }
}
</style>
