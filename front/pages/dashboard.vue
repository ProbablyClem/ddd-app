<template>
    <div>
        <Button>Click me</Button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore();

const username = authStore.getUsername()
</script>