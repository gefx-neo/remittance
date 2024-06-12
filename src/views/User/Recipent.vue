<template>
  <div>
    <h2>Recipent</h2>
    Device ID: {{ deviceStore.deviceId }}
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useDeviceStore } from "@/stores/deviceStore";

export default defineComponent({
  setup() {
    const deviceStore = useDeviceStore();

    onMounted(() => {
      if (!deviceStore.deviceId) {
        deviceStore.generateDeviceId();
      } else {
        console.log("Device ID from cookie:", deviceStore.deviceId);
      }
    });

    return { deviceStore };
  },
});
</script>
