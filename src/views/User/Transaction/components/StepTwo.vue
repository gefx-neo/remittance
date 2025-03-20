<template>
  <div class="first-form" @keydown.enter.prevent="handleNext">
    <div class="content-area">
      <div class="beneficiary">
        <div class="search-section">
          <div class="input-group">
            <input
              type="text"
              placeholder="Search beneficiary"
              v-model="searchQuery"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              />
            </svg>
          </div>
          <div class="button-group">
            <button
              type="button"
              @click="navigateToAddBeneficiary"
              class="btn-blue standard-button"
            >
              <span class="desktop"> New Beneficiary </span>
              <span class="mobile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <path
                    d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div v-if="store.isLoading">
          <SkeletonLoader type="beneficiaryListTransaction" :count="9" />
        </div>
        <div
          v-else-if="Array.isArray(beneficiaries) && beneficiaries.length === 0"
        >
          <EmptyList />
        </div>
        <div v-else>
          <div
            class="payment-category"
            v-if="filteredNoPreferenceBeneficiaries.length > 0"
          >
            <h4>No Preference</h4>
            <div class="item-section">
              <div
                v-for="(
                  beneficiary, index
                ) in filteredNoPreferenceBeneficiaries"
                :key="'nopreference-' + index"
                class="item"
                tabindex="0"
                :class="{
                  selected:
                    selectedBeneficiary &&
                    selectedBeneficiary.id == beneficiary.id,
                }"
                @click="selectBeneficiary(beneficiary)"
              >
                <FavouriteButton
                  :beneficiaryId="beneficiary.id"
                  :isFav="!!beneficiary.isFav"
                  @update-list="refreshPage"
                  @click.stop
                />
                <div class="detail">
                  <span class="icon-round">
                    {{ getInitials(beneficiary.beneName) }}
                    <img
                      :src="getCurrencyImagePath(beneficiary.currency)"
                      alt="Currency"
                    />
                  </span>
                  <span class="name">{{ beneficiary.beneName }}</span>

                  <span>
                    {{ getAccountType(beneficiary.accountType) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="payment-category"
            v-if="filteredLocalPaymentBeneficiaries.length > 0"
          >
            <h4>Local Payment</h4>
            <div class="item-section">
              <div
                v-for="(
                  beneficiary, index
                ) in filteredLocalPaymentBeneficiaries"
                :key="'local-' + index"
                class="item"
                tabindex="0"
                :class="{
                  selected:
                    selectedBeneficiary &&
                    selectedBeneficiary.id == beneficiary.id,
                }"
                @click="selectBeneficiary(beneficiary)"
              >
                <FavouriteButton
                  :beneficiaryId="beneficiary.id"
                  :isFav="!!beneficiary.isFav"
                  @update-list="refreshPage"
                  @click.stop
                />
                <div class="detail">
                  <span class="icon-round">
                    {{ getInitials(beneficiary.beneName) }}
                    <img
                      :src="getCurrencyImagePath(beneficiary.currency)"
                      alt="Currency"
                    />
                  </span>
                  <span class="name">{{ beneficiary.beneName }}</span>

                  <span>
                    {{ getAccountType(beneficiary.accountType) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="payment-category"
            v-if="filteredSwiftSHAPaymentBeneficiaries.length > 0"
          >
            <h4>Swift SHA Payment</h4>
            <div class="item-section">
              <div
                v-for="(
                  beneficiary, index
                ) in filteredSwiftSHAPaymentBeneficiaries"
                :key="'swift-' + index"
                class="item"
                tabindex="0"
                :class="{
                  selected:
                    selectedBeneficiary &&
                    selectedBeneficiary.id == beneficiary.id,
                }"
                @click="selectBeneficiary(beneficiary)"
              >
                <FavouriteButton
                  :beneficiaryId="beneficiary.id"
                  :isFav="!!beneficiary.isFav"
                  @update-list="refreshPage"
                  @click.stop
                />
                <div class="detail">
                  <span class="icon-round">
                    {{ getInitials(beneficiary.beneName) }}
                    <img
                      :src="getCurrencyImagePath(beneficiary.currency)"
                      alt="Currency"
                    />
                  </span>
                  <span class="name">{{ beneficiary.beneName }}</span>

                  <span>
                    {{ getAccountType(beneficiary.accountType) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="payment-category"
            v-if="filteredSwiftBENPaymentBeneficiaries.length > 0"
          >
            <h4>Swift BEN Payment</h4>
            <div class="item-section">
              <div
                v-for="(
                  beneficiary, index
                ) in filteredSwiftBENPaymentBeneficiaries"
                :key="'swift-' + index"
                class="item"
                tabindex="0"
                :class="{
                  selected:
                    selectedBeneficiary &&
                    selectedBeneficiary.id == beneficiary.id,
                }"
                @click="selectBeneficiary(beneficiary)"
              >
                <FavouriteButton
                  :beneficiaryId="beneficiary.id"
                  :isFav="!!beneficiary.isFav"
                  @update-list="refreshPage"
                  @click.stop
                />
                <div class="detail">
                  <span class="icon-round">
                    {{ getInitials(beneficiary.beneName) }}
                    <img
                      :src="getCurrencyImagePath(beneficiary.currency)"
                      alt="Currency"
                    />
                  </span>
                  <span class="name">{{ beneficiary.beneName }}</span>

                  <span>
                    {{ getAccountType(beneficiary.accountType) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="payment-category"
            v-if="filteredSwiftOURPaymentBeneficiaries.length > 0"
          >
            <h4>Swift OUR Payment</h4>
            <div class="item-section">
              <div
                v-for="(
                  beneficiary, index
                ) in filteredSwiftOURPaymentBeneficiaries"
                :key="'swift-' + index"
                class="item"
                tabindex="0"
                :class="{
                  selected:
                    selectedBeneficiary &&
                    selectedBeneficiary.id == beneficiary.id,
                }"
                @click="selectBeneficiary(beneficiary)"
              >
                <FavouriteButton
                  :beneficiaryId="beneficiary.id"
                  :isFav="!!beneficiary.isFav"
                  @update-list="refreshPage"
                  @click.stop
                />
                <div class="detail">
                  <span class="icon-round">
                    {{ getInitials(beneficiary.beneName) }}
                    <img
                      :src="getCurrencyImagePath(beneficiary.currency)"
                      alt="Currency"
                    />
                  </span>
                  <span class="name">{{ beneficiary.beneName }}</span>

                  <span>
                    {{ getAccountType(beneficiary.accountType) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <button type="button" @click="handleNext" class="btn-red standard-button">
        Next
      </button>
      <button
        type="button"
        @click="handleBack"
        class="btn-back standard-button"
      >
        Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted, nextTick } from "vue";
import { useValidation } from "@/composables/useValidation";
import { formValidation } from "./schemas/stepOneSchema";
import {
  useStore,
  useAlertStore,
  useBeneficiaryStore,
} from "@/stores/index.js";
import FavouriteButton from "../../Beneficiary/components/FavouriteButton.vue";
import { useRouter } from "vue-router";
import {
  getInitials,
  getAccountType,
  getCurrencyImagePath,
} from "@/utils/beneficiaryUtils.js";
import EmptyList from "@/views/EmptyList.vue";
import SkeletonLoader from "@/views/SkeletonLoader.vue";

const store = useStore();
const beneficiaryStore = useBeneficiaryStore();
const alertStore = useAlertStore();

const router = useRouter();

const { errors, validateForm, scrollToErrors } = useValidation();

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  beneficiaries: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:modelValue",
  "nextStep",
  "prevStep",
  "beneficiaryChanged",
]);

