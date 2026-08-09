<template>
    <div class="flex flex-row items-center px-3 gap-2 bg-bg-secondary">
        <router-link class="no-underline" to="/admin/PrjSet" v-slot="{ isActive }">
            <div
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>{{ t('admin.project') }}</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/TagsMng" v-slot="{ isActive }">
            <div
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>{{ t('admin.tag') }}</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/SimilarityManager" v-slot="{ isActive }">
            <div
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>{{ t('admin.similarity') }}</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/TrashManager" v-slot="{ isActive }">
            <div
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>{{ t('admin.trash') }}</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/AiTagConfig" v-slot="{ isActive }">
            <div
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>{{ t('admin.aiTagConfig') }}</span>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
