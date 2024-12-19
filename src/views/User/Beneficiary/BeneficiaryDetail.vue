<template>
  <div class="content-area">
    <div class="beneficiary" v-if="beneficiaryDetails">
      <div class="profile-section">
        <button class="btn-round" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c-12.5-12.5-12.5-32.8 0-45.3l-160 160z"
            />
          </svg>
        </button>
        <div class="user-group">
          <span class="icon-round">
            {{ getInitials(beneficiaryDetails.beneName) }}
            <img
              :src="getCurrencyImagePath(beneficiaryDetails.currency)"
              alt="Currency"
            />
          </span>
          <div>
            <span>{{ beneficiaryDetails.beneName }}</span>
            <span>
              <FavouriteButton
                :beneficiaryId="beneficiaryDetails.id || route.params.id"
                :isFav="!!beneficiaryDetails.isFav"
              />
            </span>
          </div>
          <div>{{ beneficiaryDetails.accountCurrency }}</div>
        </div>
        <div class="button-group">
          <button class="btn-red" @click="redirectToTransaction">
            Send money
          </button>
          <button class="btn-delete" @click="store.openModal">Delete</button>
        </div>
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
              <span>{{ beneficiaryDetails.beneName }}</span>
            </div>
            <div class="item">
              <span>Account type</span>
              <span>{{ getAccountType(beneficiaryDetails.accountType) }}</span>
            </div>
            <div class="item">
              <span>Bank name</span>
              <span>{{ beneficiaryDetails.bankName }}</span>
            </div>
            <div class="item">
              <span>Account number</span>
              <span>{{ beneficiaryDetails.bankAccountNo }}</span>
            </div>
            <div class="item">
              <span>Payment type</span>
              <span>{{ beneficiaryDetails.paymentType }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.swiftCode.length > 0">
              <span>Swift code</span>
              <span>{{ beneficiaryDetails.swiftCode }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.primaryBIC">
              <span
                >ACH routing number / IBAN no / BSB / ABA / Sort code / Bank
                code</span
              >
              <span>{{ beneficiaryDetails.primaryBIC }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.secondaryBIC">
              <span>Branch code </span>
              <span>{{ beneficiaryDetails.secondaryBIC }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.bankCountry">
              <span>Bank country</span>
              <span>{{ getNationality(beneficiaryDetails.bankCountry) }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.otherBankCountry">
              <span>Other bank country</span>
              <span>{{ beneficiaryDetails.bankCountry }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.bankAddress">
              <span>Bank address</span>
              <span>{{ beneficiaryDetails.bankAddress }}</span>
            </div>
          </div>

          <div class="title">Personal details</div>
          <div class="item-group">
            <div class="item">
              <span>Friendly name</span>
              <span>{{ beneficiaryDetails.name }}</span>
            </div>
            <div class="item" v-if="isBusiness">
              <span>Business category</span>
              <span>{{
                getBusinessCategory(beneficiaryDetails.businessCategory)
              }}</span>
            </div>
            <div
              class="item"
              v-if="isBusiness && beneficiaryDetails.registrationNo"
            >
              <span>Company registration number</span>
              <span>{{ beneficiaryDetails.registrationNo }}</span>
            </div>
            <div
              class="item"
              v-if="isBusiness && beneficiaryDetails.registrationPlace"
            >
              <span>Country of incorporation</span>
              <span>{{
                getNationality(beneficiaryDetails.registrationPlace)
              }}</span>
            </div>
            <div class="item" v-if="isIndividual">
              <span>Nationality</span>
              <span>{{ getNationality(beneficiaryDetails.nationality) }}</span>
            </div>
            <div
              class="item"
              v-if="isIndividual && beneficiaryDetails.otherNationality"
            >
              <span>Other nationality</span>
              <span>{{ beneficiaryDetails.otherNationality }}</span>
            </div>
            <div class="item" v-if="isIndividual && beneficiaryDetails.dob">
              <span>Date of birth</span>
              <span>{{ beneficiaryDetails.dob }}</span>
            </div>
            <div class="item" v-if="isBusiness">
              <span>Company contact number</span>
              <span>{{ beneficiaryDetails.companyContactNo }}</span>
            </div>
            <div class="item">
              <span>Phone number</span>
              <span>{{ beneficiaryDetails.contactMobile }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.address">
              <span>Address</span>
              <span>{{ beneficiaryDetails.address }}</span>
            </div>
          </div>

          <div class="title">Payment details</div>
          <div class="item-group">
            <div class="item">
              <span>Payment details</span>
              <span>{{ beneficiaryDetails.paymentDetail }}</span>
            </div>
            <div class="item">
              <span>Account relationship</span>
              <span>{{ beneficiaryDetails.rel }}</span>
            </div>
            <div class="item">
              <span>Purpose of intended transactions </span>
              <span>
                {{
                  getRemittancePurpose(
                    beneficiaryDetails.purposeOfIntendedTransactions
                  )
                }}
              </span>
            </div>
            <div
              class="item"
              v-if="beneficiaryDetails.otherPurposeOfIntendedTransactions"
            >
              <span>Other remittance purpose</span>
              <span>{{
                beneficiaryDetails.otherPurposeOfIntendedTransactions
              }}</span>
            </div>
            <div class="item">
              <span>Source of funds</span>
              <span>{{ getFundSource(beneficiaryDetails.fundSource) }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetails.otherFundSource">
              <span>Other source of funds</span>
              <span>{{ beneficiaryDetails.otherFundSource }}</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'transactions'" class="transaction">
          <div class="item-group">
            <div
              v-for="(transaction, index) in transactions"
              :key="index"
              class="item"
              tabindex="0"
            >
              <div class="icon-round">
                <font-awesome-icon :icon="['fas', 'dollar-sign']" />
              </div>
              <div class="information">
                <div class="first-column">
                  <div class="first-row">{{ transaction.number }}</div>
                  <div class="second-row">
                    <span
                      :class="{
                        unpaid: transaction.status === 'Unpaid',
                        pending: transaction.status.includes('Pending'),
                        completed: transaction.status === 'Completed',
                        failed: transaction.status === 'Failed',
                      }"
                      >{{ transaction.status }}</span
                    >
                    <span
                      :class="{
                        unpaid: transaction.status === 'Unpaid',
                        pending: transaction.status.includes('Pending'),
                        completed: transaction.status === 'Completed',
                        failed: transaction.status === 'Failed',
                      }"
                    ></span>
                    <span>{{ transaction.date }}</span>
                  </div>
                </div>
                <div class="second-column">
                  <div class="first-row">
                    {{ transaction.payAmount }}
                  </div>
                  <div class="second-row">
                    {{ transaction.receivingAmount }}
                  </div>
                </div>
              </div>
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
  useBeneficiaryStore,
  useStore,
  useAlertStore,
} from "@/stores/index.js";
import { useTransactionStore } from "@/stores/transactionStore";
import FavouriteButton from "./components/FavouriteButton.vue";
import Modal from "@/components/Modal.vue";
import { storeToRefs } from "pinia";
import {
  getInitials,
  getAccountType,
  getNationality,
  getBusinessCategory,
  getRemittancePurpose,
  getFundSource,
  getCurrencyImagePath,
} from "@/utils/beneficiaryUtils.js";
const route = useRoute();
const router = useRouter();

const id = route.params.id;
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();
const store = useStore();
const alertStore = useAlertStore();

const beneficiaryDetails = ref(null);
const { transactions } = storeToRefs(transactionStore);

const activeTab = ref("details");

const setActiveTab = (tab) => {
  activeTab.value = tab;
};
const isIndividual = computed(() => {
  return parseInt(beneficiaryDetails.value?.accountType) === 0;
});

const isBusiness = computed(() => {
  return parseInt(beneficiaryDetails.value?.accountType) === 1;
});

const handleSubmit = async () => {
  try {
    const response = await beneficiaryStore.deleteBeneficiary(id);
    if (response.status === 1) {
      store.closeModal();
      alertStore.alert(
        "success",
        "You have deleted this beneficiary successfully"
      );

      window.location.href = "/#/beneficiary";
    } else {
      alertStore.alert("error", "Failed to delete beneficiary");
    }
  } catch (error) {
    alertStore.alert("error", "Failed to delete beneficiary");
  }
};

onMounted(async () => {
  try {
    const response = await beneficiaryStore.getBeneficiaryDetail(id);
    if (response?.beneDetails) {
      beneficiaryDetails.value = response.beneDetails;
    }
  } catch (error) {
    console.error("Error fetching beneficiary details:", error);
  }
});

const redirectToTransaction = () => {
  const { currency } = beneficiaryDetails.value;
  const beneId = route.params.id;

  // Update selectedBeneficiary in the store using available details
  beneficiaryStore.setSelectedBeneficiary({
    id: beneId,
    beneName: beneficiaryDetails.value.beneName,
    currency: currency,
    accountType: beneficiaryDetails.value.accountType,
  });

  // Redirect to Add Transaction page
  router.push({
    path: "/transaction/addtransaction",
    query: { currency, beneId },
  });
};

const goBack = () => {
  router.go(-1);
};
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
  flex-direction: column;
}

.beneficiary .profile-section .user-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--size-12);
}

.beneficiary .profile-section .user-group .icon-round {
  position: relative;
  min-width: var(--size-72);
  max-width: var(--size-72);
  min-height: var(--size-72);
  max-height: var(--size-72);
  font-size: 24px;
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
  margin-bottom: var(--size-8);
}

.beneficiary .profile-section .user-group .icon-round img {
  position: absolute;
  bottom: 0;
  right: 0;
  min-width: var(--size-24);
  max-width: var(--size-24);
  min-height: var(--size-2240);
  max-height: var(--size-24);
  border: 2px solid var(--white);
  border-radius: var(--border-circle);
}

.beneficiary .profile-section .user-group span {
  color: var(--slate-blue);
  font-size: var(--text-lg);
  font-weight: var(--semi-bold);
}

.beneficiary .profile-section .user-group div {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  color: var(--grey);
}

.beneficiary .button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--size-12);
}

