<template>
  <view class="user-center">
    <!-- 用户信息区域 - 已登录状态 -->
    <view class="user-header" v-if="isLoggedIn">
      <view class="user-bg"></view>
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <view class="user-detail">
          <view class="username">{{ userInfo.nickname }}</view>
          <view class="user-id">ID: {{ userInfo.userId }}</view>
        </view>
        <view class="edit-btn" @tap="editProfile">编辑资料</view>
      </view>
      
      <!-- 用户数据统计 -->
      <view class="user-stats">
        <view class="stat-item" @tap="navigateTo('/pages/user/follows')">
          <view class="num">{{ userInfo.follows }}</view>
          <view class="label">关注</view>
        </view>
        <view class="stat-item" @tap="navigateTo('/pages/user/fans')">
          <view class="num">{{ userInfo.fans }}</view>
          <view class="label">粉丝</view>
        </view>
        <view class="stat-item" @tap="navigateTo('/pages/user/likes')">
          <view class="num">{{ userInfo.likes }}</view>
          <view class="label">获赞</view>
        </view>
      </view>
    </view>
    
    <!-- 未登录状态 -->
    <view class="user-header not-login" v-else>
      <view class="user-bg"></view>
      <view class="user-info">
        <image class="avatar" src="../../static/default-avatar.png" mode="aspectFill"></image>
        <view class="user-detail">
          <view class="username">未登录</view>
          <view class="user-id">登录后查看更多功能</view>
        </view>
        <view class="login-btn" @tap="goToLogin">立即登录</view>
      </view>
    </view>
    
    <!-- 我的作品、收藏等选项卡 - 已登录状态 -->
    <block v-if="isLoggedIn">
      <view class="tab-section">
        <view 
          class="tab-item" 
          v-for="(tab, index) in tabs" 
          :key="index"
          :class="{ active: currentTab === index }"
          @tap="switchTab(index)"
        >
          {{ tab.name }}
        </view>
      </view>
      
      <!-- 选项卡内容 -->
      <swiper class="tab-content" :current="currentTab" @change="onSwiperChange">
        <!-- 我的作品 -->
        <swiper-item>
          <scroll-view scroll-y class="video-scroll">
            <view class="video-grid">
              <view 
                class="video-item"
                v-for="video in myVideos"
                :key="video.id"
                @tap="playVideo(video)"
              >
                <view class="video-cover">
                  <image :src="video.coverUrl" mode="aspectFill"></image>
                  <view class="video-duration">{{ formatDuration(video.duration) }}</view>
                </view>
                <view class="video-title">{{ video.title }}</view>
                <view class="video-stats">
                  <text>{{ formatViews(video.views) }}播放</text>
                </view>
              </view>
            </view>
            <view class="empty-tip" v-if="myVideos.length === 0">
              <text>暂无作品</text>
              <view class="upload-btn" @tap="uploadVideo">上传视频</view>
            </view>
          </scroll-view>
        </swiper-item>
        
        <!-- 我的收藏 -->
        <swiper-item>
          <scroll-view scroll-y class="video-scroll">
            <view class="video-grid">
              <view 
                class="video-item"
                v-for="video in collectedVideos"
                :key="video.id"
                @tap="playVideo(video)"
              >
                <view class="video-cover">
                  <image :src="video.coverUrl" mode="aspectFill"></image>
                  <view class="video-duration">{{ formatDuration(video.duration) }}</view>
                </view>
                <view class="video-title">{{ video.title }}</view>
                <view class="video-stats">
                  <text>{{ formatViews(video.views) }}播放</text>
                </view>
              </view>
            </view>
            <view class="empty-tip" v-if="collectedVideos.length === 0">
              <text>暂无收藏</text>
              <view class="browse-btn" @tap="navigateTo('/pages/index/index')">去浏览</view>
            </view>
          </scroll-view>
        </swiper-item>
        
        <!-- 观看历史 -->
        <swiper-item>
          <scroll-view scroll-y class="video-scroll">
            <view class="video-grid">
              <view 
                class="video-item"
                v-for="video in historyVideos"
                :key="video.id"
                @tap="playVideo(video)"
              >
                <view class="video-cover">
                  <image :src="video.coverUrl" mode="aspectFill"></image>
                  <view class="video-duration">{{ formatDuration(video.duration) }}</view>
                  <view class="progress-bar" :style="{ width: video.progress + '%' }"></view>
                </view>
                <view class="video-title">{{ video.title }}</view>
                <view class="video-stats">
                  <text>{{ formatViews(video.views) }}播放</text>
                </view>
              </view>
            </view>
            <view class="empty-tip" v-if="historyVideos.length === 0">
              <text>暂无观看历史</text>
              <view class="browse-btn" @tap="navigateTo('/pages/index/index')">去浏览</view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </block>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-title">我的服务</view>
      <view class="menu-list">
        <view class="menu-item" @tap="navigateTo('/pages/user/settings')">
          <text class="iconfont icon-settings"></text>
          <text class="menu-name">设置</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view class="menu-item" @tap="navigateTo('/pages/user/download')">
          <text class="iconfont icon-download"></text>
          <text class="menu-name">离线缓存</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view class="menu-item" @tap="navigateTo('/pages/user/feedback')">
          <text class="iconfont icon-feedback"></text>
          <text class="menu-name">意见反馈</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view class="menu-item" @tap="navigateTo('/pages/user/about')">
          <text class="iconfont icon-about"></text>
          <text class="menu-name">关于我们</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view class="menu-item" v-if="isLoggedIn" @tap="logout">
          <text class="iconfont icon-logout"></text>
          <text class="menu-name">退出登录</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view class="menu-item" v-else @tap="goToLogin">
          <text class="iconfont icon-login"></text>
          <text class="menu-name">登录/注册</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';

