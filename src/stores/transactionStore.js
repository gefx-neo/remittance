// stores/transactionStore.js
import { defineStore } from "pinia";

export const useTransactionStore = defineStore("transactionStore", {
  state: () => ({
    transactions: [
      {
        number: "#60011234",
        date: "28 July 2024",
        status: "Unpaid",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        number: "#60011233",
        date: "27 July 2024",
        status: "Pending",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        number: "#60011232",
        date: "26 July 2024",
        status: "Pending",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        number: "#60011231",
        date: "16 June 2024",
        status: "Completed",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        number: "#60011230",
        date: "28 July 2024",
        status: "Failed",
        beneficiaryName: "Caleb Takamura",
        beneficiaryBankName: "Bank of Japan",
        beneficiaryBankAccountNumber: "66335012",
        sendingAmount: "100,000 YEN",
        receivingAmount: "842 SGD",
      },
    ],
  }),
  getters: {
    getTransactions: (state) => state.transactions,
  },
  actions: {},
});
