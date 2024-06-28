<template>
    <div class="h-screen flex flex-col bg-homeBackground">
        <header class="flex justify-center items-center py-4 bg-homeCard">
            <h1 class="text-4xl font-bold font-site text-homeFont">Stat Viewer</h1>
        </header>
        <div class="flex flex-grow justify-center items-center">
            <div class="flex justify-center items-center w-1/2">
                <div class="card p-8 shadow-xl rounded-lg w-96 bg-homeCard">
                    <h2 class="text-2xl font-bold mb-4 form-title text-homeFont">📈 Bienvenue</h2>
                    <form @submit.prevent="login" class="flex flex-col">
                        <div class="mb-4">
                            <input type="text" placeholder="Identifiant" class="input w-full text-homeFont"
                                v-model="usernameLogin" required />
                        </div>
                        <div class="mb-4">
                            <input type="password" placeholder="Mot de Passe" class="input w-full text-homeFont"
                                v-model="passwordLogin" required>
                        </div>
                        <button type="submit"
                            class="btn bg-homeButton border-homeButton text-homeFont self-end">Login</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore();
const usernameLogin = ref('')
const passwordLogin = ref('')

const users = [
    {
        username: 'Sales',
        password: 'sales',
        isAccountant: false,
        isManagement: false,
        isSales: true
    },
    {
        username: 'Accountant',
        password: 'accountant',
        isAccountant: true,
        isManagement: false,
        isSales: false
    },
    {
        username: 'Management',
        password: 'management',
        isAccountant: false,
        isManagement: true,
        isSales: false
    },
]

const login = () => {
    const user = users.find(user => user.username === usernameLogin.value && user.password === passwordLogin.value)
    if (user) {
        authStore.setUsername(user.username)
        authStore.setIsAccountant(user.isAccountant)
        authStore.setIsManagement(user.isManagement)
        authStore.setIsSales(user.isSales)
        router.push('/dashboard')
    } else {
        alert('Identifiant ou mot de passe incorrect')
    }
}
</script>
