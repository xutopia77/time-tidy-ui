<template>
    <div class="h-full flex flex-col border-l border-border bg-bg-secondary select-none" style="width: 56px;">
        <div ref="scrollRef" class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden xc-scrollbar py-1 px-1">
            <template v-for="(month, idx) in months" :key="month.key">
                <!-- year label -->
                <div v-if="isYearStart(idx)"
                    class="text-text-tertiary leading-none px-0.5"
                    style="font-size: 9px; height: 14px;">
                    {{ month.key.slice(0, 4) }}
                </div>
                <!-- month bar -->
                <div class="relative cursor-pointer rounded-sm transition-colors duration-100 hover:bg-bg-elevated"
                    :style="{ height: `${month.height}px`, marginBottom: '1px' }"
                    :title="`${month.key} (${month.count})`"
                    @click.stop="onMonthClick(month.key)">
                    <div class="absolute bottom-0 left-0 rounded-sm bg-primary/60"
                        :style="{ width: '24px', height: `${month.ratio * 100}%`, minHeight: month.count > 0 ? '2px' : '0' }">
                    </div>
                    <span class="absolute top-0 right-0 text-text-tertiary leading-none" style="font-size: 8px;">{{ month.key.slice(5, 7) }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import type { File as FileType, DirItem } from '@/utils/dataTypedef';

const pxPerFile = 1;
const minMonthHeight = 20;

interface MonthGroup {
    key: string;
    count: number;
    ratio: number;
    firstIndex: number;
    height: number;
}

const props = defineProps<{
    items: Array<FileType | DirItem>;
    scrollRatio: number;
}>();

const emit = defineEmits<{
    (e: 'scroll-to-index', index: number): void;
}>();

const scrollRef = ref<HTMLDivElement | null>(null);

const months = computed<MonthGroup[]>(() => {
    const map = new Map<string, { count: number; firstIndex: number }>();

    for (let i = 0; i < props.items.length; i++) {
        const item = props.items[i];
        if ('dir' in item) continue;

        const file = item as FileType;
        const timeStr = file.time || file.create_time || '';
        if (!timeStr) continue;

        const match = timeStr.slice(0, 7);
        if (!/^\d{4}-\d{2}$/.test(match)) continue;

        if (!map.has(match)) {
            map.set(match, { count: 0, firstIndex: i });
        }
        map.get(match)!.count++;
    }

    const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const maxCount = Math.max(1, ...entries.map(([, v]) => v.count));

    return entries.map(([key, val]) => ({
        key,
        count: val.count,
        ratio: val.count / maxCount,
        firstIndex: val.firstIndex,
        height: Math.max(minMonthHeight, val.count * pxPerFile),
    }));
});

function isYearStart(idx: number): boolean {
    if (idx === 0) return true;
    return months.value[idx].key.slice(0, 4) !== months.value[idx - 1].key.slice(0, 4);
}

function onMonthClick(key: string) {
    const month = months.value.find(m => m.key === key);
    if (month) {
        emit('scroll-to-index', month.firstIndex);
    }
}

// sync scroll position with VirtualScroll
watch(() => props.scrollRatio, async (ratio) => {
    await nextTick();
    if (!scrollRef.value) return;
    const el = scrollRef.value;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
});
</script>
