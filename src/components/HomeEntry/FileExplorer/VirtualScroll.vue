<template>
    <div ref="scrollContainer" class="xc-scrollbar w-full h-full" @scroll="onScroll">
        <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
            <div :style="{ transform: `translateY(${offsetY}px)`, display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${itemWidth}px)`, gap: `${gap}px` }"
                 class="absolute left-0 right-0 top-0">
                <slot v-for="(item, i) in visibleItems" :key="getItemKey(item, startIdx + i)"
                      name="item" :item="item" :index="startIdx + i"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const emit = defineEmits<{
    (e: 'scroll', payload: { ratio: number }): void;
}>();

const props = withDefaults(defineProps<{
    items: unknown[];
    itemWidth: number;
    rowHeight: number;
    bufferRows?: number;
    gap?: number;
}>(), {
    bufferRows: 3,
    gap: 0,
});

const scrollContainer = ref<HTMLDivElement | null>(null);
const scrollTop = ref(0);
let scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null;

// read container dimensions directly from DOM - always fresh, no caching issues
function getContainerWidth(): number {
    return scrollContainer.value?.clientWidth || 0;
}

function getContainerHeight(): number {
    return scrollContainer.value?.clientHeight || 0;
}

function getColumns(): number {
    const w = getContainerWidth();
    if (w <= 0 || props.itemWidth <= 0) return 5;
    return Math.max(1, Math.floor((w + props.gap) / (props.itemWidth + props.gap)));
}

// reactive trigger: re-compute when scrollTop changes
// getColumns/getContainerHeight read DOM directly so they're always accurate
const totalHeight = computed(() => {
    const cols = getColumns();
    const rows = Math.ceil(props.items.length / cols);
    return rows * props.rowHeight + Math.max(0, rows - 1) * props.gap;
});

const startIdx = computed(() => {
    const cols = getColumns();
    const row = Math.max(0, Math.floor(scrollTop.value / (props.rowHeight + props.gap)) - props.bufferRows);
    return row * cols;
});

const endIdx = computed(() => {
    const cols = getColumns();
    const h = getContainerHeight() || window.innerHeight;
    const lastVisibleRow = Math.floor(scrollTop.value / (props.rowHeight + props.gap)) + Math.ceil(h / props.rowHeight) + props.bufferRows;
    const totalRows = Math.ceil(props.items.length / cols);
    return Math.min(props.items.length, Math.min(lastVisibleRow, totalRows) * cols);
});

const offsetY = computed(() => {
    const row = Math.max(0, Math.floor(scrollTop.value / (props.rowHeight + props.gap)) - props.bufferRows);
    return row * (props.rowHeight + props.gap);
});

const visibleItems = computed(() => {
    return props.items.slice(startIdx.value, endIdx.value);
});

function getItemKey(item: unknown, index: number): string | number {
    if (typeof item === 'object' && item !== null && 'id' in item && (item as { id: unknown }).id != null) return (item as { id: number }).id;
    return index;
}

function onScroll() {
    if (!scrollContainer.value) return;
    const currentScrollTop = scrollContainer.value.scrollTop;

    // emit scroll ratio immediately for timeline sync
    const containerH = scrollContainer.value.clientHeight;
    const totalH = scrollContainer.value.scrollHeight;
    const ratio = totalH > containerH ? currentScrollTop / (totalH - containerH) : 0;
    emit('scroll', { ratio });

    // debounce scrollTop update to avoid excessive re-rendering during fast scroll
    if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = setTimeout(() => {
        scrollTop.value = currentScrollTop;
    }, 150);
}

// reset scroll when items change
watch(() => props.items, () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
        scrollTop.value = 0;
    }
});

function scrollToTop() {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
    }
}

function scrollToItem(index: number) {
    if (!scrollContainer.value) return;
    const cols = getColumns();
    const row = Math.floor(index / cols);
    const target = row * (props.rowHeight + props.gap);
    scrollContainer.value.scrollTop = target;
    scrollTop.value = target;
}

defineExpose({ scrollToTop, scrollToItem });
</script>