.beneficiary .button-group .btn-red {
  padding: var(--size-dropdown-item);
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
  padding-left: var(--size-24);
  padding-top: var(--size-24);
}

.beneficiary .item-section .detail .item-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: var(--size-24);
  column-gap: var(--size-48);
  padding: 0 var(--size-24);
  padding-bottom: var(--size-24);
  border-bottom: 1px solid var(--light-grey);
}

.beneficiary .item-section .detail .item-group:nth-child(6) {
  border-bottom: 0px solid var(--light-grey);
}

.beneficiary .item-section .detail .item-group .item {
  display: flex;
  flex-direction: column;
}

.beneficiary .item-section .detail .item-group .item span:nth-child(2) {
  font-weight: var(--semi-bold);
}

.beneficiary .transaction .item-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: var(--size-4) 0;
}

.beneficiary .transaction .item-group .item {
  display: flex;
  align-items: center;
  width: calc(100% + 16px);
  padding: var(--size-8);
  cursor: pointer;
  border-radius: var(--border-md);
}

.beneficiary .transaction .item-group .item:hover {
  background: var(--sky-blue);
  margin-inline: -16px;
}

.beneficiary .transaction .item-group .item .icon-round {
  margin-right: var(--size-12);
}

.beneficiary .transaction .item-group .item:hover .icon-round {
  background: var(--slate-blue);
}

