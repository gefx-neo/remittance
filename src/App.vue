<!-- Routerview here renders Layout.vue and Layout.vue renders the children route pages -->
<template>
  <RouterView />
  <Alert />
  <ModalTokenExpiration />
</template>

<script setup>
import { RouterView } from "vue-router";
import Alert from "@/components/Alert.vue";
import ModalTokenExpiration from "@/components/Modal/ModalTokenExpiration.vue";

import { useTransactionStore } from "@/stores/transactionStore";

const transactionStore = useTransactionStore();

// Check if sessionActive flag exists in sessionStorage
if (!sessionStorage.getItem("sessionActive")) {
  // Clear the transaction data stored in localStorage
  localStorage.removeItem("transactionStore");

  // Reset the Pinia store
  transactionStore.$reset();
  localStorage.removeItem("transaction");
  localStorage.removeItem("beneficiary");
  localStorage.removeItem("stepStore");
  sessionStorage.removeItem("firstTimeFromDashboard");
  sessionStorage.removeItem("firstTimeFromBeneficiaryDetail");
  sessionStorage.removeItem("firstTimeFromTransactionList");
  // Mark this session as active in sessionStorage
  sessionStorage.setItem("sessionActive", "true");
}
</script>
