<template>
    <div>
        <button>
            <router-link class="no-underline-link" to="/">Home</router-link>
        </button>
        <button>
            <router-link class="no-underline-link" to="/set">Set</router-link>
        </button>
    </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.no-underline-link {
    text-decoration: none;
}
</style>