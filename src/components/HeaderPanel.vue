<template>
    <div>
        <span class="nav-button">
            <router-link class="no-underline-link" to="/">
                <img src="@/assets/icons/home.svg" alt="Home Icon" style="width: 20px; height: 20px;">
            </router-link>
        </span>
        <span>
            <router-link class="no-underline-link" to="/set">
                <img src="@/assets/icons/settings.svg" alt="Home Icon" style="width: 20px; height: 20px;">
            </router-link>
        </span>
    </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.no-underline-link {
    text-decoration: none;
}

.nav-button {
    margin-right: 10px;
}
</style>