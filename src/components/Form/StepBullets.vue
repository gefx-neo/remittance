<template>
  <div class="step-bullet">
    <div class="progress">
      <div class="bar">
        <div class="item" :style="{ width: progressWidth + '%' }"></div>
      </div>
      <div class="step">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="item"
          @click="goToStep(index + 1)"
          :class="{ clickable: index + 1 < currentStep }"
        >
          <div class="label" :class="{ active: index < currentStep }">
            {{ step }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
  },
});

const progressWidth = computed(
  () => ((props.currentStep - 1) / (props.steps.length - 1)) * 100
);

const emit = defineEmits(["step-clicked"]);

const goToStep = (step) => {
  if (step < props.currentStep) {
    emit("step-clicked", step);
  }
};
</script>

<style scoped>
.step-bullet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 var(--size-24);
  width: 450px;
}

.progress {
  width: 100%;
  margin-bottom: var(--size-24);
}

.bar {
  height: var(--size-4);
  background: var(--light-grey);
  border-radius: var(--border-circle);
  position: relative;
}

.progress .bar .item {
  height: 100%;
  background-color: #333;
  border-radius: var(--border-circle);
  transition: width 0.6s ease;
}

.step {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.step .item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step .item .label {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  margin-top: var(--size-12);
  font-size: var(--text-sm);
}

.step .item .label.active {
  color: var(--black);
  font-weight: var(--semi-bold);
}

.step .item.clickable .label:hover {
  cursor: pointer;
}

@media (max-width: 767px) {
  .step-bullet {
    padding: var(--size-8) 0;
  }

  .progress {
    margin-bottom: 0;
  }

  .step .item .label {
    display: none;
  }
}
</style>