const searchQuery = ref("");
const localForm = reactive({
  selectedBeneficiary: beneficiaryStore.selectedBeneficiary || null,
  ...props.modelValue,
});
const selectedBeneficiary = ref(null);

const filteredBeneficiaries = computed(() => {
  return props.beneficiaries.filter((beneficiary) => {
    const query = searchQuery.value.toLowerCase();
    return (
      beneficiary.beneName.toLowerCase().includes(query) ||
      beneficiary.currency.toLowerCase().includes(query)
    );
  });
});

const filteredNoPreferenceBeneficiaries = computed(() =>
  filteredBeneficiaries.value.filter(
    (beneficiary) => beneficiary.paymentType === "No preference"
  )
);

const filteredLocalPaymentBeneficiaries = computed(() =>
  filteredBeneficiaries.value.filter(
    (beneficiary) => beneficiary.paymentType === "Local Payment"
  )
);

const filteredSwiftSHAPaymentBeneficiaries = computed(() =>
  filteredBeneficiaries.value.filter((beneficiary) =>
    beneficiary.paymentType.includes("Swift SHA")
  )
);

const filteredSwiftBENPaymentBeneficiaries = computed(() =>
  filteredBeneficiaries.value.filter((beneficiary) =>
    beneficiary.paymentType.includes("Swift BEN")
  )
);

