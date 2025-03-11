<template>
  <div class="content-area" v-if="$isVerifiedUser(profileDetails.userStatus)">
    <div class="transaction">
      <div class="title">
        <h3>Transaction History</h3>
      </div>
      <div class="search-section">
        <div class="input-group">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search transaction"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            />
          </svg>
        </div>
        <div class="button-group">
          <button
            class="btn-blue standard-button"
            @click="navigateToAddTransaction"
          >
            <span class="desktop">New transaction</span>
            <span class="mobile">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zM272 192l224 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-224 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zM256 304c0-8.8 7.2-16 16-16l224 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-224 0c-8.8 0-16-7.2-16-16zM164 152l0 13.9c7.5 1.2 14.6 2.9 21.1 4.7c10.7 2.8 17 13.8 14.2 24.5s-13.8 17-24.5 14.2c-11-2.9-21.6-5-31.2-5.2c-7.9-.1-16 1.8-21.5 5c-4.8 2.8-6.2 5.6-6.2 9.3c0 1.8 .1 3.5 5.3 6.7c6.3 3.8 15.5 6.7 28.3 10.5l.7 .2c11.2 3.4 25.6 7.7 37.1 15c12.9 8.1 24.3 21.3 24.6 41.6c.3 20.9-10.5 36.1-24.8 45c-7.2 4.5-15.2 7.3-23.2 9l0 13.8c0 11-9 20-20 20s-20-9-20-20l0-14.6c-10.3-2.2-20-5.5-28.2-8.4c0 0 0 0 0 0s0 0 0 0c-2.1-.7-4.1-1.4-6.1-2.1c-10.5-3.5-16.1-14.8-12.6-25.3s14.8-16.1 25.3-12.6c2.5 .8 4.9 1.7 7.2 2.4c13.6 4.6 24 8.1 35.1 8.5c8.6 .3 16.5-1.6 21.4-4.7c4.1-2.5 6-5.5 5.9-10.5c0-2.9-.8-5-5.9-8.2c-6.3-4-15.4-6.9-28-10.7l-1.7-.5c-10.9-3.3-24.6-7.4-35.6-14c-12.7-7.7-24.6-20.5-24.7-40.7c-.1-21.1 11.8-35.7 25.8-43.9c6.9-4.1 14.5-6.8 22.2-8.5l0-14c0-11 9-20 20-20s20 9 20 20z"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div v-if="store.isLoading">
        <SkeletonLoader type="transactionList" :count="10" />
      </div>
      <EmptyList v-else-if="transactions.length === 0" />
      <div class="item-section" v-else>
        <div
          v-for="(transaction, index) in filteredTransactions"
          :key="index"
          class="item"
          tabindex="0"
          @click="navigateToTransactionDetail(transaction.memoId)"
        >
          <div class="detail">
            <div class="first-column">
              <div class="first-row">
                <span>{{ formatDateTime(transaction.date) }}</span>
                <span
                  :class="{
                    unpaid:
                      getTransactionStatus(transaction.status) === 'Unpaid',
                    pending:
                      getTransactionStatus(transaction.status) === 'Pending',
                    priority:
                      getTransactionStatus(transaction.status) === 'Pending' &&
                      transaction.isUrgent === 1,
                    completed:
                      getTransactionStatus(transaction.status) === 'Completed',
                    failed:
                      getTransactionStatus(transaction.status) === 'Rejected',
                  }"
                >
                  {{ getTransactionStatus(transaction.status) }}
                </span>
              </div>
              <div class="second-row">
                <span>{{ transaction.beneName }}&nbsp;</span>
                <span>{{ transaction.bank }}&nbsp;</span>
                <span>{{ transaction.bankAccountNumber }}</span>
              </div>
              <div class="number">
                <span>{{ transaction.memoId }}</span>
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
            <div
              class="third-column"
              :class="{
                pending:
                  getTransactionStatus(transaction.status) === 'Pending' &&
                  transaction.isUrgent === 0,
              }"
            >
              <Tooltip text="Send reminder" position="right">
                <font-awesome-icon
                  :icon="['fa', 'bell']"
                  @click.stop="handleReminder(transaction.memoId)"
                />
              </Tooltip>
            </div>
            <div
              class="third-column"
              :class="{
                priority:
                  getTransactionStatus(transaction.status) === 'Pending' &&
                  transaction.isUrgent === 1,
              }"
            >
              <Tooltip text="In priority processing" position="right">
                <font-awesome-icon
                  :icon="['fas', 'bell']"
                  @click.stop
                  @click=""
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <!-- <button class="btn-load">Load more</button> -->
    </div>
  </div>
  <div
    class="content-area"
    v-if="$isNotVerifiedUser(profileDetails.userStatus)"
  >
    <div class="account-locked">
      <h1>Access restricted</h1>
      <div v-if="$isUnverifiedUser(profileDetails.userStatus)">
        <span
          >Please complete your account verification to unlock this feature.
        </span>
        <p>For further assistance, please contact customer support.</p>
      </div>
      <div v-if="$isPendingUser(profileDetails.userStatus)">
        <span
          >Kindly hold on while your account is awaiting management
          approval.</span
        >
        <p>For further assistance, please contact customer support.</p>
      </div>
      <div v-if="$isRejectedUser(profileDetails.userStatus)">
        <span>Your account verification has been rejected.</span>

        <p>For further assistance, please contact customer support.</p>
      </div>
      <p></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  useStore,
  useProfileStore,
  useTransactionStore,
  useAuthStore,
  useAlertStore,
} from "@/stores/index";
import { useRouter } from "vue-router";
import {
  formatNumber,
  getTransactionStatus,
  formatDateTime,
} from "@/utils/transactionUtils";
import SkeletonLoader from "@/views/SkeletonLoader.vue";
import EmptyList from "@/views/EmptyList.vue";
import Tooltip from "@/components/Tooltip.vue";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";

