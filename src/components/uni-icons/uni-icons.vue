<template>
  <view class="uni-icons" :style="{ color: color, 'font-size': size + 'px' }">
    <!-- 使用简单的替代图标 -->
    <text v-if="type === 'person'">👤</text>
    <text v-else-if="type === 'locked'">🔒</text>
    <text v-else-if="type === 'eye'">👁️</text>
    <text v-else-if="type === 'eye-slash'">👁️‍🗨️</text>
    <text v-else>⚙️</text>
  </view>
</template>

<script>
export default {
  name: 'UniIcons',
  props: {
    type: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#333333'
    },
    size: {
      type: [Number, String],
      default: 16
    }
  }
}
</script>

<style>
.uni-icons {
  font-family: uniicons;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style> 