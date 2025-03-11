<template>
  <div class="skeleton-loader">
    <template v-if="type === 'dashboardTransaction'">
      <div class="dashboardTransaction">
        <div class="item-section">
          <div class="item" v-for="index in count" :key="index">
            <div class="icon-round skeleton"></div>
            <div class="detail">
              <div class="first-column">
                <div class="first-row skeleton text-md h-md"></div>
                <div class="second-row skeleton text-xl h-sm"></div>
              </div>
              <div class="second-column">
                <div class="first-row skeleton text-sm h-md"></div>
                <div class="second-row skeleton text-sm h-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="type === 'dashboardCurrentRates'">
      <div class="dashboardCurrency">
        <div class="item-section">
          <div class="item" v-for="index in count" :key="index">
            <div class="country">
              <div class="icon-round skeleton"></div>
            </div>

            <div class="skeleton text-sm h-sm"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="type === 'transactionList'">
      <div class="transactionList">
        <div class="item-section">
          <div class="item" v-for="index in count" :key="index">
            <div class="detail">
              <div class="first-column">
                <div class="first-row">
                  <span class="skeleton text-xxl h-md"></span>
                  <span> </span>
                </div>
                <div class="second-row">
                  <span class="skeleton text-xxxl h-md"></span>
                </div>
                <div class="number">
                  <span class="skeleton text-md h-sm"></span>
                </div>
              </div>
              <div class="second-column">
                <div class="first-row skeleton text-sm h-md"></div>
                <div class="second-row skeleton text-sm h-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="type === 'beneficiaryList'">
      <div class="beneficiaryList">
        <div class="payment-category">
          <h4 class="skeleton text-xl h-sm">&nbsp;</h4>
          <div class="item-section">
            <div class="item" v-for="index in count" :key="index">
              <div class="detail">
                <span class="icon-round skeleton"> </span>
                <span class="name skeleton text-md h-md"></span>

                <span class="skeleton text-sm h-sm"> </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="type === 'beneficiaryListTransaction'">
      <div class="beneficiaryListTransaction">
        <div class="payment-category">
          <h4 class="skeleton text-xl"></h4>
          <div class="item-section">
            <div class="item" v-for="index in count" :key="index">
              <div class="detail">
                <span class="icon-round skeleton"> </span>
                <span class="name skeleton text-md h-md"></span>

                <span class="skeleton text-sm h-sm"> </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="type === 'transactionDetail'">
      <div class="transactionDetail">
        <div class="invoice">
          <div class="user-section">
            <div>
              <span class="icon-round skeleton"> </span>
              <span class="skeleton text-lg h-lg"> </span>
            </div>
          </div>
          <div class="item-section">
            <div class="detail info">
              <div class="title">Beneficiary Information</div>
              <div class="item-group">
                <div class="item">
                  <span>Account holder name</span>
                  <span class="skeleton text-xl h-md"> </span>
                </div>
                <div class="item">
                  <span>Bank name</span>
                  <span class="skeleton text-xl h-md"> </span>
                </div>
                <div class="item">
                  <span>Bank account number</span>
                  <span class="skeleton text-md h-md"> </span>
                </div>
                <div class="item">
                  <span>Remittance purpose</span>
                  <span class="skeleton text-lg h-md"> </span>
                </div>
                <div class="item">
                  <span>Source of income</span>
                  <span class="skeleton text-lg h-md"> </span>
                </div>
              </div>
            </div>
            <div class="detail summary">
              <div class="title">Transaction Summary</div>
              <div class="item-group">
                <div class="item">
                  <span>Memo ID</span>
                  <span class="skeleton text-md h-md"> </span>
                </div>
                <div class="item">
                  <span>Date & time</span>
                  <span class="skeleton text-lg h-md"> </span>
                </div>
                <div class="item">
                  <span>Sending amount</span>
                  <span class="skeleton text-md h-md"> </span>
                </div>
                <div class="item">
                  <span>Processing fees</span>
                  <span class="skeleton text-md h-md"> </span>
                </div>
                <div class="item">
                  <span>Receiving amount</span>
                  <span class="skeleton text-md h-md"> </span>
                </div>
                <div class="item">
                  <span>Exchange rate</span>
                  <span class="skeleton text-lg h-md"> </span>
                </div>
                <div class="item">
                  <span>Amount paid</span>
                  <span class="skeleton text-md h-lg"> </span>
                </div>

                <div class="item">
                  <div class="skeleton text-md h-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="type === 'beneficiaryDetail'">
      <div class="beneficiaryDetail">
        <div class="profile-section">
          <div class="user-group">
            <span class="icon-round"> </span>
            <div>
              <span class="skeleton text-lg h-lg"></span>
            </div>
            <div></div>
          </div>
          <div class="button-group">
            <button class="btn-red skeleton">Send money</button>
            <button class="btn-delete skeleton">Delete</button>
          </div>
        </div>

        <div class="item-section">
          <div class="tabs">
            <button class="active">Details</button>
            <button>Transactions</button>
          </div>

          <div class="detail">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>
        </div>
      </div>
    </template>

    <template v-if="type === 'profileDetail'">
      <div class="profileDetail">
        <div class="user-section">
          <div class="user-group">
            <span class="icon-round skeleton"></span>
            <span class="skeleton text-lg h-md"></span>
          </div>
        </div>

        <div class="item-section">
          <div class="item">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, required: true },
  count: { type: Number, default: 5 }, // Number of skeleton rows
});
</script>

