// stores/stepStore.js
import { defineStore } from "pinia";

export const useStepStore = defineStore("stepStore", {
  state: () => ({
    currentStep: 1,
    steps: [],
  }),
  actions: {
    setSteps(newSteps) {
      this.steps = newSteps;
    },
    setCurrentStep(step) {
      this.currentStep = step;
    },
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
  },
});
