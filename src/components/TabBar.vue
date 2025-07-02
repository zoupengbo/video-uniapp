<template>
    <div class="tab-bar">
        <div v-for="item in tabBarList" :key="item.name" class="tab-bar-item" @click="switchTab(item.path)">
            <image :src="currentPath === item.path ? item.activeIcon : item.icon" class="tab-icon" mode="aspectFit" />
            <text :class="['tab-text', currentPath === item.path ? 'active' : '']">{{ item.name }}</text>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

const currentPath = ref('pages/index/index') // 默认首页

interface TabBarItem {
    name: string
    icon: string
    activeIcon: string
    path: string
}

const tabBarList: TabBarItem[] = reactive([
    {
        name: '首页',
        icon: '/static/home.png',
        activeIcon: '/static/home-active.png',
        path: 'pages/index/index'
    },
    {
        name: '添加',
        icon: '/static/add.png',
        activeIcon: '/static/add-active.png',
        path: 'pages/add/index'
    },
    {
        name: '我的',
        icon: '/static/about.png',
        activeIcon: '/static/about-active.png',
        path: 'pages/about/index'
    }
])

// 切换tab
const switchTab = (path: string) => {
    currentPath.value = path
    uni.switchTab({
        url: `/${path}`
    })
}

// 获取当前页面路径
onMounted(() => {
    const pages = getCurrentPages()
    if (pages.length > 0) {
        const currentPage = pages[pages.length - 1]
        const route = currentPage.route
        
        // 设置当前路径
        for (const item of tabBarList) {
            if (item.path === route) {
                currentPath.value = route
                break
            }
        }
    }
})
</script>

<style>
.tab-bar {
    font-size: 12px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    background-color: rgba(26, 42, 58, 0.95);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    z-index: 999;
}

.tab-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 33.33%;
}

.tab-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 2px;
}

.tab-text {
    font-size: 12px;
    color: #8a9aa9;
}

.tab-text.active {
    color: #ff9966;
}
</style>