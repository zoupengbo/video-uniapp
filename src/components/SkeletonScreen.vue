<template>
  <view class="skeleton-screen" :style="{ backgroundColor }">
    <view
      v-for="(item, index) in elements"
      :key="index"
      class="skeleton-item"
      :class="{
        'skeleton-animation': animated,
        'skeleton-pulse': animationType === 'pulse',
        'skeleton-wave': animationType === 'wave',
        'skeleton-shimmer': animationType === 'shimmer'
      }"
      :style="{
        width: item.width || '100%',
        height: item.height || '16px',
        marginTop: item.marginTop || '0',
        marginBottom: item.marginBottom || '0',
        marginLeft: item.marginLeft || '0',
        marginRight: item.marginRight || '0',
        borderRadius: item.radius || '4px',
        backgroundColor: item.backgroundColor || skeletonColor,
        animationDelay: item.delay || `${index * 0.1}s`
      }"
    ></view>
  </view>
</template>

<script setup lang="ts">
interface SkeletonElement {
  width?: string;
  height?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  radius?: string;
  backgroundColor?: string;
  delay?: string;
}

const props = defineProps({
  // 骨架屏元素配置数组
  elements: {
    type: Array as () => SkeletonElement[],
    default: () => []
  },
  // 是否启用动画
  animated: {
    type: Boolean,
    default: true
  },
  // 动画类型：shimmer(闪烁), pulse(脉冲), wave(波浪)
  animationType: {
    type: String as () => 'shimmer' | 'pulse' | 'wave',
    default: 'shimmer'
  },
  // 背景颜色
  backgroundColor: {
    type: String,
    default: 'transparent'
  },
  // 骨架屏颜色
  skeletonColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.1)'
  },
  // 动画速度
  animationSpeed: {
    type: String,
    default: '1.5s'
  },
  // 圆角大小
  borderRadius: {
    type: String,
    default: '4px'
  }
});
</script>

<style lang="scss">
.skeleton-screen {
  width: 100%;

  .skeleton-item {
    display: block;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  // 闪烁动画
  .skeleton-shimmer {
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0)
      );
      animation: shimmer v-bind(animationSpeed) infinite;
      transform: translateX(-100%);
    }
  }

  // 脉冲动画
  .skeleton-pulse {
    animation: pulse v-bind(animationSpeed) infinite;
  }

  // 波浪动画
  .skeleton-wave {
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 70%
      );
      animation: wave v-bind(animationSpeed) infinite;
      transform: translateX(-100%) translateY(-100%);
    }
  }

  // 兼容旧版本
  .skeleton-animation {
    @extend .skeleton-shimmer;
  }
}

// 动画关键帧
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes wave {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  100% {
    transform: translateX(100%) translateY(100%);
  }
}

// 响应式适配
@media (prefers-reduced-motion: reduce) {
  .skeleton-item {
    animation: none !important;

    &::after {
      animation: none !important;
    }
  }
}
</style>