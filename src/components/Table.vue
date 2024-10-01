<template>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
          <th v-if="showActions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.id">
          <td v-for="(value, key) in item" :key="key">
            <template v-if="key === 'moreDetails'">
              <a :href="value" target="_blank">{{ value }}</a>
            </template>
            <template v-else>
              {{ value }}
            </template>
          </td>
          <td v-if="showActions">
            <!-- <button @click="editItem(item)" v-if="showEdit">Edit</button> -->
            <button @click="deleteItem(item)" v-if="showDelete">Suspend</button>
            <button @click="deleteItem(item)" v-if="showDelete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Pagination Section -->
  <div class="pagination">
    <!-- Jump to First Page -->
    <button :disabled="currentPage === 1" @click="goToPage(1)" class="arrow">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"
        />
      </svg>
    </button>

    <!-- Previous 5 Pages -->
    <button
      :disabled="currentPage === 1"
      @click="goToPreviousPages"
      class="arrow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path
          d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
        />
      </svg>
    </button>

    <!-- Individual Page Numbers -->
    <button
      v-for="page in visiblePageNumbers"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="goToPage(page)"
      class="number"
    >
      {{ page }}
    </button>

    <!-- Next 5 Pages -->
    <button
      :disabled="currentPage === totalPages"
      @click="goToNextPages"
      class="arrow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path
          d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
        />
      </svg>
    </button>

    <!-- Jump to Last Page -->
    <button
      :disabled="currentPage === totalPages"
      @click="goToPage(totalPages)"
      class="arrow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

// Props received from parent page
const props = defineProps({
  data: Array,
  headers: Array,
  showActions: Boolean,
  showEdit: Boolean,
  showDelete: Boolean,
  itemsPerPage: {
    type: Number,
    default: 10, // Default 10 items per page
  },
});

const emit = defineEmits(["edit", "delete"]);

// State for pagination
const currentPage = ref(1);

// Calculate total number of pages
const totalPages = computed(() =>
  Math.ceil(props.data.length / props.itemsPerPage)
);

// Paginated data for the current page
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.data.slice(start, end);
});

// Methods for pagination
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Jump back 5 pages or to the first page if fewer than 5 pages are available
const goToPreviousPages = () => {
  const targetPage = Math.max(1, currentPage.value - 5);
  goToPage(targetPage);
};

// Jump forward 5 pages or to the last page if fewer than 5 pages are available
const goToNextPages = () => {
  const targetPage = Math.min(totalPages.value, currentPage.value + 5);
  goToPage(targetPage);
};

// Dynamic Visible Page Numbers (showing up to 5 pages at a time with current page in the middle)
const visiblePageNumbers = computed(() => {
  const visiblePagesCount = 5; // Number of pages to show
  let startPage = Math.max(
    1,
    currentPage.value - Math.floor(visiblePagesCount / 2)
  );
  let endPage = Math.min(startPage + visiblePagesCount - 1, totalPages.value);

  // Adjust startPage if we're near the end of the total pages
  if (endPage - startPage < visiblePagesCount - 1) {
    startPage = Math.max(1, endPage - visiblePagesCount + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
});

// Watch for changes in data to reset pagination if necessary
watch(
  () => props.data,
  () => {
    currentPage.value = 1;
  }
);

// Methods for actions
const editItem = (item) => {
  console.log("Edit", item);
  emit("edit", item);
};

const deleteItem = (item) => {
  console.log("Delete", item);
  emit("delete", item);
};
</script>

<style scoped>
.table {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
  margin-bottom: var(--size-12);
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid var(--light-grey);
  padding: var(--size-dropdown-item);
  text-align: center;
}

tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: var(--sky-blue);
}

tbody tr td a {
  color: var(--light-blue);
}

tbody tr td button {
  padding: 0 var(--size-4);
}

tbody tr td button svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}

tbody tr td button:nth-child(2) svg {
  fill: var(--crimson-red);
}

thead tr th {
  font-weight: var(--semi-bold);
}

.pagination {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: var(--size-8);
}

.pagination button {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: var(--size-32);
  max-width: var(--size-32);
  min-height: var(--size-32);
  max-height: var(--size-32);
  padding: 0 var(--size-12);
  border-radius: var(--border-sm);
  transition: none !important;
}

.pagination button.active {
  background: var(--light-blue);
  color: var(--white);
  font-weight: var(--semi-bold);
}

.pagination button.arrow {
  border: 1px solid var(--light-grey);
}

.pagination button:hover {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border 0.15s ease-in-out;
}

.pagination button.arrow:hover {
  background: var(--light-grey);
}

.pagination button.number:hover {
  background: var(--light-blue);
  color: var(--white);
  font-weight: var(--semi-bold);
}

.pagination button:disabled {
  border: 1px solid var(--white);
  background: var(--light-grey);
  cursor: not-allowed;
}

.pagination button svg {
  fill: var(--black);
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}
</style>
