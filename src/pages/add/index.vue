<template>
  <view class="upload-container">
    <!-- 标题区域 -->
    <view class="page-header">
      <text class="page-title">上传视频</text>
    </view>
    
    <!-- 上传区域 -->
    <view class="upload-section">
      <view class="upload-area" @tap="chooseVideo" v-if="!videoInfo.tempFilePath">
        <text class="iconfont icon-upload"></text>
        <text class="upload-text">点击选择视频</text>
        <text class="upload-tip">支持mp4、mov等格式</text>
      </view>
      
      <!-- 预览区域 -->
      <view class="preview-area" v-else>
        <video 
          :src="videoInfo.tempFilePath" 
          class="preview-video"
          :poster="videoInfo.thumbTempFilePath"
          controls
        ></video>
        <view class="preview-actions">
          <view class="action-btn" @tap="chooseVideo">重新选择</view>
          <view class="action-btn delete" @tap="clearVideo">删除</view>
        </view>
      </view>
    </view>
    
    <!-- 视频信息表单 -->
    <view class="form-section" v-if="videoInfo.tempFilePath">
      <view class="form-item">
        <text class="form-label">视频标题</text>
        <input 
          type="text" 
          class="form-input" 
          placeholder="请输入视频标题" 
          placeholder-class="placeholder"
          v-model="videoInfo.title"
          maxlength="50"
        />
        <text class="input-count">{{ videoInfo.title.length }}/50</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">视频描述</text>
        <textarea 
          class="form-textarea" 
          placeholder="请输入视频描述" 
          placeholder-class="placeholder"
          v-model="videoInfo.description"
          maxlength="200"
        ></textarea>
        <text class="input-count">{{ videoInfo.description.length }}/200</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">视频分类</text>
        <picker 
          mode="selector" 
          :range="categories" 
          range-key="name"
          @change="onCategoryChange"
        >
          <view class="picker-value">
            {{ videoInfo.category ? videoInfo.category.name : '请选择分类' }}
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="form-label">封面设置</text>
        <view class="cover-options">
          <view 
            class="cover-option" 
            :class="{ active: coverIndex === index }"
            v-for="(cover, index) in coverOptions" 
            :key="index"
            @tap="selectCover(index)"
          >
            <image :src="cover" mode="aspectFill"></image>
            <view class="cover-selected" v-if="coverIndex === index">
              <text class="iconfont icon-check"></text>
            </view>
          </view>
          <view class="cover-option custom" @tap="chooseCustomCover">
            <text class="iconfont icon-image"></text>
            <text>自定义</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">谁可以看</text>
        <radio-group @change="onPrivacyChange">
          <label class="radio-item">
            <radio value="public" :checked="videoInfo.privacy === 'public'" color="#ff9966" />
            <text>公开</text>
          </label>
          <label class="radio-item">
            <radio value="friends" :checked="videoInfo.privacy === 'friends'" color="#ff9966" />
            <text>仅好友</text>
          </label>
          <label class="radio-item">
            <radio value="private" :checked="videoInfo.privacy === 'private'" color="#ff9966" />
            <text>仅自己</text>
          </label>
        </radio-group>
      </view>
    </view>
    
    <!-- 上传按钮 -->
    <view class="submit-section" v-if="videoInfo.tempFilePath">
      <button 
        class="submit-btn" 
        :disabled="!isFormValid" 
        :class="{ disabled: !isFormValid }"
        @tap="uploadVideo"
      >
        {{ uploading ? '上传中...' : '发布' }}
      </button>
      <view class="agreement">
        <checkbox :checked="agreeTerms" @tap="toggleAgree" color="#ff9966" />
        <text>我已阅读并同意<text class="link" @tap="showTerms">《用户协议》</text></text>
      </view>
    </view>
    
    <!-- 上传进度 -->
    <view class="upload-progress" v-if="uploading">
      <view class="progress-bar">
        <view class="progress-inner" :style="{ width: uploadProgress + '%' }"></view>
      </view>
      <text class="progress-text">{{ uploadProgress }}%</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

