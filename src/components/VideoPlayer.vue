<!-- 在 .vue 页面或组件中 -->
<template>
  <view class="video-container">
    <video
      :src="videoSrc"
      :poster="posterUrl"
      :controls="true"
      :show-center-play-btn="false"
      :enable-play-gesture="true"
      :play-btn-position="'center'"
      :autoplay="false"
      class="custom-video"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
      id="myVideo"
    ></video>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'

const props = defineProps({
  videoSrc: {
    type: String,
    required: true,
    validator: (url) => {
      try {
        new URL(url)
        return true
      } catch {
        console.error('Invalid video URL:', url)
        return false
      }
    }
  },
  posterUrl: {
    type: String,
    default: 'http://vjs.zencdn.net/v/oceans.png'
  }
})

// 视频上下文（用于API控制）
const videoContext = ref(null)

// 初始化视频控制器
const initVideoController = () => {
  videoContext.value = uni.createVideoContext('myVideo')
  
  // 设置播放速率（部分平台支持）
  if (uni.getSystemInfoSync().platform !== 'h5') {
    videoContext.value.playbackRate(1.0) // 初始速率
  }
}

// 生命周期
onLoad(() => {
  initVideoController()
})

onUnload(() => {
  if (videoContext.value) {
    videoContext.value.stop() // 停止播放
    videoContext.value = null
  }
})

// 事件处理
const onPlay = () => {
  console.log('视频开始播放')
}

const onPause = () => {
  console.log('视频暂停')
}

const onError = (e) => {
  console.error('视频错误:', e.detail.errMsg)
  uni.showToast({
    title: '视频加载失败',
    icon: 'none'
  })
}
</script>

<style scoped>
.video-container {
  width: 100%;
  height: 0;
  padding-top: 56.25%; /* 16:9 比例 */
  position: relative;
  border-radius: 15rpx;
  overflow: hidden;
  background: #000; /* 黑边填充 */
}

.custom-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 覆盖默认控制条样式 */
::v-deep .uni-video-controls {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7),
    transparent
  ) !important;
}

::v-deep .uni-video-play-btn {
  width: 60rpx !important;
  height: 60rpx !important;
}
</style>