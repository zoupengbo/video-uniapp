<template>
  <view class="register-container">
    <view class="logo-area">
      <view class="logo-wrapper">
        <text class="logo-icon">V</text>
      </view>
      <text class="title">注册账号</text>
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
      
      <view class="input-item">
        <uni-icons type="locked" size="20" color="#8a9aa9"></uni-icons>
        <input 
          class="input" 
          :type="showConfirmPassword ? 'text' : 'password'" 
          v-model="formData.confirmPassword" 
          placeholder="请确认密码" 
          placeholder-style="color: #8a9aa9;" 
        />
        <view class="password-icon" @click="toggleConfirmPasswordVisibility">
          <uni-icons :type="showConfirmPassword ? 'eye' : 'eye-slash'" size="20" color="#8a9aa9"></uni-icons>
        </view>
      </view>
      
      <view class="role-select">
        <text>选择角色：</text>
        <radio-group @change="roleChange">
          <label class="radio-item">
            <radio value="1" :checked="formData.role === '1'" color="#ff9966" />
            <text>管理员</text>
          </label>
          <label class="radio-item">
            <radio value="2" :checked="formData.role === '2'" color="#ff9966" />
            <text>普通用户</text>
          </label>
        </radio-group>
      </view>

      <button class="register-btn" @click="handleRegister">注册</button>
      
      <view class="login-link">
        已有账号？<text class="link" @click="goToLogin">去登录</text>
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
  password: '',
  confirmPassword: '',
  role: '2' // 默认为普通用户
});

// 密码可见性
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 切换确认密码可见性
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 角色选择
const roleChange = (e: any) => {
  formData.role = e.detail.value;
};

// 注册处理
const handleRegister = () => {
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
  
  if (formData.password !== formData.confirmPassword) {
    uni.showToast({
      title: '两次密码输入不一致',
      icon: 'none'
    });
    return;
  }
  
  // 发送注册请求
  uni.showLoading({
    title: '注册中...'
  });
  
  // TODO: 替换为实际的API接口地址
  uni.request({
    url: '/api/v1/register',
    method: 'POST',
    data: {
      name: formData.username,
      password: formData.password,
      role: formData.role
    },
    timeout: 10000, // 设置超时时间为10秒
    success: (res: any) => {
      uni.hideLoading();
      
      if (res.data && res.data.code === 200) {
        uni.showToast({
          title: '注册成功',
          icon: 'success'
        });
        
        // 注册成功后跳转到登录页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index'
          });
        }, 1500);
      } else {
        uni.showToast({
          title: res.data?.msg || '注册失败，请重试',
          icon: 'none'
        });
      }
    },
    fail: (err) => {
      uni.hideLoading();
      console.error('注册请求失败:', err);
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      });
    }
  });
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};

onLoad(() => {
  // 页面加载时的初始化操作
});
</script>

<style lang="scss">
.register-container {
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
  margin-top: 80rpx;
  
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

.role-select {
  margin-bottom: 40rpx;
  
  text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-right: 10rpx;
  }
  
  .radio-item {
    margin-right: 40rpx;
    font-size: 28rpx;
    display: inline-flex;
    align-items: center;
    margin-top: 20rpx;
    
    text {
      margin-left: 6rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.register-btn {
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

.login-link {
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