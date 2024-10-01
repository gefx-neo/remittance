<template>
  <div class="title">
    <h3>{{ title }}</h3>
  </div>
  <div class="search-section">
    <div class="input-group">
      <input type="text" placeholder="Search key" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
        />
      </svg>
    </div>
    <div class="button-group">
      <button class="btn-blue standard-button" @click="exportToExcel">
        <span class="desktop">Export to Excel</span>
        <span class="mobile">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path
              d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z"
            />
          </svg>
        </span>
      </button>
    </div>
  </div>

  <div class="table">
    <table :class="{ 'table-bordered': bordered }">
      <thead>
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            @click="sort(header.key)"
          >
            <div class="sort-item">
              {{ header.label }}
              <span v-if="header.sortable">
                <svg
                  v-if="sortKey === header.key && sortOrder === 'desc'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7 96 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 301.7 32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-160 0zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L320 96z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-224 0z"
                  />
                </svg>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(header, colIndex) in headers" :key="colIndex">
            <!-- <slot :name="header.key" :row="row">
              {{ row[header.key] }}
            </slot> -->
            <template v-if="header.key === 'fullName'">
              <div class="fullname">
                <a
                  :href="`https://dev4.thedottsolutions.com/GEFX/`"
                  target="_blank"
                  >{{ row[header.key] }}</a
                >
                <span class="tooltip">
                  Please login at OMS for full access.
                </span>
              </div>
            </template>
            <template v-else>
              {{ row[header.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pagination-section">
    <div>
      Showing {{ offset + 1 }} to {{ Math.min(offset + limit, totalRows) }} of
      {{ totalRows }} entries
    </div>
    <div class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="btn-load"
      >
        Previous
      </button>
      <template v-if="totalPages > 5">
        <button v-if="currentPage > 3" @click="changePage(1)" class="page">
          {{ 1 }}
        </button>
        <span v-if="currentPage > 4">...</span>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="['page', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
        <span v-if="currentPage < totalPages - 3">...</span>
        <button
          v-if="currentPage < totalPages - 2"
          @click="changePage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="['page', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </template>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="btn-load"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import * as XLSX from "xlsx";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  offset: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 10,
  },
  totalRows: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["sort", "pagination"]);
const sortKey = ref(""); // To track which header is being sorted
const sortOrder = ref("asc");
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.totalRows / props.limit));

const visiblePages = computed(() => {
  const pages = [];
  const startPage = Math.max(1, currentPage.value - 2);
  const endPage = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// const sort = (key) => {
//   sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
//   emit("sort", { key, order: sortOrder.value });
// };

const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key; // Set the newly clicked column as sort key
    sortOrder.value = "asc"; // Reset the sort order when a new column is sorted
  }
  emit("sort", { key, order: sortOrder.value });
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  emit("pagination", { offset: (page - 1) * props.limit, limit: props.limit });
};

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(props.data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  // XLSX.writeFile(wb, ${props.title}.xlsx);
  XLSX.writeFile(wb, `${props.title}.xlsx`);
};
</script>

<style scoped>
.title {
  padding: var(--size-12) 0;
  border-bottom: 1px solid var(--light-grey);
}

.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section .input-group {
  min-width: 79%;
  max-width: 79%;
  position: relative;
}

.search-section .input-group input {
  min-width: 100%;
  max-width: 100%;
  padding-right: var(--size-48);
}

.search-section .input-group input::placeholder {
  color: var(--grey);
}

.search-section .input-group svg {
  min-width: var(--size-24);
  max-width: var(--size-24);
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
  fill: var(--cool-blue);
  cursor: pointer;
}

.search-section .button-group {
  min-width: 20%;
  max-width: 20%;
}

.search-section .button-group .btn-blue .desktop {
  display: flex;
  font-weight: var(--semi-bold);
}

.search-section .button-group .btn-blue .mobile {
  display: none;
}

.table {
  position: relative;
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
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

thead tr th {
  font-weight: var(--semi-bold);
}

thead tr th .sort-item {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--size-4);
  cursor: pointer;
}

thead tr th .sort-item span {
  display: flex;
}

thead tr th .sort-item svg {
  min-width: var(--size-12);
  max-width: var(--size-12);
  min-height: var(--size-12);
  max-height: var(--size-12);
  fill: var(--black);
}
tbody tr:hover {
  background: var(--sky-blue);
}
tbody tr td {
  position: relative;
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

tbody tr td .tooltip {
  opacity: 0;
  position: absolute;
  bottom: 100%;
  left: 50%;
  width: max-content;
  transform: translateX(-50%);
  background: var(--grey);
  color: var(--white);
  padding: var(--size-8);
  border-radius: var(--border-sm);
  overflow: hidden;
  font-size: var(--text-sm);
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
}

tbody tr td .fullname:hover .tooltip {
  opacity: 1;
  z-index: 10;
}

.pagination-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagination {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: var(--size-8);
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.pagination button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--size-dropdown-item);
  border-radius: var(--border-md);
}

.pagination .btn-load {
  min-width: unset;
  max-width: unset;
}

.pagination .btn-load:disabled {
  color: var(--darker-grey);
}

.pagination .btn-load:disabled:hover {
  background: var(--light-grey);
  color: var(--darker-grey);
  cursor: not-allowed;
}

.pagination button.page:hover,
.pagination button.page.active {
  background: var(--light-blue);
  color: var(--white);
  font-weight: var(--semi-bold);
}

.pagination button.page.active:hover {
  background: var(--dark-blue);
}

.pagination button.page:focus {
  background: var(--darker-blue);
}

.pagination button.page.active:not(:focus-visible) {
  background: var(--light-blue);
}

.pagination button.page.active:active {
  background: var(--darker-blue);
}

@media (max-width: 767px) {
  .search-section .button-group .btn-blue .desktop {
    display: none;
  }

  .search-section .button-group .btn-blue .mobile {
    display: flex;
  }

  .search-section .button-group .btn-blue .mobile svg {
    min-width: var(--size-24);
    max-width: var(--size-24);
    fill: #fff;
  }

  .pagination-section {
    flex-direction: column;
    gap: var(--size-12);
  }

  .pagination {
    gap: var(--size-4);
  }

  .pagination button {
    padding: var(--size-12);
  }
}
</style>
