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

    <Modal
      :isModalOpen="store.isModalOpen"
      title="Account created"
      :checkYourEmail="true"
    />
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from "vue-router";
import { reactive } from "vue";
import { useRegisterStore } from "@/stores/registerStore";
import { useStore } from "@/stores/useStore";
import { validationService } from "@/services/validationUserService.js";
import Modal from "@/components/Modal.vue";
import { ButtonAPI } from "@/components/Form";

const registerStore = useRegisterStore();
const store = useStore();

const form = reactive({
  surname: "",
  givenName: "",
  emailAddress: "",
  accountType: "",
  companyName: "",
});

const errors = reactive({});

const handleRegister = async () => {
  // Clear previous errors before validation
  clearErrors();

  // Revalidate on submit
  const validationErrors = validationService.validateRegister(form);
  Object.assign(errors, validationErrors);

  // Prevent submit if error exists
  if (Object.keys(errors).length > 0) {
    console.error("Validation errors:", errors);
    return;
  }

  try {
    const response = await registerStore.register(form);

    if (response.status === 1) {
      store.openModal();
    } else {
      console.error("Registration failed:", registerStore.error);
    }
  } catch (error) {
    console.error("Registration failed:", registerStore.error);
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
}

.heading {
  text-align: center;
}

.heading h1 {
  margin-bottom: var(--size-8);
}

.heading a {
  color: var(--grey);
  font-weight: var(--semi-bold);
  text-decoration: underline;
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