// 视频信息
const videoInfo = reactive({
  tempFilePath: '', // 临时文件路径
  thumbTempFilePath: '', // 缩略图临时路径
  title: '',
  description: '',
  category: null,
  privacy: 'public',
});

// 分类列表
const categories = [
  { id: 'movie', name: '电影' },
  { id: 'series', name: '剧集' },
  { id: 'anime', name: '动漫' },
  { id: 'variety', name: '综艺' },
  { id: 'documentary', name: '纪录片' },
  { id: 'music', name: '音乐' },
  { id: 'game', name: '游戏' },
  { id: 'sports', name: '体育' },
  { id: 'education', name: '教育' },
  { id: 'tech', name: '科技' },
  { id: 'life', name: '生活' },
  { id: 'food', name: '美食' },
  { id: 'travel', name: '旅行' },
  { id: 'pet', name: '宠物' },
  { id: 'other', name: '其他' },
];

// 封面选项
const coverOptions = ref<string[]>([]);
const coverIndex = ref(0);

// 是否同意条款
const agreeTerms = ref(false);

// 上传状态
const uploading = ref(false);
const uploadProgress = ref(0);

// 选择视频
const chooseVideo = async () => {
  try {
    const result = await uni.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 600, // 最长10分钟
      camera: 'back'
    });
    
    videoInfo.tempFilePath = result.tempFilePath;
    videoInfo.thumbTempFilePath = result.thumbTempFilePath;
    
    // 生成封面选项
    generateCoverOptions();
    
  } catch (error) {
    console.error('选择视频失败', error);
  }
};

// 生成封面选项
const generateCoverOptions = () => {
  // 实际项目中应该从视频中提取多个时间点的帧作为封面选项
  // 这里模拟生成4个封面选项
  coverOptions.value = Array(4).fill(videoInfo.thumbTempFilePath);
};

// 选择封面
const selectCover = (index: number) => {
  coverIndex.value = index;
};

// 选择自定义封面
const chooseCustomCover = async () => {
  try {
    const result = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    });
    
    // 添加自定义封面到选项中
    coverOptions.value.push(result.tempFilePaths[0]);
    coverIndex.value = coverOptions.value.length - 1;
    
  } catch (error) {
    console.error('选择封面失败', error);
  }
};

// 清除视频
const clearVideo = () => {
  videoInfo.tempFilePath = '';
  videoInfo.thumbTempFilePath = '';
  videoInfo.title = '';
  videoInfo.description = '';
  videoInfo.category = null;
  coverOptions.value = [];
  coverIndex.value = 0;
};

// 分类变更
const onCategoryChange = (e: any) => {
  const index = e.detail.value;
  videoInfo.category = categories[index];
};

// 隐私设置变更
const onPrivacyChange = (e: any) => {
  videoInfo.privacy = e.detail.value;
};

// 切换同意条款
const toggleAgree = () => {
  agreeTerms.value = !agreeTerms.value;
};

// 显示用户协议
const showTerms = () => {
  uni.showModal({
    title: '用户协议',
    content: '这是一个示例用户协议内容。实际项目中，这里应该显示完整的用户协议。',
    showCancel: false
  });
};

// 表单验证
const isFormValid = computed(() => {
  return (
    videoInfo.tempFilePath && 
    videoInfo.title.trim() && 
    videoInfo.category && 
    agreeTerms.value
  );
});

// 上传视频
const uploadVideo = async () => {
  if (!isFormValid.value) return;
  
  uploading.value = true;
  uploadProgress.value = 0;
  
  // 模拟上传进度
  const timer = setInterval(() => {
    uploadProgress.value += 5;
    if (uploadProgress.value >= 100) {
      clearInterval(timer);
      uploadComplete();
    }
  }, 200);
  
  // 实际项目中，这里应该调用上传API
  // const uploadTask = uni.uploadFile({
  //   url: 'https://your-api.com/upload',
  //   filePath: videoInfo.tempFilePath,
  //   name: 'video',
  //   formData: {
  //     title: videoInfo.title,
  //     description: videoInfo.description,
  //     categoryId: videoInfo.category.id,
  //     privacy: videoInfo.privacy,
  //     coverIndex: coverIndex.value
  //   },
  //   success: (res) => {
  //     // 处理上传成功
  //   },
  //   fail: (err) => {
  //     // 处理上传失败
  //   }
  // });
  
  // uploadTask.onProgressUpdate((res) => {
  //   uploadProgress.value = res.progress;
  // });
};

