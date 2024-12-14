<template>
  <div class="form-group">
    <div class="label">
      <label :for="id">{{ label }}</label>
      <Tooltip v-if="tooltip" :text="tooltipText">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
          />
        </svg>
      </Tooltip>
    </div>

    <input :type="type" :id="id" :value="modelValue" @input="updateValue" />
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import Tooltip from "@/components/Tooltip.vue";

const props = defineProps({
  label: String,
  id: String,
  type: {
    type: String,
    default: "text",
  },
  modelValue: String,
  tooltip: Boolean,
  tooltipText: String,
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

// Emit value update for v-model
const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<style scoped>
.label {
  display: flex;
  align-items: center;
  gap: var(--size-6);
}

.label .tooltip {
  margin-bottom: var(--size-4);
}

.label .tooltip svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  fill: var(--grey);
}
</style>
