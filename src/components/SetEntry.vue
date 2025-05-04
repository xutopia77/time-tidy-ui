<template>
    <div class="set-entry">
        <input type="text" placeholder="Set base folder" />
        <button @click="btnclk_set">Set</button>
    </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import axios from 'axios';

function btnclk_set() {
    console.log('btnclk_set')
    axios.post(`${appStore.srvPrefix}/api/v1/folder_set`, JSON.stringify({ folder: "/" }))
        .then((response) => {
            console.log('file info:', response.data);
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}

</script>

<style scoped>
.set-entry {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
</style>