const filteredSwiftOURPaymentBeneficiaries = computed(() =>
  filteredBeneficiaries.value.filter((beneficiary) =>
    beneficiary.paymentType.includes("Swift OUR")
  )
);

// const selectBeneficiary = (beneficiary) => {
//   selectedBeneficiary.value = beneficiary;
//   beneficiaryStore.setSelectedBeneficiary(beneficiary);
//   // Update only the local form state
//   emit("update:modelValue", {
//     ...localForm,
//     beneficiary,
//   });
// };

const selectBeneficiary = (beneficiary) => {
  selectedBeneficiary.value = beneficiary;
  // emit("beneficiaryChanged", beneficiary); // Emit an event for recalculation
};

const syncBeneficiaryFromQuery = () => {
  const { beneId } = router.currentRoute.value.query;

  // Check if a beneficiary is already stored
  if (beneficiaryStore.selectedBeneficiary) {
    selectedBeneficiary.value = beneficiaryStore.selectedBeneficiary;
    return;
  }

  if (beneId) {
    const beneficiary = props.beneficiaries.find((b) => b.id === beneId);

    if (beneficiary) {
      selectedBeneficiary.value = beneficiary;
      beneficiaryStore.setSelectedBeneficiary(beneficiary);
      emit("update:modelValue", { ...localForm });
    } else {
      selectedBeneficiary.value = null;
      beneficiaryStore.setSelectedBeneficiary(null);
    }
  }
};

onMounted(async () => {
  await nextTick(); // ✅ Ensure Vue updates the DOM before running logic

  const { beneId } = router.currentRoute.value.query;
  if (beneId) {
    await syncBeneficiaryFromQuery(); // ✅ Ensure sync function fully executes
  }
});

const handleNext = () => {
  if (!selectedBeneficiary.value) {
    alertStore.alert("error", "Please select a beneficiary before proceeding.");
    return; // Stop execution if no beneficiary is selected
  }

  if (selectedBeneficiary.value.currency !== localForm.receivingCurrency) {
    alertStore.alert(
      "error",
      `Selected beneficiary's currency (${selectedBeneficiary.value.currency}) does not match the receiving currency (${localForm.receivingCurrency}).`
    );
    return; // Stop execution if the currencies don't match
  }

  const schema = formValidation(localForm);

  const isValid = validateForm(localForm, schema);
  console.log("Validation Errors:", errors);

  if (isValid) {
    // Add query parameters when navigating to the next step
    router.push({
      query: {
        ...router.currentRoute.value.query,
        beneId: selectedBeneficiary.value.id,
        currency: selectedBeneficiary.value.currency,
      },
    });

    // Emit the updated form state, including the selected beneficiary
    emit("update:modelValue", {
      ...localForm,
      selectedBeneficiary: selectedBeneficiary.value,
    });
    emit("nextStep");
  } else {
    alertStore.alert("error", "Please fill in all the required inputs.");
    scrollToErrors();
  }
};

const handleBack = () => {
  emit("prevStep");

  // beneficiaryStore.setSelectedBeneficiary(null);
  // router.push({ path: "/dashboard" });
};

const refreshPage = () => {
  window.location.reload();
};