// 用户登录状态
const isLoggedIn = ref(false);

// 用户信息
const userInfo = ref({
  nickname: '视频达人',
  userId: '10086888',
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  follows: 128,
  fans: 256,
  likes: 1024
});

// 选项卡
const tabs = ref([
  { name: '作品' },
  { name: '收藏' },
  { name: '历史' }
]);
const currentTab = ref(0);

// 我的视频列表
const myVideos = ref<any[]>([]);
// 收藏视频列表
const collectedVideos = ref<any[]>([]);
// 历史视频列表
const historyVideos = ref<any[]>([]);

// 切换选项卡
const switchTab = (index: number) => {
  currentTab.value = index;
};

// 滑动切换
const onSwiperChange = (e: any) => {
  currentTab.value = e.detail.current;
};

// 编辑资料
const editProfile = () => {
  uni.showToast({
    title: '编辑资料功能开发中',
    icon: 'none'
  });
};

// 上传视频
const uploadVideo = () => {
  uni.showToast({
    title: '上传视频功能开发中',
    icon: 'none'
  });
};

// 页面跳转
const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息和token
        try {
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
        } catch (e) {
          console.error('清除存储失败', e);
        }
        
        isLoggedIn.value = false;
        
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
      }
    }
  });
};

// 播放视频
const playVideo = (video: any) => {
  uni.navigateTo({
    url: `/pages/video/detail?id=${video.id}`
  });
};

// 格式化时长
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// 格式化数字
const formatViews = (views: number) => {
  if (views >= 100000000) {
    return (views / 100000000).toFixed(1) + '亿';
  }
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + '万';
  }
  return views.toString();
};

// 检查登录状态
const checkLoginStatus = () => {
  try {
    const token = uni.getStorageSync('token');
    const userInfoStr = uni.getStorageSync('userInfo');
    
    if (token && userInfoStr) {
      isLoggedIn.value = true;
      const savedUserInfo = JSON.parse(userInfoStr);
      // 如果有存储的用户信息，更新用户信息
      if (savedUserInfo) {
        userInfo.value = {
          ...userInfo.value,
          nickname: savedUserInfo.name || '视频达人',
          userId: savedUserInfo.id || '10086888',
        };
      }
    } else {
      isLoggedIn.value = false;
    }
  } catch (e) {
    console.error('获取登录状态失败', e);
    isLoggedIn.value = false;
  }
};