const router = useRouter();
const store = useStore();
const profileStore = useProfileStore();
const transactionStore = useTransactionStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();

const transactions = ref([]);
const searchQuery = ref("");
const profileDetails = reactive({});

onMounted(async () => {
  await profileStore.getProfileDetail();
  Object.assign(profileDetails, profileStore.profileDetails); // Assign store data to reactive object
  console.log(profileDetails);
  if (profileDetails.userStatus !== 3) {
    return;
  }
  const response = await transactionStore.getTransactionList();
  transactions.value = response.trxns || [];
  transactions.value.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const filteredTransactions = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return transactions.value.filter((transaction) => {
    return (
      formatDateTime(transaction.date).toLowerCase().includes(query) ||
      getTransactionStatus(transaction.status).toLowerCase().includes(query) ||
      transaction.beneName.toLowerCase().includes(query) ||
      transaction.bank.toLowerCase().includes(query) ||
      transaction.bankAccountNumber.toLowerCase().includes(query) ||
      transaction.memoId.toLowerCase().includes(query) ||
      transaction.payAmount.toString().includes(query) ||
      transaction.payCurrency.toLowerCase().includes(query) ||
      transaction.getAmount.toString().includes(query) ||
      transaction.getCurrency.toLowerCase().includes(query)
    );
  });
});

const handleReminder = async (memoId) => {
  try {
    const form = {
      username: authStore.username,
      memoId: memoId,
    };

    const response = await transactionStore.sendReminder(form);

    if (response.status === 1) {
      alertStore.alert("success", "We have received your reminder.");

      const response = await transactionStore.getTransactionList();
      transactions.value = response.trxns || [];
      transactions.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const navigateToTransactionDetail = async (memoId) => {
  const transaction = transactions.value.find((txn) => txn.memoId === memoId);

  if (transaction) {
    router.push({
      name: "transaction-detail",
      params: { memoId: transaction.memoId },
    });
  } else {
    console.error("Transaction not found with memoId:", memoId);
  }
};

const navigateToAddTransaction = () => {
  router.push({ name: "addtransaction" });
};
</script>

<style scoped>
.content-area {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--size-24);
  min-height: calc(100vh - 140px);
}

.transaction {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.transaction .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-12) 0;
  border-bottom: 1px solid var(--light-grey);
}

.transaction .title a {
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
}

.transaction .search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction .search-section .input-group {
  min-width: 79%;
  max-width: 79%;
  position: relative;
}

.transaction .search-section .input-group input {
  min-width: 100%;
  max-width: 100%;
  padding-right: var(--size-48);
}

.transaction .search-section .input-group input::placeholder {
  color: var(--grey);
}

.transaction .search-section .input-group svg {
  min-width: var(--size-24);
  max-width: var(--size-24);
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
  fill: var(--cool-blue);
  cursor: pointer;
}

.transaction .search-section .button-group {
  min-width: 20%;
  max-width: 20%;
}

.transaction .search-section .button-group .btn-blue .desktop {
  display: flex;
  font-weight: var(--semi-bold);
}

.transaction .search-section .button-group .btn-blue .mobile {
  display: none;
}

.transaction .item-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.transaction .item {
  display: flex;
  align-items: center;
  width: calc(100% + var(--size-16));
  padding: var(--size-8);
  cursor: pointer;
  border-radius: var(--border-md);
}

.transaction .item:hover {
  background: var(--sky-blue);
  margin-inline: -16px;
}

.transaction .item .detail {
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--size-12);
}

