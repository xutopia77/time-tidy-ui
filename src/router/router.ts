import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router';
import SetEntry from '@/components/AdminEntry/SetEntry.vue'
import HomeEntry from '@/components/HomeEntry.vue';
import AdminEntry from '@/components/AdminEntry.vue';
import SettingsEntry from '@/components/SettingsEntry.vue';

// 定义路由配置数组，使用 RouteRecordRaw 类型进行类型注解
const routes: RouteRecordRaw[] = [
    { path: '/', component: HomeEntry },
    {
        path: '/settings',
        component: SettingsEntry
    },
    {
        path: '/set',
        component: SetEntry
    },
    {
        path: '/admin',
        component: AdminEntry,
        children: [
            { path: 'TagsMng', component: () => import('@/components/AdminEntry/TagsMng.vue') },
            { path: 'SimilarityManager', component: () => import('@/components/AdminEntry/SimilarityManager.vue') },
            { path: 'TrashManager', component: () => import('@/components/AdminEntry/TrashManager.vue') },
            { path: 'PrjSet', component: () => import('@/components/AdminEntry/SetEntry.vue') },
        ]
    }
]

// 创建路由实例
const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes
})

export default router
