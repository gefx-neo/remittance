<template>
  <div class="content-area">
    <div class="customer">
      <div class="title">
        <h3>Audit Log</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import Table from "@/components/Table.vue";
import { ref } from "vue";

const tableHeaders = ["Date", "Surname", "Given name", "More details"];

const tableData = ref([
  {
    id: 1,
    surname: "Doe",
    givenName: "John",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 2,
    surname: "Doe",
    givenName: "Jane",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 3,
    surname: "Smith",
    givenName: "Alice",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 4,
    surname: "Johnson",
    givenName: "Bob",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 5,
    surname: "Brown",
    givenName: "Charlie",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 6,
    surname: "Green",
    givenName: "David",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 7,
    surname: "James",
    givenName: "Ella",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 8,
    surname: "White",
    givenName: "Frank",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 9,
    surname: "Lee",
    givenName: "Grace",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 10,
    surname: "Adams",
    givenName: "Henry",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 11,
    surname: "Scott",
    givenName: "Ivy",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 12,
    surname: "Turner",
    givenName: "Jack",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 13,
    surname: "Green",
    givenName: "David",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 14,
    surname: "James",
    givenName: "Ella",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 15,
    surname: "White",
    givenName: "Frank",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 16,
    surname: "Lee",
    givenName: "Grace",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 17,
    surname: "Adams",
    givenName: "Henry",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 18,
    surname: "Scott",
    givenName: "Ivy",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 19,
    surname: "Turner",
    givenName: "Jack",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 20,
    surname: "Turner",
    givenName: "Jack",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 21,
    surname: "Turner",
    givenName: "Jack",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 22,
    surname: "Turner",
    givenName: "Jack",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 23,
    surname: "Adams",
    givenName: "Charlie",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 24,
    surname: "Brown",
    givenName: "Alice",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 25,
    surname: "Adams",
    givenName: "Jane",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 26,
    surname: "Brown",
    givenName: "David",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 27,
    surname: "Scott",
    givenName: "Grace",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 28,
    surname: "Doe",
    givenName: "Charlie",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 29,
    surname: "Turner",
    givenName: "Bob",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 30,
    surname: "Turner",
    givenName: "Ivy",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 31,
    surname: "Adams",
    givenName: "John",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 32,
    surname: "Doe",
    givenName: "Henry",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 33,
    surname: "Adams",
    givenName: "Alice",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 34,
    surname: "Brown",
    givenName: "Charlie",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 35,
    surname: "White",
    givenName: "Frank",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 36,
    surname: "White",
    givenName: "Ivy",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 37,
    surname: "Turner",
    givenName: "John",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 38,
    surname: "Adams",
    givenName: "Jack",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 39,
    surname: "Green",
    givenName: "Jane",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 40,
    surname: "White",
    givenName: "Grace",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 41,
    surname: "Doe",
    givenName: "Charlie",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 42,
    surname: "Adams",
    givenName: "Ella",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 43,
    surname: "Green",
    givenName: "David",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 44,
    surname: "White",
    givenName: "Ivy",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 45,
    surname: "Adams",
    givenName: "Henry",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 46,
    surname: "Turner",
    givenName: "Jack",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 47,
    surname: "White",
    givenName: "Jane",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 48,
    surname: "Brown",
    givenName: "John",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 49,
    surname: "Turner",
    givenName: "Ella",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
  {
    id: 50,
    surname: "Johnson",
    givenName: "David",
    moreDetails: "https://dev4.thedottsolutions.com/GEFX/",
  },
]);

// Handlers for edit and delete actions
const handleEdit = (item) => {
  console.log("Edit item:", item);
  // Implement your edit logic here
};

const handleDelete = (item) => {
  console.log("Delete item:", item);
  // Implement your delete logic here
};
</script>

<style scoped>
.customer {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.customer .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-12) 0;
  border-bottom: 1px solid var(--light-grey);
}

.customer .title a {
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
}
</style>
