<template>
  <div class="content-area">
    <div class="transaction">
      <div class="title">
        <h3>Transaction History</h3>
      </div>
      <div class="search-section">
        <div class="input-group">
          <input type="text" placeholder="Search past transactions" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            />
          </svg>
        </div>
        <div class="button-group">
          <button class="btn-blue standard-button" @click="removeFocus">
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
      <div class="item-section">
        <div
          v-for="(transaction, index) in transactions"
          :key="index"
          class="item"
          tabindex="0"
        >
          <div class="detail">
            <div class="first-column">
              <div class="first-row">
                <span>{{ transaction.date }}</span>
                <span
                  :class="{
                    unpaid: transaction.status === 'Unpaid',
                    pending: transaction.status.includes('Pending'),
                    completed: transaction.status === 'Completed',
                    failed: transaction.status === 'Failed',
                  }"
                  >{{ transaction.status }}</span
                >
              </div>
              <div class="second-row">
                <span>{{ transaction.beneficiaryName }}&nbsp;</span>
                <span>{{ transaction.beneficiaryBankName }}&nbsp;</span>
                <span>{{ transaction.beneficiaryBankAccountNumber }}</span>
              </div>
              <div class="number">
                <span>{{ transaction.number }}</span>
              </div>
            </div>
            <div class="second-column">
              <div class="first-row">
                {{ transaction.sendingAmount }}
              </div>
              <div class="second-row">{{ transaction.receivingAmount }}</div>
            </div>
          </div>
        </div>
      </div>
      <button class="btn-load">Load more</button>
    </div>
  </div>
</template>

<script setup>
import { useTransactionStore } from "@/stores/transactionStore";
import { storeToRefs } from "pinia";
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
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
  width: calc(100% + 16px);
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
  justify-content: space-between;
  width: 100%;
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
  color: var(--midnight-violet);
  font-size: var(--text-sm);
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
  justify-content: center;
  text-align: end;
}

.transaction .item .detail .second-column .first-row {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.transaction .item .detail .second-column .second-row {
  font-size: var(--text-sm);
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

  .transaction .item .detail .first-column {
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
</style>