<style scoped>
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  background: var(--lighter-grey);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: var(--border-sm);
}

.icon-round.skeleton {
  border-radius: var(--border-circle);
}

.text-sm {
  width: var(--size-64);
}

.text-md {
  width: var(--size-96);
}

.text-lg {
  width: var(--size-144);
}

.text-xl {
  width: var(--size-176);
}

.text-xxl {
  width: var(--size-192);
}

.text-xxxl {
  width: var(--size-240);
}

.h-sm {
  height: 14px;
  border-radius: var(--size-4);
}

.h-md {
  height: 16px;
}

.h-lg {
  height: 19px;
}

@media (max-width: 1023px) {
  .h-sm {
    height: 13px;
    border-radius: var(--size-4);
  }

  .h-md {
    height: 15px;
  }

  .h-lg {
    height: 18px;
  }
}

svg {
  width: var(--size-48);
  height: var(--size-48);
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

circle {
  fill: none;
  stroke: var(--grey);
  stroke-width: 4;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
}

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}

.icon-round {
  cursor: unset;
}

/* Dashboard transaction */
.dashboardTransaction .item-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: var(--size-4) 0;
}

.dashboardTransaction .item {
  display: flex;
  align-items: center;
  width: calc(100% + var(--size-16));
  padding: var(--size-8);
  border-radius: var(--border-md);
}

.dashboardTransaction .item .icon-round {
  margin-right: var(--size-12);
}

.dashboardTransaction .item .detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.dashboardTransaction .item .detail .first-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--size-8);
}

.dashboardTransaction .item .detail .first-column .first-row {
  display: flex;
  align-items: center;
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.dashboardTransaction .item .detail .first-column .second-row {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  font-size: var(--text-sm);
}

.dashboardTransaction .item .detail .second-column {
  display: flex;
  flex-direction: column;
  text-align: end;
  gap: var(--size-8);
}

.dashboardTransaction .item .detail .second-column .first-row {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.dashboardTransaction .item .detail .second-column .second-row {
  font-size: var(--text-sm);
}
/* Dashboard transaction */

/* Dashboard current rates */
.dashboardCurrency .item-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: var(--size-4) 0;
}

.dashboardCurrency .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% + var(--size-16));
  padding: var(--size-8);
  border-radius: var(--border-md);
}

.dashboardCurrency .item .country {
  display: flex;
  align-items: center;
  position: relative;
  gap: var(--size-16);
}

.dashboardCurrency .item .country .name {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.dashboardCurrency .item .exchange-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--border-circle);
  background: var(--white);
  padding: var(--size-8);
  border: 1px solid var(--light-grey);
}

.dashboardCurrency .item .rate {
  font-size: var(--text-sm);
}
/* Dashboard current rates */

/* Transaction list */

