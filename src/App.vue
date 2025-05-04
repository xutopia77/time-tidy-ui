<template>
  <HomeEntry />
</template>
<script setup lang="ts">
import HomeEntry from '@/components/HomeEntry.vue';
import { onBeforeMount } from 'vue';
import axios from 'axios';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import Utils from '@/utils/utils'

function get_base_path() {
  axios.post(`${appStore.srvPrefix}/api/v1/folder_get`, JSON.stringify({ folder: "/" }))
    .then((response) => {
      appStore.curFiles = response.data;
      console.log('file info:', response.data);
    })
    .catch((error) => {
      console.error('Error fetching project info:', error);
    });
}

function get_prj_info() {
  axios.post(`${appStore.srvPrefix}/api/v1/project`)
    .then((response) => {
      appStore.prj = response.data;
      console.log('Project info:', appStore.prj);
      get_base_path();
    })
    .catch((error) => {
      console.error('Error fetching project info:', error);
    });
}

onBeforeMount(() => {
  Utils.appstore_set(appStore)
  get_prj_info()
})

</script>

<style scoped></style>
