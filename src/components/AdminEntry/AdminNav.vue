<template>
    <div class="flex flex-row items-center px-3 gap-2 bg-bg-secondary">
        <router-link class="no-underline" to="/admin/PrjSet" v-slot="{ isActive }">
            <div 
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>项目</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/TagsMng" v-slot="{ isActive }">
            <div 
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>标签</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/SimilarityManager" v-slot="{ isActive }">
            <div 
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>相似文件</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/TrashManager" v-slot="{ isActive }">
            <div 
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>回收站</span>
            </div>
        </router-link>

        <router-link class="no-underline" to="/admin/DbInfo" v-slot="{ isActive }">
            <div 
                class="rounded-sm h-10 flex items-center justify-center cursor-pointer transition-all duration-200 px-3 text-text-primary"
                :class="{'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive}"
            >
                <span>数据库</span>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
</script>