.transaction .item .detail .first-column {
  flex-grow: 1;
}

.transaction .item .detail .first-column .first-row {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.transaction .item .detail .first-column .first-row span:nth-child(1) {
  font-weight: 700;
}

.transaction .item .detail .first-column .first-row span:nth-child(2) {
  font-weight: var(--semi-bold);
  font-style: italic;
  font-size: var(--text-sm);
}

.transaction .item .detail .first-column .first-row span:nth-child(2).pending {
  color: var(--midnight-violet);
}

.transaction .item .detail .first-column .first-row span:nth-child(2).priority {
  color: var(--dark-yellow);
}

.transaction
  .item
  .detail
  .first-column
  .first-row
  span:nth-child(2).completed {
  color: var(--pastel-green);
}

.transaction .item .detail .first-column .first-row span:nth-child(2).failed,
.transaction .item .detail .first-column .first-row span:nth-child(2).unpaid {
  color: var(--dark-crimson-red);
}

.transaction .item .detail .first-column .second-row {
  display: flex;
}

.transaction .item .detail .first-column .second-row span:nth-child(1) {
  text-transform: uppercase;
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
}

.transaction .item .detail .first-column .number {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  font-size: var(--text-sm);
}

.transaction .item .detail .second-column {
  display: flex;
  flex-direction: column;
  text-align: end;
}

.transaction .item .detail .second-column .first-row {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.transaction .item .detail .second-column .second-row {
  font-size: var(--text-sm);
}

.transaction .item .detail .third-column {
  display: none;
}

.transaction .item:hover .detail .third-column {
  display: none;
}

.transaction .item .detail .third-column.pending svg {
  color: var(--midnight-violet);
}

.transaction .item:hover .detail .third-column.pending {
  display: block;
}

.transaction .item .detail .third-column.priority svg {
  color: var(--dark-yellow);
}

.transaction .item:hover .detail .third-column.priority {
  display: block;
}

.transaction .item:hover .detail .third-column .tooltip {
  display: block;
}

.transaction .item .detail .third-column svg {
  min-height: var(--size-32);
  max-height: var(--size-32);
  min-width: var(--size-32);
  max-width: var(--size-32);
}

@media (max-width: 767px) {
  .transaction .search-section .button-group .btn-blue .desktop {
    display: none;
  }

  .transaction .search-section .button-group .btn-blue .mobile {
    display: flex;
  }

  .transaction .search-section .button-group .btn-blue .mobile svg {
    min-width: var(--size-24);
    max-width: var(--size-24);
    fill: #fff;
  }

  .transaction .search-section .input-group {
    min-width: calc(100% - 56px);
    max-width: calc(100% - 56px);
  }

  .transaction .search-section .button-group {
    min-width: var(--size-48);
    max-width: var(--size-48);
  }

  .transaction .item .detail {
    justify-content: space-between;
  }

  .transaction .item .detail .first-column {
    justify-content: space-between;
    max-width: 70%;
    white-space: nowrap;
  }

  .transaction .item .detail .first-column .second-row span:nth-child(2) {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .transaction .item .detail .first-column .second-row span:nth-child(3) {
    display: none;
  }
}

@media (max-width: 1279px) {
  .transaction .item:hover .detail .third-column {
    display: none !important;
  }
}

.account-locked {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-12);
  text-align: center;
  white-space: nowrap;
  min-width: 300px;
}

.account-locked h1 {
  font-family: "Rubik Dirt", serif;
  color: var(--black);
  font-size: var(--size-48);
  font-weight: 400;
}

.account-locked div {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.account-locked div span {
  font-family: "Archivo Black", serif;
  color: var(--grey);
  font-weight: var(--semi-bold);
}

@media (max-width: 1023px) {
  .account-locked {
    gap: var(--size-8);
  }

  .account-locked h1 {
    font-size: var(--size-40);
  }
}

@media (max-width: 767px) {
  .account-locked {
    white-space: normal;
  }
}
</style>
