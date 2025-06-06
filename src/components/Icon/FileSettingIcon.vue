<template>
    <svg :width="mergedIconProps.width" :height="mergedIconProps.height" viewBox="0 0 48 48" fill="none"
        :class="mergedIconProps.className">
        <path
            d="M10 44H38C39.1046 44 40 43.1046 40 42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z"
            :fill="mergedIconProps.fillColor" :stroke="mergedIconProps.strokeColor"
            :stroke-width="mergedIconProps.strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M30 4L40 14" :stroke="mergedIconProps.strokeColor" :stroke-width="mergedIconProps.strokeWidth"
            stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="24" cy="27" r="5" :fill="mergedIconProps.circleFillColor"
            :stroke="mergedIconProps.circleStrokeColor" :stroke-width="mergedIconProps.strokeWidth" />
        <path d="M24 19V22" :stroke="mergedIconProps.innerStrokeColor" :stroke-width="mergedIconProps.strokeWidth"
            stroke-linecap="round" stroke-linejoin="round" />
        <path d="M24 32V35" :stroke="mergedIconProps.innerStrokeColor" :stroke-width="mergedIconProps.strokeWidth"
            stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29.8281 21L27.7068 23.1213" :stroke="mergedIconProps.innerStrokeColor"
            :stroke-width="mergedIconProps.strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19.8281 31L17.7068 33.1213" :stroke="mergedIconProps.innerStrokeColor"
            :stroke-width="mergedIconProps.strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18 21L20.1213 23.1213" :stroke="mergedIconProps.innerStrokeColor"
            :stroke-width="mergedIconProps.strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M28 31L30.1213 33.1213" :stroke="mergedIconProps.innerStrokeColor"
            :stroke-width="mergedIconProps.strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16 27H17.5H19" :stroke="mergedIconProps.innerStrokeColor" :stroke-width="mergedIconProps.strokeWidth"
            stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29 27H30.5H32" :stroke="mergedIconProps.innerStrokeColor" :stroke-width="mergedIconProps.strokeWidth"
            stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    iconProps: {
        type: Object,
        default: () => ({})
    }
});

// 定义默认的 iconProps
const defaultIconProps = {
    width: '24',
    height: '24',
    fillColor: '#333',
    strokeColor: '#8276c9',
    strokeWidth: '4',
    circleFillColor: '#4d4d4d',
    circleStrokeColor: '#fff',
    innerStrokeColor: '#fff',
    className: ''
};

// 计算属性，合并传入的 iconProps 和默认值
const mergedIconProps = computed(() => ({
    ...defaultIconProps,
    ...props.iconProps
}));
</script>

<style scoped>
/* 可添加额外的样式 */
</style>