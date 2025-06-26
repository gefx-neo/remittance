<template>
  <div class="form-group">
    <div class="switch-group">
      <label>{{ label }}</label>
      <div class="item">
        <input
          type="checkbox"
          :id="id"
          :name="id"
          v-model="checked"
          @change="emitChange"
        />
        <label :for="id">
          <span class="slider"></span>
        </label>
      </div>
    </div>
    <p v-if="content" class="content">{{ content }}</p>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  label: String,
  id: String,
  content: String,
  error: String,
  modelValue: String, // Expecting 'Yes' or 'No'
});

const emit = defineEmits(["update:modelValue"]);

// Local state as a boolean
const checked = ref(props.modelValue === "Yes");

// Emit 'Yes' for true, 'No' for false
const emitChange = () => {
  const newValue = checked.value ? "Yes" : "No";
  emit("update:modelValue", newValue); // Emit the new value
};

// Watch for changes to the prop value and update local state
watch(
  () => props.modelValue,
  (newVal) => {
    checked.value = newVal === "Yes";
  }
);
</script>

<style scoped>
.switch-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--size-4);
}

.switch-group label {
  font-weight: var(--semi-bold);
}

.switch-group .item {
  position: relative;
  min-width: 52px;
  width: 52px;
  height: 26px;
}

.switch-group .item input {
  display: none;
}

.switch-group .item label {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--cool-blue);
  border-radius: var(--border-circle);
  padding: 3px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  box-sizing: border-box;
}

.switch-group .item label .slider {
  display: flex;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease-in-out;
}

.switch-group .item input:checked + label {
  background: var(--slate-blue);
}

.switch-group .item input:checked + label .slider {
  transform: translateX(26px);
}

.content {
  color: var(--grey);
  font-size: var(--text-sm);
}
</style>