const navigateToAddBeneficiary = () => {
  router.push({
    name: "addbeneficiary",
    query: {
      from: "transaction",
      redirectTo: "addtransaction",
    },
  });
};
</script>

<style scoped>
.first-form {
  width: 100%;
  max-width: 500px;
}
.first-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}
.form-group {
  margin-bottom: var(--size-24);
}

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

.beneficiary .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-12) 0;
  border-bottom: 1px solid var(--light-grey);
}

.beneficiary .title a {
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
}

.beneficiary .search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.beneficiary .search-section .input-group {
  min-width: 69%;
  max-width: 69%;
  position: relative;
}

.beneficiary .search-section .input-group input {
  min-width: 100%;
  max-width: 100%;
  padding-right: var(--size-48);
}

.beneficiary .search-section .input-group input::placeholder {
  color: var(--grey);
}

.beneficiary .search-section .input-group svg {
  min-width: var(--size-24);
  max-width: var(--size-24);
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
  fill: var(--cool-blue);
  cursor: pointer;
}

.beneficiary .search-section .button-group {
  min-width: 30%;
  max-width: 30%;
}

.beneficiary .search-section .button-group .btn-blue .desktop {
  display: flex;
  font-weight: var(--semi-bold);
}

.beneficiary .search-section .button-group .btn-blue .mobile {
  display: none;
}

.beneficiary .payment-category {
  margin-bottom: var(--size-24);
}

.beneficiary .payment-category h4 {
  margin-bottom: var(--size-8);
}

.beneficiary .item-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  place-items: center;
  gap: var(--size-16);
}

.beneficiary .item-section .item {
  position: relative;
  min-width: 100%;
  max-width: 100%;
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
  cursor: pointer;
}

.beneficiary .item-section .item .favourite-group {
  display: flex;
  justify-content: end;
  align-items: center;
}

.beneficiary .item-section .item .favourite {
  position: absolute;
  top: var(--size-8);
  right: var(--size-8);
}

.beneficiary .item-section .item .detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--size-24) 0;
}

.beneficiary .item-section .item .detail .icon-round {
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

.beneficiary .item-section .item .detail .icon-round img {
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

.beneficiary .item-section .item .detail span:nth-child(2) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.beneficiary .item-section .item .detail span:nth-child(3) {
  font-size: var(--text-sm);
  color: var(--grey);
}

/* Hover and Selected Styles */
.beneficiary .item-section .item:hover,
.beneficiary .item-section .item.selected {
  background: var(--sky-blue);
}

.beneficiary .item-section .item:hover .icon-round,
.beneficiary .item-section .item.selected .icon-round {
  background: var(--slate-blue);
  color: var(--sky-blue);
}

.beneficiary .item-section .item:hover span:nth-child(2),
.beneficiary .item-section .item.selected span:nth-child(2) {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

@media (max-width: 767px) {
  .beneficiary .search-section .button-group .btn-blue .desktop {
    display: none;
  }

  .beneficiary .search-section .button-group .btn-blue .mobile {
    display: flex;
  }

  .beneficiary .search-section .button-group .btn-blue .mobile svg {
    min-width: var(--size-24);
    max-width: var(--size-24);
    fill: #fff;
  }

  .beneficiary .search-section .input-group {
    min-width: calc(100% - 56px);
    max-width: calc(100% - 56px);
  }

  .beneficiary .search-section .button-group {
    min-width: var(--size-48);
    max-width: var(--size-48);
  }

  .beneficiary .item-section {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .beneficiary .item-section .item .detail {
    padding: var(--size-12) 0;
  }

  .beneficiary .item-section .item .favourite {
    top: var(--size-4);
    right: var(--size-4);
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
  }

  .beneficiary .item-section .item .detail .icon-round {
    min-width: var(--size-48);
    max-width: var(--size-48);
    min-height: var(--size-48);
    max-height: var(--size-48);
    font-size: var(--text-lg);
    margin-bottom: var(--size-8);
  }

  .beneficiary .item-section .item .detail .icon-round img {
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
  }
}
</style>