.beneficiary .transaction .item-group .item:hover .icon-round svg {
  color: var(--sky-blue);
}

.beneficiary .transaction .item-group .item .information {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .first-row {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  font-size: var(--text-sm);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(1) {
  font-weight: var(--semi-bold);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(2) {
  width: 4px;
  height: 4px;
  background: var(--black);
  border-radius: var(--border-circle);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(1).completed {
  color: var(--pastel-green);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(2).completed {
  background: var(--pastel-green);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(1).failed,
.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(1).unpaid {
  color: var(--darker-crimson-red);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  span:nth-child(2).failed,
.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  span:nth-child(2).unpaid {
  background: var(--dark-crimson-red);
}

.beneficiary .transaction .item-group .item .information .second-column {
  text-align: end;
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .second-column
  .first-row {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .second-column
  .second-row {
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .beneficiary .item-section .detail .item-group,
  .beneficiary .item-section .detail .item-group:nth-child(6) {
    grid-template-columns: 1fr;
  }

  .beneficiary .item-section .detail .title {
    color: var(--cool-blue);
    font-size: var(--text-sm);
    font-weight: var(--semi-bold);
    margin-bottom: var(--size-12);
    padding-left: var(--size-16);
    padding-top: var(--size-16);
  }

  .beneficiary .item-section .detail .item-group {
    padding: 0 var(--size-16);
    padding-bottom: var(--size-16);
  }
}
</style>
