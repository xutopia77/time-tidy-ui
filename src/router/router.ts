import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router';
import SetEntry from '@/components/SetEntry.vue'
import FileMain from '@/components/FileMain.vue';

// 定义路由配置数组，使用 RouteRecordRaw 类型进行类型注解
const routes: RouteRecordRaw[] = [
    { path: '/', component: FileMain },
    // {
    //   path: '/board',
    //   component: FileBoard
    // },
    // {
    //   path: '/settings',
    //   component: Settings,
    //   beforeEnter: fetchFileDirData
    // },
    {
        path: '/set',
        component: SetEntry
        // // 如果 adminRouter 是作为子路由使用的，需要确保父路由配置正确，并且子路由能够正确继承父路由的路径。
        // children: adminRouter.options.routes // 嵌套子路由
    }
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
