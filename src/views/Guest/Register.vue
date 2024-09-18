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
      <div class="form-group">
        <label for="surname">Surname</label>
        <input id="surname" v-model="form.surname" type="text" required />
      </div>
      <div class="form-group">
        <label for="givenName">Given name</label>
        <input id="givenName" v-model="form.givenName" type="text" required />
      </div>
      <div class="form-group">
        <label for="emailAddress">E-mail address</label>
        <input
          id="emailAddress"
          v-model="form.emailAddress"
          type="email"
          required
        />
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
              required
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
              required
            />
            <label for="business">Business</label>
          </div>
        </div>
      </div>

      <div
        class="form-group"
        v-if="form.accountType === 'Corporate & Trading Company'"
      >
        <label for="companyName">Registered company name</label>
        <input
          id="companyName"
          v-model="form.companyName"
          type="text"
          required
        />
      </div>
      <ButtonAPI :disabled="store.isLoading" class="btn-red standard-button">
        Register
      </ButtonAPI>
    </form>
    <div v-if="registerStore.error" class="error">
      {{ registerStore.error }}
    </div>
    <Modal
      :isModalOpen="store.isModalOpen"
      title="Account created"
      :redirectToLogin="true"
    >
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRegisterStore } from "@/stores/registerStore";
import { useStore } from "@/stores/useStore";
import Modal from "@/components/Modal.vue";
import ButtonAPI from "@/components/ButtonAPI.vue";

const registerStore = useRegisterStore();
const store = useStore();

const form = reactive({
  surname: "",
  givenName: "",
  emailAddress: "",
  accountType: "Individual",
  companyName: "",
});

const handleRegister = async () => {
  try {
    store.setLoading(true);
    const response = await registerStore.register(form);
    console.log("Registration response:", response);
    store.isModalOpen = true;
  } catch (error) {
    console.error("Registration failed:", error);
  } finally {
    store.setLoading(false);
  }
};
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

.error {
  color: red;
  margin-top: 10px;
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
