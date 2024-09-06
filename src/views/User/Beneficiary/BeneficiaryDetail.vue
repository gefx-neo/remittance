<template>
  <div class="content-area">
    <div class="beneficiary">
      <div class="profile-section">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
            />
          </svg>
        </button>
        <div>
          <span class="icon-round">{{ beneficiary.initials }}</span>
          <span>{{ beneficiary.name }}</span>
        </div>
        <FavouriteButton :beneficiaryId="beneficiary.id" />
      </div>
      <div class="button-group">
        <button class="btn-red">Send money</button>
        <button class="btn-delete">Delete</button>
      </div>

      <div class="item-section">
        <div class="tabs">
          <button
            :class="{ active: activeTab === 'details' }"
            @click="setActiveTab('details')"
          >
            Details
          </button>
          <button
            :class="{ active: activeTab === 'transactions' }"
            @click="setActiveTab('transactions')"
          >
            Transactions
          </button>
        </div>
        <div v-if="activeTab === 'details'" class="detail">
          <div class="title">Bank details</div>
          <div class="item-group">
            <div class="item">
              <span>Account holder name</span>
              <span>John Doe</span>
            </div>
            <div class="item">
              <span>Account type</span>
              <span>Business</span>
            </div>
            <div class="item">
              <span>Bank name</span>
              <span>Bank of America</span>
            </div>
            <div class="item">
              <span>Account number</span>
              <span>98645321012</span>
            </div>
          </div>
          <div class="title">Personal details</div>
          <div class="item-group">
            <div class="item">
              <span>Full name</span>
              <span>John Doe</span>
            </div>
            <div class="item">
              <span>Nationality</span>
              <span>American</span>
            </div>
            <div class="item">
              <span>Phone number</span>
              <span>+1-212-456-7890</span>
            </div>
            <div class="item">
              <span>E-mail address</span>
              <span>johndoe123@outlook.com</span>
            </div>
            <div class="item">
              <span>Delivery address</span>
              <span>123 Ocean Drive Port St. Lucie, FL 34952 USA</span>
            </div>
          </div>
          <div class="title">Payment details</div>
          <div class="item-group">
            <div class="item">
              <span>Remittance purpose</span>
              <span>Overseas Mortgage and Rental</span>
            </div>
            <div class="item">
              <span>Source of income</span>
              <span>Business income</span>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'transactions'" class="transaction item">
          <!-- Content for Transactions tab -->
          <p>Transaction history goes here.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBeneficiaryStore } from "@/stores/beneficiaryStore";
import FavouriteButton from "@/components/FavouriteButton.vue";

const route = useRoute();
const router = useRouter();

const id = route.params.id; // Extract beneficiary ID from params
const beneficiaryStore = useBeneficiaryStore();

const beneficiary = computed(() => {
  return beneficiaryStore.beneficiaries.find((b) => b.id === Number(id));
});

const goBack = () => {
  router.go(-1);
};

const activeTab = ref("details");

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

onMounted(() => {
  console.log("Beneficiary ID:", id);
  console.log("Beneficiary Object:", beneficiary.value);
});
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
}

.beneficiary {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.beneficiary .profile-section {
  display: flex;
  justify-content: space-between;
}

.beneficiary .profile-section div:nth-child(2) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.beneficiary .profile-section div:nth-child(2) .icon-round {
  min-width: var(--size-60);
  max-width: var(--size-60);
  min-height: var(--size-60);
  max-height: var(--size-60);
  font-size: var(--text-xl);
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
  margin-bottom: var(--size-8);
}

.beneficiary .profile-section div:nth-child(2) span {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.beneficiary .button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--size-12);
}

.beneficiary .button-group .btn-red {
  padding: var(--size-dropdown-item);
  border-radius: var(--border-md);
}

.beneficiary .button-group .btn-delete {
  padding: var(--size-dropdown-item);
  border-radius: var(--border-md);
  font-weight: var(--semi-bold);
}

.beneficiary .item-section .tabs {
  display: flex;
  gap: var(--size-8);
  margin-bottom: var(--size-12);
}

.beneficiary .item-section .tabs button {
  padding: var(--size-8);
}

.beneficiary .item-section .tabs button.active {
  border-bottom: 1px solid var(--black);
  font-weight: var(--semi-bold);
}

.beneficiary .item-section .tabs button:hover {
  font-weight: var(--semi-bold);
}

.beneficiary .item-section .detail {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.beneficiary .item-section .detail .title {
  color: var(--cool-blue);
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
  margin-bottom: var(--size-12);
  padding-left: var(--size-20);
  padding-top: var(--size-20);
}

.beneficiary .item-section .detail .item-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: var(--size-24);
  padding: 0 var(--size-20);
  padding-bottom: var(--size-24);
  border-bottom: 1px solid var(--light-grey);
}

.beneficiary .item-section .detail .item-group:nth-child(6) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: var(--size-24);
  padding: 0 var(--size-20);
  padding-bottom: var(--size-24);
  border-bottom: 0px solid var(--light-grey);
}

.beneficiary .item-section .detail .item-group .item {
  display: flex;
  flex-direction: column;
}

.beneficiary .item-section .detail .item-group .item span:nth-child(2) {
  font-weight: var(--semi-bold);
}

@media (max-width: 768px) {
  .beneficiary .item-section .detail .item-group {
    grid-template-columns: 1fr;
  }
}
</style>
