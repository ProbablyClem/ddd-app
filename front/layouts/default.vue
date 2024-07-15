<template>
    <div class="flex h-screen border-8"
        :class="{ 'border-accountant': isAccountant, 'border-management': isManagement, 'border-sales': isSales }">
        <!-- Toggle Button -->
        <button @click="toggleSidebar" v-if="!showSidebar"
            class="absolute top-1/2 transform -translate-y-1/2 left-2 mr-2 focus:outline-none">

            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
        <!-- Sidebar -->
        <div class="bg-primary text-white w-64 flex-shrink-0 relative" v-if="showSidebar">
            <button @click="toggleSidebar"
                class="absolute top-1/2 transform -translate-y-1/2 right-0 mr-2 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>


            <!-- Sidebar Content -->
            <div class="p-4">
                <div class="flex items-center gap-2">
                    <div class="card  border-4 rounded-lg w-12 h-12 flex items-center justify-center"
                        :class="{ 'border-accountant': isAccountant, 'border-management': isManagement, 'border-sales': isSales }">
                        <div v-if="isAccountant">📗</div>
                        <div v-if="isManagement">💼</div>
                        <div v-if="isSales">📈</div>
                    </div>
                    <div class="text-xl">{{ username }}</div>
                </div>


                <div class="divider"></div>
                <ul class="mt-4 flex flex-col justify-center">
                    <li class="mb-2" v-for="       path        in       pathForUser(paths)      ">
                        <nuxt-link :to="path.path" class="text-white text-xl">{{
            path.name }}</nuxt-link>

                    </li>


                </ul>
            </div>
            <nuxt-link to="/home"
                class="absolute bottom-0 mb-4 ml-4 text-2xl bg-transparent border-none flex items-center">
                <div class="imgLogout"></div>
            </nuxt-link>
            <nuxt-link to="/profil"
                class="absolute bottom-0 left-48 mb-4 ml-4 text-2xl bg-transparent border-none flex items-center">
                <div class="imgParameters"></div>
            </nuxt-link>
        </div>

        <!-- Main Content -->
        <div class="flex flex-col flex-1 overflow-auto">
            <!-- Header -->
            <div class="bg-primary shadow-md p-4 flex flex-row justify-between">

            </div>
            <!-- Page Content -->
            <div class="p-4">
                <slot></slot>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore();

const username = authStore.getUsername()
const isAccountant = authStore.getIsAccountant()
const isManagement = authStore.getIsManagement()
const isSales = authStore.getIsSales()

const pathForUser = (path) => {
    return path.filter((p) => {
        if (isAccountant && p.accountant) {
            return p
        }
        if (isManagement && p.management) {
            return p
        }
        if (isSales && p.sales) {
            return p
        }
    })
}
const paths = [
    // { name: 'X', path: '/', management: true, accountant: false, sales: true },
    // { name: 'Y', path: '/y', management: true, accountant: true, sales: false },
    // { name: 'Z', path: '/z', management: true, accountant: false, sales: false }
]
</script>

<script>
export default {
    data() {
        return {
            showSidebar: true
        };
    },
    methods: {
        toggleSidebar() {
            this.showSidebar = !this.showSidebar;
        },
    }
};
</script>
