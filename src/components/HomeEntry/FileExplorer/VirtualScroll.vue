<template>
    <div ref="scrollerRef" class="w-full h-full overflow-auto relative" @scroll.passive="onScroll">
        <!-- ghost container to keep total scroll height -->
        <div :style="{ height: totalHeight + 'px', position: 'relative' }">
            <div v-for="cell in visibleCells" :key="cell.key" class="absolute" :style="{
                top: cell.top + 'px',
                left: cell.left + 'px',
                width: itemWidth + 'px',
                height: rowHeight + 'px',
            }">
                <slot name="item" :item="cell.item" :index="cell.index" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Lap-style virtual scrolling: no debounce (rAF coalescing instead),
// ResizeObserver-driven reactive container size, absolute positioned cells.
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = withDefaults(
    defineProps<{
        items: unknown[];
        itemWidth: number;
        rowHeight: number;
        gap?: number;
        bufferRows?: number;
        keyField?: string;
        resetOnChange?: boolean;
    }>(),
    {
        gap: 0,
        bufferRows: 3,
        keyField: 'id',
        resetOnChange: false,
    },
);

const emit = defineEmits<{
    (e: 'scroll', payload: { ratio: number }): void;
}>();

const scrollerRef = ref<HTMLDivElement | null>(null);
const scrollOffset = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);

let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;

// ---- layout (all based on reactive size, no direct DOM reads in computed) ----
const columns = computed(() => {
    const w = containerWidth.value;
    if (w <= 0 || props.itemWidth <= 0) return 1;
    return Math.max(1, Math.floor((w + props.gap) / (props.itemWidth + props.gap)));
});

const totalRows = computed(() => Math.ceil(props.items.length / columns.value));

const totalHeight = computed(() => {
    const rows = totalRows.value;
    if (rows === 0) return 0;
    return rows * props.rowHeight + (rows - 1) * props.gap;
});

const startRow = computed(() => {
    const step = props.rowHeight + props.gap;
    return Math.max(0, Math.floor(scrollOffset.value / step) - props.bufferRows);
});

const endRow = computed(() => {
    const step = props.rowHeight + props.gap;
    const visibleCount = Math.ceil((containerHeight.value || 600) / step);
    return Math.min(totalRows.value, startRow.value + visibleCount + props.bufferRows * 2);
});

const visibleCells = computed(() => {
    const step = props.rowHeight + props.gap;
    const cols = columns.value;
    const out: { key: string | number; item: unknown; index: number; top: number; left: number }[] = [];

    for (let i = startRow.value * cols; i < Math.min(props.items.length, endRow.value * cols); i++) {
        const item = props.items[i];
        const row = Math.floor(i / cols);
        const col = i % cols;
        out.push({
            key: getKey(item, i),
            item,
            index: i,
            top: row * step,
            left: col * (props.itemWidth + props.gap),
        });
    }
    return out;
});

function getKey(item: unknown, index: number): string | number {
    if (item && typeof item === 'object' && props.keyField in item) {
        const v = (item as Record<string, unknown>)[props.keyField];
        if (v !== null && v !== undefined) return v as string | number;
    }
    return index;
}

// ---- scroll: synchronous update, coalesced per frame with rAF ----
function onScroll() {
    if (rafId !== null) return; // merge multiple events in the same frame
    rafId = requestAnimationFrame(() => {
        rafId = null;
        const el = scrollerRef.value;
        if (!el) return;
        scrollOffset.value = el.scrollTop; // read inside the frame for the latest value
        const ratio =
            el.scrollHeight > el.clientHeight
                ? el.scrollTop / (el.scrollHeight - el.clientHeight)
                : 0;
        emit('scroll', { ratio });
    });
}

function updateContainerSize() {
    const el = scrollerRef.value;
    if (!el) return;
    containerWidth.value = el.clientWidth;
    containerHeight.value = el.clientHeight;
}

onMounted(() => {
    updateContainerSize();
    if (scrollerRef.value) {
        resizeObserver = new ResizeObserver(updateContainerSize);
        resizeObserver.observe(scrollerRef.value);
    }
});

onBeforeUnmount(() => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    resizeObserver?.disconnect();
    resizeObserver = null;
});

// keep position on data change by default (opt-in reset)
watch(() => props.items, () => {
    if (!props.resetOnChange) return;
    nextTick(() => {
        scrollToTop();
    });
});

// ---- public API (same as the old component) ----
function scrollToTop() {
    scrollOffset.value = 0;
    if (scrollerRef.value) scrollerRef.value.scrollTop = 0;
}

function scrollToItem(index: number) {
    const row = Math.floor(index / columns.value);
    const target = row * (props.rowHeight + props.gap);
    scrollOffset.value = target;
    if (scrollerRef.value) scrollerRef.value.scrollTop = target;
}

defineExpose({ scrollToTop, scrollToItem });
</script>
