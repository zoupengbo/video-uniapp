# 骨架屏组件使用说明

## 组件介绍

`SkeletonScreen` 是一个通用的骨架屏组件，可以在不同页面中复用，用于在内容加载时显示占位效果。

## 使用方法

### 1. 引入组件

```vue
<script setup lang="ts">
import SkeletonScreen from '../../components/SkeletonScreen.vue';
</script>
```

### 2. 配置骨架屏元素

```vue
<script setup lang="ts">
import { reactive } from 'vue';

// 定义骨架屏元素配置
const skeletonElements = reactive([
  // 矩形元素
  {
    width: '100%',
    height: '16px',
    marginTop: '10px',
    marginBottom: '10px',
    radius: '4px'
  },
  // 圆形元素
  {
    width: '50px',
    height: '50px',
    radius: '50%'
  },
  // 文本元素
  {
    width: '80%',
    height: '20px',
    marginTop: '8px'
  }
]);
</script>
```

### 3. 在模板中使用

```vue
<template>
  <!-- 骨架屏 -->
  <view v-if="isLoading" class="skeleton-container">
    <skeleton-screen :elements="skeletonElements" />
  </view>
  
  <!-- 实际内容 -->
  <view v-else class="content">
    <!-- 你的实际内容 -->
  </view>
</template>
```

## 属性说明

### elements (Array)
骨架屏元素配置数组，每个元素包含以下属性：

- `width` (String): 宽度，默认 '100%'
- `height` (String): 高度，默认 '16px'
- `marginTop` (String): 上边距，默认 '0'
- `marginBottom` (String): 下边距，默认 '0'
- `radius` (String): 圆角，默认 '4px'

### animated (Boolean)
是否启用动画效果，默认 true

### backgroundColor (String)
背景颜色，默认 'transparent'

## 使用示例

### 视频卡片骨架屏

```vue
<script setup lang="ts">
const videoCardSkeletonElements = reactive([
  // 封面骨架
  {
    height: '0',
    paddingTop: '56.25%', // 16:9比例
    radius: '12rpx',
  },
  // 标题骨架第一行
  {
    height: '26rpx',
    width: '90%',
    marginTop: '10rpx',
  },
  // 标题骨架第二行
  {
    height: '26rpx',
    width: '60%',
    marginTop: '8rpx',
  },
  // 统计信息骨架
  {
    height: '22rpx',
    width: '40%',
    marginTop: '8rpx',
  }
]);
</script>

<template>
  <view class="video-item" v-for="i in 6" :key="'skeleton-' + i">
    <skeleton-screen :elements="videoCardSkeletonElements" />
  </view>
</template>
```

### 文章卡片骨架屏

```vue
<script setup lang="ts">
const articleCardSkeletonElements = reactive([
  // 封面骨架
  {
    width: '200rpx',
    height: '150rpx',
    radius: '12rpx',
    marginRight: '20rpx'
  },
  // 标题骨架
  {
    height: '30rpx',
    width: '100%',
    marginBottom: '10rpx'
  },
  // 摘要骨架
  {
    height: '26rpx',
    width: '90%',
    marginBottom: '15rpx'
  },
  // 统计信息骨架
  {
    height: '24rpx',
    width: '60%'
  }
]);
</script>

<template>
  <view class="article-item" v-for="i in 5" :key="'skeleton-' + i">
    <skeleton-screen :elements="articleCardSkeletonElements" />
  </view>
</template>
```

## 注意事项

1. 骨架屏元素的高度和宽度要与实际内容保持一致
2. 使用 `marginTop` 和 `marginBottom` 来控制元素间距
3. 可以通过 `radius` 属性设置不同的圆角效果
4. 动画效果可以通过 `animated` 属性控制开关
5. 建议在数据加载完成前显示骨架屏，提升用户体验 