<template>
  <Accordion header="Transaction Summary">
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
    <div class="footerr">
      <div class="label">Amount to be paid</div>
      <div class="value">
        {{ formatNumber(props.sendingAmount + props.fee) }}
        {{ sendingCurrency }}
      </div>
    </div>
  </Accordion>
</template>

<script setup>
import Accordion from "@/components/Accordion/Accordion.vue";
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
</script>

<style scoped>
.footerr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-16);
  border-top: 1px solid var(--light-grey);
  margin: 0 -16px;
  padding-bottom: 0;
  margin-top: var(--size-8);
}

.footerr .label {
  color: var(--grey);
}

.footerr .value {
  font-size: var(--text-lg);
  font-weight: var(--semi-bold);
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--size-8);
}

.item .label {
  color: var(--grey);
}

.item .value {
  color: var(--black);
}
</style>