.transactionList .item-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.transactionList .item {
  display: flex;
  align-items: center;
  width: calc(100% + var(--size-16));
  padding: var(--size-8);
  border-radius: var(--border-md);
}

.transactionList .item .detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.transactionList .item .detail .first-column {
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
}

.transactionList .item .detail .first-column .first-row {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.transactionList .item .detail .first-column .second-row {
  display: flex;
}

.transactionList .item .detail .first-column .second-row span:nth-child(1) {
  text-transform: uppercase;
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
}

.transactionList .item .detail .first-column .number {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  font-size: var(--text-sm);
}

.transactionList .item .detail .second-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: end;
  gap: var(--size-8);
}

.transactionList .item .detail .second-column .first-row {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

.transactionList .item .detail .second-column .second-row {
  font-size: var(--text-sm);
}
/* Transaction list */

/* Beneficiary list */
.beneficiaryList {
  padding: var(--size-8) 0;
}

.beneficiaryList .payment-category h4 {
  margin-top: 3px;
  margin-bottom: 11px;
}

.beneficiaryList .item-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-content: center;
  place-items: center;
  gap: var(--size-16);
}

.beneficiaryList .item-section .item {
  position: relative;
  min-width: 100%;
  max-width: 100%;
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.beneficiaryList .item-section .item .favourite-group {
  display: flex;
  justify-content: end;
  align-items: center;
}

.beneficiaryList .item-section .item .favourite {
  position: absolute;
  top: var(--size-8);
  right: var(--size-8);
}

.beneficiaryList .item-section .item .detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--size-24) 0;
  gap: var(--size-4);
}

.beneficiaryList .item-section .item .detail .icon-round {
  position: relative;
  min-width: var(--size-60);
  max-width: var(--size-60);
  min-height: var(--size-60);
  max-height: var(--size-60);
  font-size: var(--text-xl);
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
  margin-bottom: var(--size-8);
}

.beneficiaryList .item-section .item .detail .icon-round img {
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

.beneficiaryList .item-section .item .detail span:nth-child(2) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  margin-bottom: var(--size-4);
}

.beneficiaryList .item-section .item .detail span:nth-child(3) {
  font-size: var(--text-sm);
  color: var(--grey);
}

