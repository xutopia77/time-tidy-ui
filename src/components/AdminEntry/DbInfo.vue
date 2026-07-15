<template>
    <div>
        <p class="text-text-primary">{{ t('dbInfo.title') }}</p>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