// 上传完成
const uploadComplete = () => {
  uploading.value = false;
  
  uni.showToast({
    title: '上传成功',
    icon: 'success'
  });
  
  // 清除表单
  setTimeout(() => {
    clearVideo();
  }, 1500);
};
</script>

<style lang="scss">
.upload-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
  padding-bottom: 30rpx;
}

.page-header {
  padding: 30rpx;
  
  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
  }
}

.upload-section {
  padding: 0 30rpx;
  
  .upload-area {
    height: 400rpx;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2rpx dashed rgba(255, 255, 255, 0.2);
    
    .iconfont {
      font-size: 80rpx;
      color: #ff9966;
      margin-bottom: 20rpx;
    }
    
    .upload-text {
      font-size: 32rpx;
      color: #fff;
      margin-bottom: 10rpx;
    }
    
    .upload-tip {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .preview-area {
    position: relative;
    
    .preview-video {
      width: 100%;
      height: 400rpx;
      border-radius: 16rpx;
    }
    
    .preview-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20rpx;
      
      .action-btn {
        padding: 10rpx 30rpx;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #fff;
        margin-left: 20rpx;
        
        &.delete {
          background-color: rgba(255, 0, 0, 0.2);
        }
      }
    }
  }
}

.form-section {
  padding: 30rpx;
  
  .form-item {
    margin-bottom: 30rpx;
    position: relative;
    
    .form-label {
      display: block;
      font-size: 28rpx;
      color: #fff;
      margin-bottom: 16rpx;
    }
    
    .form-input, .form-textarea {
      width: 100%;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 12rpx;
      padding: 20rpx;
      color: #fff;
      font-size: 28rpx;
      box-sizing: border-box;
      border: 1rpx solid rgba(255, 255, 255, 0.1);
    }
    
    .form-textarea {
      height: 200rpx;
    }
    
    .input-count {
      position: absolute;
      right: 20rpx;
      bottom: 20rpx;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    .picker-value {
      width: 100%;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 12rpx;
      padding: 20rpx;
      color: #fff;
      font-size: 28rpx;
      box-sizing: border-box;
      border: 1rpx solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .iconfont {
        color: rgba(255, 255, 255, 0.5);
        font-size: 24rpx;
      }
    }
    
    .cover-options {
      display: flex;
      flex-wrap: wrap;
      
      .cover-option {
        position: relative;
        width: 160rpx;
        height: 90rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        border-radius: 8rpx;
        overflow: hidden;
        border: 2rpx solid transparent;
        
        &.active {
          border-color: #ff9966;
        }
        
        image {
          width: 100%;
          height: 100%;
        }
        
        .cover-selected {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          
          .iconfont {
            color: #ff9966;
            font-size: 40rpx;
          }
        }
        
        &.custom {
          background-color: rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          
          .iconfont {
            font-size: 40rpx;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 6rpx;
          }
          
          text {
            font-size: 20rpx;
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
    }
    
    .radio-item {
      margin-right: 40rpx;
      font-size: 28rpx;
      color: #fff;
    }
  }
}

.submit-section {
  padding: 30rpx;
  
  .submit-btn {
    width: 100%;
    height: 90rpx;
    background: linear-gradient(45deg, #ff9966, #ff5e62);
    color: #fff;
    font-size: 32rpx;
    border-radius: 45rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &.disabled {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
    
    .link {
      color: #ff9966;
    }
  }
}

.upload-progress {
  padding: 0 30rpx;
  margin-top: 20rpx;
  
  .progress-bar {
    width: 100%;
    height: 10rpx;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5rpx;
    overflow: hidden;
    
    .progress-inner {
      height: 100%;
      background-color: #ff9966;
      transition: width 0.2s;
    }
  }
  
  .progress-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 10rpx;
    text-align: center;
  }
}
</style>