@media (max-width: 1023px) {
  .beneficiaryList .item-section {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

@media (max-width: 767px) {
  .beneficiaryList .item-section {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .beneficiaryList .item-section .item .detail {
    padding: var(--size-12) 0;
  }

  .beneficiaryList .item-section .item .favourite {
    top: var(--size-4);
    right: var(--size-4);
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
  }

  .beneficiaryList .item-section .item .detail .icon-round {
    min-width: var(--size-48);
    max-width: var(--size-48);
    min-height: var(--size-48);
    max-height: var(--size-48);
    font-size: var(--text-lg);
    margin-bottom: var(--size-8);
  }

  .beneficiaryList .item-section .item .detail .icon-round img {
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
  }
}
/* Beneficiary list */

/* Beneficiary list transaction */
.beneficiaryListTransaction .payment-category {
  padding: var(--size-8) 0;
}

.beneficiaryListTransaction .payment-category h4 {
  margin-bottom: var(--size-8);
}

.beneficiaryListTransaction .item-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  place-items: center;
  gap: var(--size-16);
}

.beneficiaryListTransaction .item-section .item {
  position: relative;
  min-width: 100%;
  max-width: 100%;
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.beneficiaryListTransaction .item-section .item .favourite-group {
  display: flex;
  justify-content: end;
  align-items: center;
}

.beneficiaryListTransaction .item-section .item .favourite {
  position: absolute;
  top: var(--size-8);
  right: var(--size-8);
}

.beneficiaryListTransaction .item-section .item .detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--size-24) 0;
  gap: var(--size-4);
}

.beneficiaryListTransaction .item-section .item .detail .icon-round {
  position: relative;
  min-width: var(--size-60);
  max-width: var(--size-60);
  min-height: var(--size-60);
  max-height: var(--size-60);
  font-size: var(--text-xl);
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
  margin-bottom: var(--size-8);
}

.beneficiaryListTransaction .item-section .item .detail .icon-round img {
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

.beneficiaryListTransaction .item-section .item .detail span:nth-child(2) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  margin-bottom: var(--size-4);
}

.beneficiaryListTransaction .item-section .item .detail span:nth-child(3) {
  font-size: var(--text-sm);
  color: var(--grey);
}

@media (max-width: 767px) {
  .beneficiaryListTransaction .item-section {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .beneficiaryListTransaction .item-section .item .detail {
    padding: var(--size-12) 0;
  }

  .beneficiaryListTransaction .item-section .item .favourite {
    top: var(--size-4);
    right: var(--size-4);
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
  }

  .beneficiaryListTransaction .item-section .item .detail .icon-round {
    min-width: var(--size-48);
    max-width: var(--size-48);
    min-height: var(--size-48);
    max-height: var(--size-48);
    font-size: var(--text-lg);
    margin-bottom: var(--size-8);
  }

  .beneficiaryListTransaction .item-section .item .detail .icon-round img {
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
  }
}
/* Beneficiary list transaction */

/* Transaction detail */
.transactionDetail .invoice {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.transactionDetail .user-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-20) var(--size-24);
  border-bottom: 1px solid var(--light-grey);
}

.transactionDetail .user-section .icon-round {
  position: relative;
  min-width: var(--size-60);
  max-width: var(--size-60);
  min-height: var(--size-60);
  max-height: var(--size-60);
  font-size: var(--text-xl);
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
}

.transactionDetail .user-section .icon-round img {
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

.transactionDetail .user-section span {
  color: var(--slate-blue);
  font-size: var(--text-lg);
  font-weight: var(--semi-bold);
}

.transactionDetail .user-section div {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  color: var(--grey);
}

.transactionDetail .user-section .btn-blue {
  padding: var(--size-dropdown-item);
}

.transactionDetail .item-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.transactionDetail .item-section .detail .title {
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
  margin-bottom: var(--size-16);
  padding-left: var(--size-24);
  padding-top: var(--size-24);
}

.transactionDetail .item-section .detail .item-group {
  row-gap: var(--size-24);
  padding: 0 var(--size-24);
  padding-bottom: var(--size-24);
  gap: var(--size-24);
}

.transactionDetail .item-section .detail .item-group .item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: var(--size-12);
}

.transactionDetail .item-section .detail .item-group .item span {
  display: flex;
}

.transactionDetail .item-section .detail .item-group .item span:nth-child(1) {
  color: var(--grey);
}

.transactionDetail .item-section .detail .item-group .item span:nth-child(2) {
  justify-content: end;
  text-align: end;
  margin: auto 0 auto auto;
}

.transactionDetail
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(6) {
  border-bottom: 1px solid var(--light-grey);
  padding-bottom: var(--size-24);
}

.transactionDetail
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(7) {
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

.transactionDetail
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8) {
  display: flex;
  justify-content: end;
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
  margin-bottom: 0;
}

.transactionDetail
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8) {
  display: flex;
  align-items: start;
  justify-content: end;
  margin-bottom: 0;
}

.transactionDetail
  .item-section
  .detail.summary
  .item-group
  .item:nth-child(8)
  div {
  font-weight: var(--semi-bold);
}

@media (max-width: 767px) {
  .transactionDetail .user-section {
    padding: var(--size-16) var(--size-12);
  }

  .transactionDetail .user-section div span:nth-child(2) {
    display: none;
  }

  .transactionDetail .item-section {
    grid-template-columns: 1fr;
  }

  .transactionDetail .item-section .detail .item-group .item:nth-child(8) {
    justify-content: start !important;
  }

  .transactionDetail .item-section .detail .item-group .item span:nth-child(2) {
    margin: 3px 0;
  }

  .transactionDetail .item-section .detail .title {
    margin-bottom: var(--size-12);
    padding-left: var(--size-16);
    padding-top: var(--size-16);
  }

  .transactionDetail .item-section .detail .item-group {
    padding: 0 var(--size-16);
    padding-bottom: var(--size-16);
    gap: 0;
  }

  .transactionDetail .item-section .detail .item-group .item {
    grid-template-columns: 1fr;
  }

  .transactionDetail .item-section .detail .item-group .item span:nth-child(2) {
    justify-content: start;
    text-align: start;
  }

  .transactionDetail
    .item-section
    .detail.summary
    .item-group
    .item:nth-child(6) {
    border-bottom: 1px solid var(--light-grey);
    padding-bottom: var(--size-12);
  }
}
/* Transaction detail */

