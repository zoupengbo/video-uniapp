//创建router.ts
import { createRouter, createWebHashHistory,useRouter } from 'vue-router'
import IndexView from '@/pages/index/index.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            component: IndexView,
            redirect: '/home',
            children: [
                // 子路由
                {
                    path: 'home',
                    name: 'home',
                    component: () => import('@/pages/home/index.vue')
                },
                {
                    path: 'about',
                    name: 'about',
                    component: () => import('@/pages/about/index.vue')
                },
                {
                    path: 'add',
                    name: 'add',
                    component: () => import('@/pages/add/index.vue')
                }

            ]
        },
    ]
})

export {router,useRouter}