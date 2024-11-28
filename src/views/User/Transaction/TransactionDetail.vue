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
      <div class="invoice">
        <div class="user-section">
          <div>
            <span class="icon-round"
              >{{ beneficiary.initials }}
              <!-- <img :src="getCurrencyImagePath(beneficiary.currency)" /> -->
            </span>
            <span>John Doe</span>
          </div>

          <button type="button" class="btn-blue">Send reminder</button>
        </div>
        <div class="item-section">
          <div class="detail info">
            <div class="title">Beneficiary Information</div>
            <div class="item-group">
              <div class="item">
                <span>Account holder name</span>
                <span>John Doe</span>
              </div>
              <div class="item">
                <span>Bank name</span>
                <span>Bank of America</span>
              </div>
              <div class="item">
                <span>Bank account number</span>
                <span>98765432100</span>
              </div>
              <div class="item">
                <span>Remittance purpose</span>
                <span>Overseas mortgage and rental</span>
              </div>
              <div class="item">
                <span>Source of income</span>
                <span>Business income</span>
              </div>
            </div>
          </div>
          <div class="detail summary">
            <div class="title">Transaction Summary</div>
            <div class="item-group">
              <div class="item">
                <span>Date & time</span>
                <span>1 May 2024, 2:00PM</span>
              </div>
              <div class="item">
                <span>Sending amount</span>
                <span>2,000 SGD</span>
              </div>
              <div class="item">
                <span>Processing fees</span>
                <span>8 SGD</span>
              </div>
              <div class="item">
                <span>Receiving amount</span>
                <span>1,463.82 USD</span>
              </div>
              <div class="item">
                <span>Exchange rate</span>
                <span>1 SGD = 0.7315 USD</span>
              </div>
              <div class="item">
                <span>Amount paid</span>
                <span>2,008 SGD</span>
              </div>
              <div class="item">Pending remittance</div>
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
        @cancel="store.closeModal"
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

import {
  useAlertStore,
  useBeneficiaryStore,
  useTransactionStore,
  useStore,
} from "@/stores/index.js";
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

const getCurrencyImagePath = (currencyCode) => {
  return `/src/assets/currency/${currencyCode.toLowerCase()}.svg`;
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

.transaction .invoice {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.transaction .user-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-20) var(--size-24);
  border-bottom: 1px solid var(--light-grey);
}

.transaction .user-section .icon-round {
  position: relative;
  min-width: var(--size-60);
  max-width: var(--size-60);
  min-height: var(--size-60);
  max-height: var(--size-60);
  font-size: var(--text-xl);
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
}

.transaction .user-section .icon-round img {
  position: absolute;
  bottom: 0;
  right: 0;
  min-width: var(--size-20);
  max-width: var(--size-20);
  min-height: var(--size-20);
  max-height: var(--size-20);
  border: 2px solid var(--white);
  border-radius: var(--border-circle);
}

.transaction .user-section span {
  color: var(--slate-blue);
  font-size: var(--text-lg);
  font-weight: var(--semi-bold);
}

.transaction .user-section div {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  color: var(--grey);
}

.transaction .user-section .btn-blue {
  padding: var(--size-dropdown-item);
}

.transaction .item-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.transaction .item-section .detail .title {
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
  margin-bottom: var(--size-16);
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
  margin-bottom: var(--size-12);
}

.transaction .item-section .detail .item-group .item span {
  display: flex;
}

.transaction .item-section .detail .item-group .item span:nth-child(1) {
  color: var(--grey);
}

.transaction .item-section .detail .item-group .item span:nth-child(2) {
  justify-content: end;
  text-align: end;
}

.transaction .item-section .detail.summary .item-group .item:nth-child(5) {
  border-bottom: 1px solid var(--light-grey);
  padding-bottom: var(--size-24);
}

.transaction .item-section .detail.summary .item-group .item:nth-child(6) {
  margin-bottom: var(--size-24);
}

.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(6)
  span:nth-child(2) {
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
}

.transaction .item-section .detail.summary .item-group .item:nth-child(7) {
  display: flex;
  justify-content: end;
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .transaction .user-section {
    padding: var(--size-16) var(--size-12);
  }

  .transaction .user-section div span:nth-child(2) {
    display: none;
  }

  .transaction .item-section {
    grid-template-columns: 1fr;
  }

  .transaction .item-section .detail .title {
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

  .transaction .item-section .detail.summary .item-group .item:nth-child(5) {
    border-bottom: 1px solid var(--light-grey);
    padding-bottom: var(--size-12);
  }
}
</style>
