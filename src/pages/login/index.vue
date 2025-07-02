<template>
  <view class="login-container">
    <view class="logo-area">
      <view class="logo-wrapper">
        <text class="logo-icon">V</text>
      </view>
      <text class="title">用户登录</text>
    </view>

    <view class="form-area">
      <view class="input-item">
        <uni-icons type="person" size="20" color="#8a9aa9"></uni-icons>
        <input 
          class="input" 
          type="text" 
          v-model="formData.username" 
          placeholder="请输入用户名" 
          placeholder-style="color: #8a9aa9;" 
        />
      </view>
      
      <view class="input-item">
        <uni-icons type="locked" size="20" color="#8a9aa9"></uni-icons>
        <input 
          class="input" 
          :type="showPassword ? 'text' : 'password'" 
          v-model="formData.password" 
          placeholder="请输入密码" 
          placeholder-style="color: #8a9aa9;" 
        />
        <view class="password-icon" @click="togglePasswordVisibility">
          <uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="20" color="#8a9aa9"></uni-icons>
        </view>
      </view>

      <button class="login-btn" @click="handleLogin">登录</button>
      
      <view class="register-link">
        还没有账号？<text class="link" @click="goToRegister">去注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 表单数据
const formData = reactive({
  username: '',
  password: ''
});

// 密码可见性
const showPassword = ref(false);

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 登录处理
const handleLogin = () => {
  // 表单验证
  if (!formData.username.trim()) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none'
    });
    return;
  }
  
  if (!formData.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    });
    return;
  }
  
  // 发送登录请求
  uni.showLoading({
    title: '登录中...'
  });
  
  // 发送登录请求
  uni.request({
    url: '/api/v1/login',
    method: 'POST',
    data: {
      name: formData.username,
      password: formData.password
    },
    timeout: 10000, // 设置超时时间为10秒
    success: (res: any) => {
      uni.hideLoading();
      
      if (res.data && res.data.code === 200) {
        // 保存用户信息和token到本地存储
        try {
          uni.setStorageSync('token', res.data.token);
          uni.setStorageSync('userInfo', JSON.stringify(res.data.data));
        } catch (e) {
          console.error('存储用户信息失败', e);
        }
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 登录成功后跳转到首页
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        uni.showToast({
          title: res.data?.msg || '登录失败，请检查用户名和密码',
          icon: 'none'
        });
      }
    },
    fail: (err) => {
      uni.hideLoading();
      console.error('登录请求失败:', err);
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      });
    }
  });
};

// 跳转到注册页
const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/index'
  });
};

onLoad(() => {
  // 页面加载时的初始化操作
});
</script>

<style lang="scss">
.login-container {
  padding: 40rpx 60rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  margin-top: 120rpx;
  
  .logo-wrapper {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff9966, #ff5e62);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30rpx;
    box-shadow: 0 8rpx 20rpx rgba(255, 153, 102, 0.3);
    
    .logo-icon {
      font-size: 100rpx;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
  
  .title {
    font-size: 42rpx;
    font-weight: bold;
    color: #fff;
    letter-spacing: 4rpx;
  }
}

.form-area {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 4rpx 30rpx rgba(0, 0, 0, 0.2);
}

.input-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25rpx 0;
  margin-bottom: 40rpx;
  position: relative;
  
  .input {
    flex: 1;
    margin-left: 20rpx;
    font-size: 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    color: #fff;
  }
  
  .password-icon {
    padding: 0 10rpx;
  }
}

.login-btn {
  background: linear-gradient(45deg, #ff9966, #ff5e62);
  color: white;
  border-radius: 50rpx;
  font-size: 32rpx;
  height: 90rpx;
  line-height: 90rpx;
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  box-shadow: 0 4rpx 10rpx rgba(255, 153, 102, 0.3);
  
  &:active {
    opacity: 0.8;
    transform: translateY(2rpx);
  }
}

.register-link {
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 20rpx;
  
  .link {
    color: #ff9966;
    display: inline-block;
    padding: 10rpx;
    font-weight: bold;
  }
}
</style> 