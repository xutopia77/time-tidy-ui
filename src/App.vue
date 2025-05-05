<template>
  <AppEntry />
</template>
<script setup lang="ts">
import AppEntry from '@/components/AppEntry.vue';
import { onBeforeMount } from 'vue';
import axios from 'axios';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import Utils from '@/utils/utils'

function get_prj_info() {
  axios.post(`${appStore.srvPrefix}/api/v1/project`)
    .then((response) => {
      appStore.prj = response.data;
      console.log('Project info:', appStore.prj);
      Utils.files_get(null)
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
