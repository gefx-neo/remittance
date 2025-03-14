<template>
  <div class="summary">
    <div
      class="header"
      :class="{ open: isAccordionOpen }"
      @click="toggleAccordion"
    >
      <div class="title">Transaction Summary</div>
      <div class="icon">
        <font-awesome-icon :icon="['fa', 'chevron-down']" />
      </div>
    </div>
    <div class="accordion-content" :class="{ open: isAccordionOpen }">
      <div class="body">
        <div class="item">
          <div class="label">Sending amount</div>
          <div class="value">
            {{ formatNumber(props.sendingAmount) }} {{ sendingCurrency }}
          </div>
        </div>
        <div class="item">
          <div class="label">Processing fees</div>
          <div class="value">{{ formatNumber(fee) }} {{ sendingCurrency }}</div>
        </div>
        <div class="item">
          <div class="label">Exchange rate</div>
          <div class="value">
            1 {{ sendingCurrency }} = {{ rate }}
            {{ receivingCurrency }}
          </div>
        </div>
        <div class="item">
          <div class="label">Receiving amount</div>
          <div class="value">
            {{ formatNumber(props.receivingAmount) }} {{ receivingCurrency }}
          </div>
        </div>
      </div>
      <div class="footerr">
        <div class="label">Amount to be paid</div>
        <div class="value">
          {{ formatNumber(props.sendingAmount + props.fee) }}
          {{ sendingCurrency }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { formatNumber } from "@/utils/transactionUtils.js";
const props = defineProps({
  sendingAmount: Number,
  sendingCurrency: String,
  receivingAmount: Number,
  receivingCurrency: String,
  fee: Number,
  rate: Number,
  payAmount: Number,
});

const isAccordionOpen = ref(true);
const toggleAccordion = () => {
  isAccordionOpen.value = !isAccordionOpen.value;
};
</script>

<style scoped>
/* Add the same styles as in the previous code */
.summary {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
  margin-bottom: var(--size-24);
}

.footerr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-16);
}

.footerr .label {
  color: var(--grey);
}

.footerr .value {
  font-size: var(--text-lg);
  font-weight: var(--semi-bold);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-dropdown-item);
  cursor: pointer;
}

.header.open {
  border-bottom: 1px solid var(--light-grey);
}

.header .title {
  font-weight: var(--semi-bold);
}

.header.open svg {
  transform: rotate(180deg);
  transition: transform 0.3s cubic-bezier(0, 0.94, 0.62, 1);
}

.header svg {
  color: var(--black);
}

.accordion-content {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.accordion-content.open {
  max-height: 500px;
  opacity: 1;
}

.accordion-content .body {
  padding: var(--size-16);
  padding-bottom: var(--size-8);
}

.accordion-content.open .body {
  border-bottom: 1px solid var(--light-grey);
}

.accordion-content .body .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--size-8);
}

.accordion-content .body .item .label {
  color: var(--grey);
}

.accordion-content .body .item .value {
  color: var(--black);
}
</style>