// 加载数据
const loadData = async () => {
  try {
    // 首先检查登录状态
    checkLoginStatus();
    
    // 如果已登录，才加载用户数据
    if (isLoggedIn.value) {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟我的视频数据
      myVideos.value = Array(6).fill(0).map((_, index) => ({
        id: `my-${index}`,
        title: `我的视频 ${index + 1}`,
        coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
        duration: Math.floor(Math.random() * 300), // 0-5分钟
        views: Math.floor(Math.random() * 10000)
      }));
      
      // 模拟收藏视频数据
      collectedVideos.value = Array(8).fill(0).map((_, index) => ({
        id: `collect-${index}`,
        title: `收藏视频 ${index + 1}`,
        coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
        duration: Math.floor(Math.random() * 7200), // 0-2小时
        views: Math.floor(Math.random() * 1000000)
      }));
      
      // 模拟历史视频数据
      historyVideos.value = Array(10).fill(0).map((_, index) => ({
        id: `history-${index}`,
        title: `历史视频 ${index + 1}`,
        coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
        duration: Math.floor(Math.random() * 7200), // 0-2小时
        views: Math.floor(Math.random() * 1000000),
        progress: Math.floor(Math.random() * 100) // 观看进度
      }));
    } else {
      // 未登录状态，清空数据
      myVideos.value = [];
      collectedVideos.value = [];
      historyVideos.value = [];
    }
  } catch (error) {
    console.error('加载数据失败', error);
    uni.showToast({
      title: '加载数据失败',
      icon: 'none'
    });
  }
};

// 页面每次显示时检查登录状态并加载数据
onShow(() => {
  loadData();
});

// 页面加载
onMounted(() => {
  loadData();
});
</script>

<style lang="scss">
.user-center {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
}

.user-header {
  position: relative;
  padding-bottom: 20rpx;
  
  &.not-login {
    .user-bg {
      height: 200rpx;
      background: linear-gradient(45deg, #8a9aa9, #1a2a3a);
    }
    
    .login-btn {
      padding: 10rpx 30rpx;
      background-color: #ff9966;
      border-radius: 40rpx;
      font-size: 24rpx;
      color: #fff;
    }
  }
  
  .user-bg {
    height: 300rpx;
    background: linear-gradient(45deg, #ff9966, #ff5e62);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    margin-top: -80rpx;
    
    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 4rpx solid #fff;
      background-color: #fff;
    }
    
    .user-detail {
      flex: 1;
      margin-left: 30rpx;
      
      .username {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
      }
      
      .user-id {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    
    .edit-btn, .login-btn {
      padding: 10rpx 30rpx;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 40rpx;
      font-size: 24rpx;
      color: #fff;
    }
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
    padding: 40rpx 0 20rpx;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .num {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 6rpx;
      }
      
      .label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.tab-section {
  display: flex;
  padding: 0 30rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  
  .tab-item {
    position: relative;
    padding: 20rpx 0;
    margin-right: 60rpx;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
    
    &.active {
      color: #fff;
      font-weight: bold;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 40rpx;
        height: 4rpx;
        background-color: #ff9966;
        border-radius: 2rpx;
      }
    }
  }
}

.tab-content {
  height: 800rpx;
}

.video-scroll {
  height: 100%;
}

.video-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.video-item {
  width: calc(50% - 20rpx);
  margin: 10rpx;
  
  .video-cover {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56.25%; /* 16:9比例 */
    border-radius: 12rpx;
    overflow: hidden;
    
    image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .video-duration {
      position: absolute;
      bottom: 10rpx;
      right: 10rpx;
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 4rpx 10rpx;
      border-radius: 6rpx;
      font-size: 20rpx;
    }
    
    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4rpx;
      background-color: #ff9966;
    }
  }
  
  .video-title {
    font-size: 26rpx;
    line-height: 1.4;
    margin: 10rpx 0 6rpx;
    color: #fff;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .video-stats {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 28rpx;
  
  .upload-btn, .browse-btn {
    margin-top: 30rpx;
    padding: 16rpx 40rpx;
    background-color: #ff9966;
    color: #fff;
    border-radius: 40rpx;
    font-size: 26rpx;
  }
}

.menu-section {
  padding: 30rpx;
  
  .menu-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20rpx;
  }
  
  .menu-list {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 16rpx;
    overflow: hidden;
    
    .menu-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
      
      &:last-child {
        border-bottom: none;
      }
      
      .iconfont {
        font-size: 40rpx;
        color: rgba(255, 255, 255, 0.7);
        margin-right: 20rpx;
        
        &.icon-arrow-right {
          margin-right: 0;
          margin-left: auto;
          font-size: 30rpx;
          color: rgba(255, 255, 255, 0.3);
        }
      }
      
      .menu-name {
        font-size: 28rpx;
        color: #fff;
      }
    }
  }
}
</style>
