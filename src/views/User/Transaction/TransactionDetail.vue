<template>
  <div class="content-area">
    <div class="transaction">
      <button class="btn-round" @click="handleBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
          />
        </svg>
      </button>
      <div class="invoice" v-if="transactionDetail && beneficiaryDetail">
        <div class="user-section">
          <div>
            <span class="icon-round">
              {{ getInitials(transactionDetail.beneName) }}
              <img :src="getCurrencyImagePath(beneficiaryDetail.currency)" />
            </span>
            <span>{{ transactionDetail.beneName }}</span>
          </div>
          <ButtonAPI
            v-if="
              transactionDetail.status === 3 && transactionDetail.isUrgent === 0
            "
            @click="handleReminder"
            class="btn-blue"
            :disabled="store.isLoading"
            :customLoader="true"
          >
            Send reminder
          </ButtonAPI>
          <ButtonAPI
            v-if="transactionDetail.status === 1 && !acknowledge"
            @click="store.openModal"
            class="btn-moneyreceived"
            :disabled="store.isLoading"
            :customLoader="true"
          >
            Money received
          </ButtonAPI>
          <div
            v-if="transactionDetail.status === 1 && acknowledge"
            class="money-received"
          >
            Money received
          </div>
          <Modal
            v-if="transactionDetail.status === 1"
            :isModalOpen="store.isModalOpen"
            :title="'Customer acknowledgement'"
            :showAction="true"
            @close="store.closeModal"
            @submit="handleAcknowledgement"
            @cancel="store.closeModal"
          >
            <template #body>
              <p>
                By confirming this action, you acknowledge that the full amount
                has been received and confirm that no further action is
                required.
              </p>
            </template>
          </Modal>
        </div>
        <div class="item-section">
          <div class="detail info">
            <div class="title">Beneficiary Information</div>
            <div class="item-group">
              <div class="item">
                <span>Account holder name</span>
                <span>{{ transactionDetail.beneName }}</span>
              </div>
              <div class="item">
                <span>Bank name</span>
                <span>{{ transactionDetail.bank }}</span>
              </div>
              <div class="item">
                <span>Bank account number</span>
                <span>{{ transactionDetail.bankAccountNumber }}</span>
              </div>
              <div class="item">
                <span>Remittance purpose</span>
                <span>{{
                  getRemittancePurpose(
                    beneficiaryDetail.purposeOfIntendedTransactions
                  )
                }}</span>
              </div>
              <div class="item">
                <span>Source of income</span>
                <span>{{ getFundSource(beneficiaryDetail.fundSource) }}</span>
              </div>
            </div>
          </div>
          <div class="detail summary">
            <div class="title">Transaction Summary</div>
            <div class="item-group">
              <div class="item">
                <span>Memo ID</span>
                <span>{{ transactionDetail.memoId }}</span>
              </div>
              <div class="item">
                <span>Date & time</span>
                <span>{{ formatDateTime(transactionDetail.date) }}</span>
              </div>
              <div class="item">
                <span>Sending amount</span>
                <span>
                  {{
                    formatNumber(
                      transactionDetail.payAmount - transactionDetail.fee
                    )
                  }}
                  {{ transactionDetail.payCurrency }}</span
                >
              </div>
              <div class="item">
                <span>Processing fees</span>
                <span
                  >{{ transactionDetail.fee }}
                  {{ transactionDetail.payCurrency }}</span
                >
              </div>
              <div class="item">
                <span>Receiving amount</span>
                <span>
                  {{ formatNumber(transactionDetail.getAmount) }}
                  {{ transactionDetail.getCurrency }}</span
                >
              </div>
              <div class="item">
                <span>Exchange rate</span>
                <span>
                  1 {{ transactionDetail.payCurrency }} =
                  {{ transactionDetail.rate }}
                  {{ transactionDetail.getCurrency }}</span
                >
              </div>
              <div class="item">
                <span>
                  {{
                    transactionDetail.status === 1
                      ? "Amount paid"
                      : "Amount to be paid"
                  }}
                </span>
                <span>
                  {{ formatNumber(transactionDetail.payAmount) }}
                  {{ transactionDetail.payCurrency }}
                </span>
              </div>

              <div class="item">
                <Tooltip
                  text="In priority processing"
                  v-if="
                    transactionDetail.isUrgent === 1 &&
                    transactionDetail.status === 3
                  "
                >
                  <div
                    :class="{
                      priority:
                        transactionDetail.isUrgent === 1 &&
                        transactionDetail.status === 3,
                    }"
                  >
                    {{ getTransactionStatus(transactionDetail.status) }}
                  </div>
                </Tooltip>
                <div
                  v-else
                  :class="{
                    failed: transactionDetail.status === 0,
                    completed: transactionDetail.status === 1,
                    unpaid: transactionDetail.status === 2,
                    pending: transactionDetail.status === 3,
                    cancelled: transactionDetail.status === 4,
                  }"
                >
                  {{ getTransactionStatus(transactionDetail.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <SkeletonLoader type="transactionDetail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useAlertStore,
  useBeneficiaryStore,
  useTransactionStore,
  useStore,
  useAuthStore,
} from "@/stores/index.js";
import {
  formatNumber,
  getTransactionStatus,
  formatDateTime,
} from "@/utils/transactionUtils";
import {
  getInitials,
  getRemittancePurpose,
  getFundSource,
} from "@/utils/beneficiaryUtils";
import { getCurrencyImagePath } from "@/utils/currencyUtils";
import { ButtonAPI } from "@/components/Form";
import Tooltip from "@/components/Tooltip.vue";
import SkeletonLoader from "@/views/SkeletonLoader.vue";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import Modal from "@/components/Modal/Modal.vue";

const route = useRoute();
const router = useRouter();

const memoId = route.params.memoId;
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();
const store = useStore();
const authStore = useAuthStore();

const alertStore = useAlertStore();
const transactionDetail = ref(null);
const beneficiaryDetail = ref(null);
const acknowledge = ref(false);

const handleReminder = async () => {
  try {
    const form = {
      username: authStore.username,
      memoId: memoId,
    };

    const response = await transactionStore.sendReminder(form);

    if (response.status === 1) {
      alertStore.alert("success", "We have received your reminder.");

      const updatedTransactionResponse =
        await transactionStore.getTransactionDetail(memoId);
      if (updatedTransactionResponse?.trx) {
        transactionDetail.value = updatedTransactionResponse.trx;

        const beneficiaryId = transactionDetail.value.beneficiaryId;
        const beneficiaryResponse = await beneficiaryStore.getBeneficiaryDetail(
          beneficiaryId
        );
        if (beneficiaryResponse?.beneDetails) {
          beneficiaryDetail.value = beneficiaryResponse.beneDetails;
        }
      }
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleAcknowledgement = async () => {
  try {
    const form = {
      username: authStore.username,
      memoId: memoId,
    };

    const response = await transactionStore.sendAcknowledgement(form);

    if (response.status === 1) {
      await transactionStore.getTransactionDetail(memoId);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  } finally {
    store.closeModal();
  }
};

onMounted(async () => {
  try {
    // Fetch transaction details
    const response = await transactionStore.getTransactionDetail(memoId);
    if (response?.trx) {
      transactionDetail.value = response.trx;

      acknowledge.value = response.acknowledge;

      // Fetch beneficiary details using beneficiaryId
      const beneficiaryId = transactionDetail.value.beneficiaryId;
      const beneficiaryResponse = await beneficiaryStore.getBeneficiaryDetail(
        beneficiaryId
      );

      if (beneficiaryResponse?.beneDetails) {
        beneficiaryDetail.value = beneficiaryResponse.beneDetails;
      } else {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
      }
    } else {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
});

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

.transaction .user-section .money-received {
  color: var(--black);
  font-weight: var(--semi-bold);
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

.transaction .item-section .detail.summary .item-group .item:nth-child(6) {
  border-bottom: 1px solid var(--light-grey);
  padding-bottom: var(--size-24);
}

.transaction .item-section .detail.summary .item-group .item:nth-child(7) {
  margin-bottom: var(--size-24);
}

.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(7)
  span:nth-child(2) {
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
}

.transaction .item-section .detail.summary .item-group .item:nth-child(8) {
  display: flex;
  justify-content: end;
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
  margin-bottom: 0;
}

.transaction .item-section .detail.summary .item-group .item:nth-child(8) {
  display: flex;
  align-items: start;
  justify-content: end;
  margin-bottom: 0;
}

.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8)
  .priority {
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
  cursor: pointer;
  color: var(--dark-yellow);
}

.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8)
  .pending {
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
  color: var(--midnight-violet);
}

.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8)
  .completed {
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
  color: var(--pastel-green);
}

.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8)
  .failed,
.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8)
  .unpaid,
.transaction
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8)
  .cancelled {
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
  color: var(--dark-crimson-red);
}

.transaction .item-section .detail.summary .item-group .item:nth-child(8) div {
  font-weight: var(--semi-bold);
}

@media (max-width: 767px) {
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

  .transaction .item-section .detail.summary .item-group .item:nth-child(6) {
    border-bottom: 1px solid var(--light-grey);
    padding-bottom: var(--size-12);
  }
}
</style>
