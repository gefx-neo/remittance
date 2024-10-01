<template>
  <div class="content-area">
    <div class="transaction">
      <ReusableTable
        :title="'Transaction Management'"
        :data="tableData"
        :headers="headers"
        :bordered="true"
        :totalRows="totalRows"
        :offset="pagination.offset"
        :limit="pagination.limit"
        @sort="handleSort"
        @pagination="handlePagination"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ReusableTable from "@/components/ReusableTable.vue";

const headers = [
  { key: "date", label: "Date", sortable: true },
  { key: "fullName", label: "Full name", sortable: true },
  { key: "status", label: "Status", sortable: false },
  // Add more headers as per your data
];

// Fake data to simulate an API response
const fakeData = [
  { date: "2024-09-30", fullName: "Doe, John 01", status: "Active" },
  { date: "2024-09-29", fullName: "Doe, John 02", status: "Active" },
  { date: "2024-09-28", fullName: "Doe, John 03", status: "Active" },
  { date: "2024-09-27", fullName: "Doe, John 04", status: "Active" },
  { date: "2024-09-26", fullName: "Doe, John 05", status: "Active" },
  { date: "2024-09-25", fullName: "Doe, John 06", status: "Active" },
  { date: "2024-09-24", fullName: "Doe, John 07", status: "Active" },
  { date: "2024-09-23", fullName: "Doe, John 08", status: "Active" },
  { date: "2024-09-22", fullName: "Doe, John 11", status: "Active" },
  { date: "2024-09-21", fullName: "Doe, John 10", status: "Active" },
  { date: "2024-09-20", fullName: "Doe, John 11", status: "Active" },
  { date: "2024-09-19", fullName: "Doe, John 12", status: "Active" },
  { date: "2024-09-18", fullName: "Doe, John 13", status: "Active" },
  { date: "2024-09-17", fullName: "Doe, John 14", status: "Active" },
  { date: "2024-09-16", fullName: "Doe, John 15", status: "Active" },
  { date: "2024-09-15", fullName: "Doe, John 16", status: "Active" },
  { date: "2024-09-14", fullName: "Doe, John 17", status: "Active" },
  { date: "2024-09-13", fullName: "Doe, John 18", status: "Active" },
  { date: "2024-09-12", fullName: "Doe, John 19", status: "Active" },
  { date: "2024-09-11", fullName: "Doe, John 20", status: "Active" },
  { date: "2024-09-10", fullName: "Doe, John 21", status: "Active" },
  { date: "2024-09-09", fullName: "Doe, John 22", status: "Active" },
  { date: "2024-09-08", fullName: "Doe, John 23", status: "Active" },
  { date: "2024-09-07", fullName: "Doe, John 24", status: "Active" },
  { date: "2024-09-06", fullName: "Doe, John 25", status: "Active" },
  { date: "2024-09-05", fullName: "Doe, John 26", status: "Active" },
  { date: "2024-09-04", fullName: "Doe, John 27", status: "Active" },
  { date: "2024-09-03", fullName: "Doe, John 28", status: "Active" },
  { date: "2024-09-02", fullName: "Doe, John 29", status: "Active" },
  { date: "2024-09-01", fullName: "Doe, John 30", status: "Active" },
  { date: "2024-08-31", fullName: "Doe, John 31", status: "Active" },
  { date: "2024-08-30", fullName: "Doe, John 32", status: "Active" },
  { date: "2024-08-29", fullName: "Doe, John 33", status: "Active" },
  { date: "2024-08-28", fullName: "Doe, John 34", status: "Active" },
  { date: "2024-08-27", fullName: "Doe, John 35", status: "Active" },
  { date: "2024-08-26", fullName: "Doe, John 36", status: "Active" },
  { date: "2024-08-25", fullName: "Doe, John 37", status: "Active" },
  { date: "2024-08-24", fullName: "Doe, John 38", status: "Active" },
  { date: "2024-08-23", fullName: "Doe, John 39", status: "Active" },
  { date: "2024-08-22", fullName: "Doe, John 40", status: "Active" },
  { date: "2024-08-21", fullName: "Doe, John 41", status: "Active" },
  { date: "2024-08-20", fullName: "Doe, John 42", status: "Active" },
  { date: "2024-08-19", fullName: "Doe, John 43", status: "Active" },
  { date: "2024-08-18", fullName: "Doe, John 44", status: "Active" },
  { date: "2024-08-17", fullName: "Doe, John 45", status: "Active" },
  { date: "2024-08-16", fullName: "Doe, John 46", status: "Active" },
  { date: "2024-08-15", fullName: "Doe, John 47", status: "Active" },
  { date: "2024-08-14", fullName: "Doe, John 48", status: "Active" },
  { date: "2024-08-13", fullName: "Doe, John 49", status: "Active" },
  { date: "2024-08-12", fullName: "Doe, John 50", status: "Active" },
];

const tableData = ref([]);
const totalRows = ref(fakeData.length);
const pagination = ref({
  offset: 0, // Start index
  limit: 10, // Number of items per page
});

const sortOrder = ref("asc"); // Default sort order
const sortBy = ref(null); // Sort key

// Fetch data (using fake data)
const fetchData = () => {
  const start = pagination.value.offset;
  const end = start + pagination.value.limit;
  tableData.value = fakeData.slice(start, end);
};

// Handle sort event from the table
// Handle sort event from the table
const handleSort = ({ key, order }) => {
  const header = headers.find((header) => header.key === key);

  // Check if the header is sortable
  if (!header || !header.sortable) {
    return; // Do nothing if the column is not sortable
  }

  sortBy.value = key;
  sortOrder.value = order;

  // Sorting logic
  tableData.value.sort((a, b) => {
    const modifier = order === "asc" ? 1 : -1;
    if (a[key] < b[key]) return -1 * modifier;
    if (a[key] > b[key]) return 1 * modifier;
    return 0;
  });
};

// Handle pagination event from the table
const handlePagination = ({ offset, limit }) => {
  pagination.value.offset = offset;
  pagination.value.limit = limit;
  fetchData();
};

// Fetch data initially
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.transaction {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}
</style>