/* Beneficiary detail */
.beneficiaryDetail .profile-section {
  display: flex;
  flex-direction: column;
}

.beneficiaryDetail .profile-section .user-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--size-12);
}

.beneficiaryDetail .profile-section .user-group .icon-round {
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

.beneficiaryDetail .profile-section .user-group .icon-round:hover {
  background: var(--sky-blue);
}

.beneficiaryDetail .profile-section .user-group .icon-round img {
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

.beneficiaryDetail .profile-section .user-group span {
  display: flex;
  align-items: center;
  color: var(--slate-blue);
  font-size: var(--text-lg);
  font-weight: var(--semi-bold);
}

.beneficiaryDetail .profile-section .user-group span.h-lg {
  height: var(--size-24);
}

.beneficiaryDetail .profile-section .user-group div {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  color: var(--grey);
}

.beneficiaryDetail .button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--size-12);
}

.beneficiaryDetail .button-group .btn-red {
  padding: var(--size-dropdown-item);
  color: transparent;
  cursor: unset;
}

.beneficiaryDetail .button-group .btn-red.skeleton {
  border-radius: var(--border-md);
}

.beneficiaryDetail .button-group .btn-delete {
  padding: var(--size-dropdown-item);
  border-radius: var(--border-md);
  font-weight: var(--semi-bold);
  color: transparent;
  cursor: unset;
}

.beneficiaryDetail .button-group .btn-delete.skeleton {
  border-radius: var(--border-md);
  border: unset;
}

.beneficiaryDetail .item-section .tabs {
  display: flex;
  gap: var(--size-8);
  margin-bottom: var(--size-12);
}

.beneficiaryDetail .item-section .tabs button {
  padding: var(--size-8);
  cursor: unset;
}

.beneficiaryDetail .item-section .tabs button.active {
  border-bottom: 1px solid var(--black);
  font-weight: var(--semi-bold);
}

.beneficiaryDetail .item-section .tabs button:hover {
  font-weight: var(--semi-bold);
}

.beneficiaryDetail .item-section .detail {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
  height: calc(100vh - 416.67px);
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 767px) {
  .beneficiaryDetail .item-section .detail {
    height: calc(100vh - 396.67px);
  }

  .beneficiaryDetail .item-section .detail svg {
    width: var(--size-32);
    height: var(--size-32);
  }
}

/* Beneficiary detail */

/* Profile detail */
.profileDetail .user-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--light-grey);
  border-top-left-radius: var(--border-md);
  border-top-right-radius: var(--border-md);
  padding: var(--size-24);
}

.profileDetail .user-section .user-group {
  display: flex;
  align-items: center;
}

.profileDetail .user-section .user-group .icon-round {
  min-width: var(--size-60);
  max-width: var(--size-60);
  min-height: var(--size-60);
  max-height: var(--size-60);
  font-size: var(--text-xl);
  font-weight: var(--semi-bold);
  color: var(--sky-blue);
  margin-right: var(--size-12);
}

.profileDetail .user-section .user-group span:nth-child(2) {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
  margin-right: var(--size-8);
}

.profileDetail .user-section .user-group span:nth-child(3) {
  display: flex;
  gap: var(--size-8);
}

.profileDetail .user-section .user-group span:nth-child(3) .tooltip svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  color: var(--black);
}

.profileDetail .user-section button {
  border-radius: var(--border-md);
  padding: var(--size-dropdown-item);
}

.profileDetail {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

/* .profileDetail .item-section {
  display: flex;
  justify-content: center;
  align-items: center;
} */

.profileDetail .item-section .item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 230.38px;
}

@media (max-width: 767px) {
  .profileDetail .user-section {
    padding: var(--size-16);
  }

  .profileDetail .item-section .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 351.96px;
  }
}
/* Profile detail */
</style>
