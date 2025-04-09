<template>
  <div class="content-area">
    <button class="btn-round" @click="handleBack">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path
          d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
        />
      </svg>
    </button>

    <div class="beneficiary" v-if="beneficiaryDetail">
      <div class="profile-section">
        <div class="user-group">
          <span class="icon-round">
            {{ getInitials(beneficiaryDetail.beneName) }}
            <img
              :src="getCurrencyImagePath(beneficiaryDetail.currency)"
              alt="Currency"
            />
          </span>
          <div>
            <span>{{ beneficiaryDetail.beneName }}</span>
            <span>
              <FavouriteButton
                :beneficiaryId="beneficiaryDetail.id || route.params.id"
                :isFav="!!beneficiaryDetail.isFav"
              />
            </span>
          </div>
          <div>{{ beneficiaryDetail.accountCurrency }}</div>
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
              <span>{{ beneficiaryDetail.beneName }}</span>
            </div>
            <div class="item">
              <span>Account type</span>
              <span>{{ getAccountType(beneficiaryDetail.accountType) }}</span>
            </div>
            <div class="item">
              <span>Bank name</span>
              <span>{{ beneficiaryDetail.bankName }}</span>
            </div>
            <div class="item">
              <span>Bank account number</span>
              <span>{{ beneficiaryDetail.bankAccountNo }}</span>
            </div>
            <div class="item">
              <span>Payment type</span>
              <span>{{ beneficiaryDetail.paymentType }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.swiftCode.length > 0">
              <span>Swift code</span>
              <span>{{ beneficiaryDetail.swiftCode }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.primaryBIC">
              <span
                >ACH routing number / IBAN no / BSB / ABA / Sort code / Bank
                code</span
              >
              <span>{{ beneficiaryDetail.primaryBIC }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.secondaryBIC">
              <span>Branch code </span>
              <span>{{ beneficiaryDetail.secondaryBIC }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.bankCountry">
              <span>Bank country</span>
              <span>{{ getNationality(beneficiaryDetail.bankCountry) }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.otherBankCountry">
              <span>Other bank country</span>
              <span>{{ beneficiaryDetail.bankCountry }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.bankAddress">
              <span>Bank address</span>
              <span>{{ beneficiaryDetail.bankAddress }}</span>
            </div>
          </div>

          <div class="title">Personal details</div>
          <div class="item-group">
            <div class="item">
              <span>Friendly name</span>
              <span>{{ beneficiaryDetail.name }}</span>
            </div>
            <div class="item" v-if="isBusiness">
              <span>Business category</span>
              <span>{{
                getBusinessCategory(beneficiaryDetail.businessCategory)
              }}</span>
            </div>
            <div
              class="item"
              v-if="isBusiness && beneficiaryDetail.registrationNo"
            >
              <span>Company registration number</span>
              <span>{{ beneficiaryDetail.registrationNo }}</span>
            </div>
            <div
              class="item"
              v-if="isBusiness && beneficiaryDetail.registrationPlace"
            >
              <span>Country of incorporation</span>
              <span>{{
                getNationality(beneficiaryDetail.registrationPlace)
              }}</span>
            </div>
            <div class="item" v-if="isIndividual">
              <span>Nationality</span>
              <span>{{ getNationality(beneficiaryDetail.nationality) }}</span>
            </div>
            <div
              class="item"
              v-if="isIndividual && beneficiaryDetail.otherNationality"
            >
              <span>Other nationality</span>
              <span>{{ beneficiaryDetail.otherNationality }}</span>
            </div>
            <div class="item" v-if="isIndividual && beneficiaryDetail.dob">
              <span>Date of birth</span>
              <span>{{ beneficiaryDetail.dob }}</span>
            </div>
            <div class="item" v-if="isBusiness">
              <span>Company contact number</span>
              <span>{{ beneficiaryDetail.companyContactNo }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.phoneNumber">
              <span>Phone number</span>
              <span>{{ beneficiaryDetail.contactMobile }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.address">
              <span>Address</span>
              <span>{{ beneficiaryDetail.address }}</span>
            </div>
          </div>

          <div class="title">Payment details</div>
          <div class="item-group">
            <div class="item">
              <span>Payment details</span>
              <span>{{ beneficiaryDetail.paymentDetail }}</span>
            </div>
            <div class="item">
              <span>Account relationship</span>
              <span>{{ beneficiaryDetail.rel }}</span>
            </div>
            <div class="item">
              <span>Purpose of intended transactions </span>
              <span>
                {{
                  getRemittancePurpose(
                    beneficiaryDetail.purposeOfIntendedTransactions
                  )
                }}
              </span>
            </div>
            <div
              class="item"
              v-if="beneficiaryDetail.otherPurposeOfIntendedTransactions"
            >
              <span>Other remittance purpose</span>
              <span>{{
                beneficiaryDetail.otherPurposeOfIntendedTransactions
              }}</span>
            </div>
            <div class="item">
              <span>Source of funds</span>
              <span>{{ getFundSource(beneficiaryDetail.fundSource) }}</span>
            </div>
            <div class="item" v-if="beneficiaryDetail.otherFundSource">
              <span>Other source of funds</span>
              <span>{{ beneficiaryDetail.otherFundSource }}</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'transactions'" class="transaction">
          <div v-if="store.isLoading">
            <SkeletonLoader type="dashboardTransaction" :count="3" />
          </div>
          <div v-else-if="transactions.length === 0">
            <EmptyList />
          </div>
          <div class="item-group" v-else>
            <div
              v-for="(transaction, index) in transactions"
              :key="index"
              class="item"
              tabindex="0"
              @click="navigateToTransactionDetail(transaction.memoId)"
            >
              <div class="icon-round">
                <font-awesome-icon :icon="['fas', 'dollar-sign']" />
              </div>
              <div class="information">
                <div class="first-column">
                  <div class="first-row">{{ transaction.memoId }}</div>
                  <div class="second-row">
                    <span
                      :class="{
                        failed: transaction.status === 0,
                        completed: transaction.status === 1,
                        unpaid: transaction.status === 2,
                        pending: transaction.status === 3,
                        priority:
                          transaction.status === 3 &&
                          transaction.isUrgent === 1,
                        cancelled: transaction.status === 4,
                      }"
                    >
                      {{ getTransactionStatus(transaction.status) }}
                    </span>
                    <span
                      :class="{
                        failed: transaction.status === 0,
                        completed: transaction.status === 1,
                        unpaid: transaction.status === 2,
                        pending: transaction.status === 3,
                        priority:
                          transaction.status === 3 &&
                          transaction.isUrgent === 1,
                        cancelled: transaction.status === 4,
                      }"
                    >
                    </span>
                    <span>{{ formatDateTime(transaction.date) }}</span>
                  </div>
                </div>
                <div class="second-column">
                  <div class="first-row">
                    {{ formatNumber(transaction.payAmount) }}
                    {{ transaction.payCurrency }}
                  </div>
                  <div class="second-row">
                    {{ formatNumber(transaction.getAmount) }}
                    {{ transaction.getCurrency }}
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
    <SkeletonLoader type="beneficiaryDetail" v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useBeneficiaryStore,
  useTransactionStore,
  useStore,
  useAlertStore,
} from "@/stores/index.js";
import FavouriteButton from "./components/FavouriteButton.vue";
import Modal from "@/components/Modal/Modal.vue";
import {
  getInitials,
  getAccountType,
  getNationality,
  getBusinessCategory,
  getRemittancePurpose,
  getFundSource,
  getCurrencyImagePath,
} from "@/utils/beneficiaryUtils.js";
import {
  formatNumber,
  getTransactionStatus,
  formatDateTime,
} from "@/utils/transactionUtils.js";
import SkeletonLoader from "@/views/SkeletonLoader.vue";
import EmptyList from "@/views/EmptyList.vue";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";

const route = useRoute();
const router = useRouter();

const id = route.params.id;
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();
const store = useStore();
const alertStore = useAlertStore();

const beneficiaryDetail = ref(null);
const transactions = ref([]);

const activeTab = ref("details");

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const isIndividual = computed(() => {
  return parseInt(beneficiaryDetail.value?.accountType) === 0;
});

const isBusiness = computed(() => {
  return parseInt(beneficiaryDetail.value?.accountType) === 1;
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
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

onMounted(async () => {
  try {
    // Fetch beneficiary details
    const response = await beneficiaryStore.getBeneficiaryDetail(id);
    if (response?.beneDetails) {
      beneficiaryDetail.value = response.beneDetails;
    }

    // Fetch transaction list
    const transactionsResponse = await transactionStore.getTransactionList();
    if (transactionsResponse?.trxns) {
      // Filter transactions by the beneficiary ID
      transactions.value = transactionsResponse.trxns.filter(
        (transaction) => transaction.beneficiaryId === parseInt(id)
      );
      transactions.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
});

const redirectToTransaction = () => {
  const { currency } = beneficiaryDetail.value;
  const beneId = route.params.id;

  // Update selectedBeneficiary in the store using available details
  beneficiaryStore.setSelectedBeneficiary({
    id: beneId,
    currency: currency,
  });

  // Redirect to Add Transaction page
  router.push({
    path: "/transaction/addtransaction",
    query: {
      fromBeneficiaryDetail: "true",
      beneId,
      currency,
    },
  });
};

const navigateToTransactionDetail = async (memoId) => {
  const transaction = transactions.value.find((txn) => txn.memoId === memoId);

  if (transaction) {
    router.push({
      name: "transaction-detail",
      params: { memoId: transaction.memoId },
    });
  } else {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
  min-height: calc(100vh - 140px);
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
  font-size: var(--size-24);
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
  display: flex;
  align-items: center;
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
  width: calc(100% + var(--size-16));
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
  span:nth-child(1).pending {
  color: var(--midnight-violet);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(2).pending {
  background: var(--midnight-violet);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(1).priority {
  color: var(--dark-yellow);
}

.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(2).priority {
  background: var(--dark-yellow);
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
  span:nth-child(1).unpaid,
.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  .second-row
  span:nth-child(1).cancelled {
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
  span:nth-child(2).unpaid,
.beneficiary
  .transaction
  .item-group
  .item
  .information
  .first-column
  span:nth-child(2).cancelled {
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

@media (max-width: 767px) {
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
