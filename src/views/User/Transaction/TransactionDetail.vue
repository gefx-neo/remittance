<template>
  <div class="content-area">
    <div class="transaction">
      <button class="btn-round" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
          />
        </svg>
      </button>

      <div class="item-section">
        <div class="detail">
          <div class="title">Beneficiary Information</div>
          <div class="item-group">
            <div class="item">
              <span>Account holder name</span>
              <span>John Doe</span>
            </div>
          </div>
        </div>
        <div class="detail">
          <div class="title">Transaction Summary</div>
          <div class="item-group">
            <div class="item">
              <span>Remittance purpose</span>
              <span>Overseas Mortgage and Rental</span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        :isModalOpen="store.isModalOpen"
        :title="'Delete beneficiary'"
        :showAction="true"
        @close="store.closeModal"
        @submit="handleSubmit"
        @cancel="handleCancel"
      >
        <template #body>
          <p>Are you sure you want to delete this beneficiary?</p>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBeneficiaryStore } from "@/stores/beneficiaryStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useStore } from "@/stores/useStore";
import { useAlertStore } from "@/stores/alertStore";
import Modal from "@/components/Modal.vue";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();

const id = route.params.id; // Extract beneficiary ID from params
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();
const store = useStore();
const alertStore = useAlertStore();

const beneficiary = computed(() => {
  return beneficiaryStore.beneficiaries.find((b) => b.id === Number(id));
});
const { transactions } = storeToRefs(transactionStore);

const goBack = () => {
  router.go(-1);
};

const activeTab = ref("details");

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const handleSubmit = async () => {
  try {
    const response = await beneficiaryStore.deleteBeneficiary(
      beneficiary.value.name
    );

    if (response.status === 1) {
      alertStore.alert(
        "success",
        "You have deleted this beneficiary successfully"
      );
      console.log("Beneficiary deleted successfully");
      router.push("/beneficiary-list");
    } else {
      // Handle error
      alertStore.alert("error", "Failed to delete beneficiary");
      console.error("Failed to delete beneficiary:", response.message);
    }
  } catch (error) {
    alertStore.alert("error", "Failed to delete beneficiary");
    console.error("Error in handleSubmit:");
  }
};

onMounted(() => {
  console.log("Beneficiary ID:", id);
  console.log("Beneficiary Object:", beneficiary.value);
});

const handleCancel = () => {
  store.closeModal();
};
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
}

.transaction {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.transaction .item-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.transaction .item-section .detail {
}

.transaction .item-section .detail .title {
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
  margin-bottom: var(--size-12);
  padding-left: var(--size-24);
  padding-top: var(--size-24);
}

.transaction .item-section .detail .item-group {
  row-gap: var(--size-24);
  padding: 0 var(--size-24);
  padding-bottom: var(--size-24);
  gap: var(--size-24);
}

.transaction .item-section .detail .item-group .item {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.transaction .item-section .detail .item-group .item span {
  display: flex;
  align-items: center;
}

.transaction .item-section .detail .item-group .item span:nth-child(2) {
  justify-content: end;
  text-align: end;
}

@media (max-width: 768px) {
  .transaction .item-section {
    grid-template-columns: 1fr;
  }

  .transaction .item-section .detail .title {
    font-size: var(--text-sm);
    font-weight: var(--semi-bold);
    margin-bottom: var(--size-12);
    padding-left: var(--size-16);
    padding-top: var(--size-16);
  }

  .transaction .item-section .detail .item-group {
    padding: 0 var(--size-16);
    padding-bottom: var(--size-16);
    gap: 0;
  }

  .transaction .item-section .detail .item-group .item {
    display: flex;
    flex-direction: column;
  }

  .transaction .item-section .detail .item-group .item span:nth-child(2) {
    justify-content: start;
    text-align: start;
  }
}
</style>
