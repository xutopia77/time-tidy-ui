<template>
    <div class="py-3 border-b border-border">
        <h4 class="flex items-center gap-1 m-0 mb-3 text-base text-text-primary font-medium cursor-pointer select-none" @click="$emit('update:collapsed', !collapsed)">
            <span class="text-base transition-transform duration-200" :class="{ 'rotate-[-90deg]': collapsed }">▾</span>
            <span class="text-base">🔖</span>
            {{ t('sidebar.tagPanel') }}
            <span class="text-text-secondary font-normal text-sm">({{ tags.length }})</span>
        </h4>
        <div class="flex flex-col gap-2" v-if="!collapsed">
            <div class="flex flex-wrap gap-1" v-if="tags.length > 0">
                <span
                    v-for="tag in tags"
                    :key="tag.id"
                    class="py-0.5 px-2 rounded-sm text-xs text-white cursor-pointer transition-all duration-100 hover:opacity-80"
                    :style="{ backgroundColor: tag.color }"
                    @click="onTagClick(tag)">
                    {{ Utils.tagName2Display(tag.name) }}
                </span>
            </div>
            <div v-else class="text-center py-3">
                <span class="text-text-secondary text-sm">{{ t('sidebar.noTags') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as DatType from '@/utils/dataTypedef'
import Utils from '@/utils/utils'

const { t } = useI18n()

defineProps<{
    tags: DatType.TagItem[];
    collapsed: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
    (e: 'tag-click', tag: DatType.TagItem): void;
}>();

function onTagClick(tag: DatType.TagItem) {
    emit('tag-click', tag);
}
</script>
