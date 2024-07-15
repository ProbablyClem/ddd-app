import { defineStore } from "pinia";
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAccountant: ref(false),
        isManagement: ref(false),
        isSales: ref(false),
        username: ref(''),
    }),
    actions: {
        setUsername(username) {
            this.username = username
        },
        getUsername() {
            return this.username
        },
        setIsAccountant(isAccountant) {
            this.isAccountant = isAccountant
        },
        getIsAccountant() {
            return this.isAccountant
        },
        setIsManagement(isManagement) {
            this.isManagement = isManagement
        },
        getIsManagement() {
            return this.isManagement
        },
        setIsSales(isSales) {
            this.isSales = isSales
        },
        getIsSales() {
            return this.isSales
        },
    },
    persist: {
        storage: persistedState.localStorage,
    },
})