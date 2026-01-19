import { ref, reactive } from 'vue';

// 全局骨架屏状态
export const globalSkeletonState = reactive({
  isVisible: false,
  currentPage: '',
  config: {
    animationType: 'shimmer' as 'shimmer' | 'pulse' | 'wave',
    animationSpeed: '1.5s',
    backgroundColor: 'transparent',
    skeletonColor: 'rgba(255, 255, 255, 0.1)',
    showDuration: 800, // 最小显示时间（毫秒）
  }
});

// 页面骨架屏配置
export const pageSkeletonConfigs = {
  // 首页骨架屏配置
  'pages/index/index': {
    elements: [
      // 搜索栏骨架
      {
        height: '80rpx',
        width: '100%',
        marginBottom: '20rpx',
        radius: '40rpx'
      },
      // 分类标签骨架
      {
        height: '60rpx',
        width: '100%',
        marginBottom: '30rpx',
        radius: '30rpx'
      },
      // 视频卡片骨架
      ...Array(4).fill(0).map((_, index) => [
        {
          height: '0',
          paddingTop: '56.25%', // 16:9比例
          radius: '12rpx',
          marginBottom: '20rpx',
          delay: `${index * 0.1}s`
        },
        {
          height: '30rpx',
          width: '90%',
          marginBottom: '10rpx',
          delay: `${index * 0.1 + 0.05}s`
        },
        {
          height: '24rpx',
          width: '60%',
          marginBottom: '30rpx',
          delay: `${index * 0.1 + 0.1}s`
        }
      ]).flat()
    ]
  },
  
  // 视频列表页骨架屏配置
  'pages/video/list': {
    elements: [
      // 分类选择器骨架
      {
        height: '80rpx',
        width: '100%',
        marginBottom: '20rpx',
        radius: '40rpx'
      },
      // 视频网格骨架
      ...Array(6).fill(0).map((_, index) => [
        {
          height: '0',
          paddingTop: '56.25%',
          radius: '12rpx',
          marginBottom: '15rpx',
          delay: `${index * 0.1}s`
        },
        {
          height: '26rpx',
          width: '90%',
          marginBottom: '8rpx',
          delay: `${index * 0.1 + 0.05}s`
        },
        {
          height: '22rpx',
          width: '40%',
          marginBottom: '20rpx',
          delay: `${index * 0.1 + 0.1}s`
        }
      ]).flat()
    ]
  },
  
  // 文章列表页骨架屏配置
  'pages/article/list': {
    elements: [
      // 分类选择器骨架
      {
        height: '80rpx',
        width: '100%',
        marginBottom: '20rpx',
        radius: '40rpx'
      },
      // 文章卡片骨架
      ...Array(5).fill(0).map((_, index) => [
        {
          width: '200rpx',
          height: '150rpx',
          radius: '12rpx',
          marginRight: '20rpx',
          marginBottom: '20rpx',
          delay: `${index * 0.1}s`
        },
        {
          height: '30rpx',
          width: '100%',
          marginBottom: '10rpx',
          delay: `${index * 0.1 + 0.05}s`
        },
        {
          height: '26rpx',
          width: '90%',
          marginBottom: '15rpx',
          delay: `${index * 0.1 + 0.1}s`
        }
      ]).flat()
    ]
  },
  
  // 个人中心页骨架屏配置
  'pages/about/index': {
    elements: [
      // 用户头像骨架
      {
        width: '120rpx',
        height: '120rpx',
        radius: '50%',
        marginBottom: '20rpx'
      },
      // 用户名骨架
      {
        height: '36rpx',
        width: '200rpx',
        marginBottom: '10rpx'
      },
      // 用户ID骨架
      {
        height: '28rpx',
        width: '150rpx',
        marginBottom: '40rpx'
      },
      // 功能选项骨架
      ...Array(6).fill(0).map((_, index) => ({
        height: '100rpx',
        width: '100%',
        marginBottom: '2rpx',
        radius: '0',
        delay: `${index * 0.1}s`
      }))
    ]
  }
};

// 骨架屏管理器类
class SkeletonManager {
  private showTimer: number | null = null;
  private hideTimer: number | null = null;

  // 显示全局骨架屏
  show(pagePath: string, config?: Partial<typeof globalSkeletonState.config>) {
    // 清除之前的定时器
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    // 更新配置
    if (config) {
      Object.assign(globalSkeletonState.config, config);
    }

    globalSkeletonState.currentPage = pagePath;
    globalSkeletonState.isVisible = true;

    // 设置最小显示时间
    this.showTimer = setTimeout(() => {
      this.showTimer = null;
    }, globalSkeletonState.config.showDuration);
  }

  // 隐藏全局骨架屏
  hide(force = false) {
    if (force || !this.showTimer) {
      globalSkeletonState.isVisible = false;
      globalSkeletonState.currentPage = '';
      
      if (this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }
    } else {
      // 等待最小显示时间结束后隐藏
      this.hideTimer = setTimeout(() => {
        globalSkeletonState.isVisible = false;
        globalSkeletonState.currentPage = '';
        this.hideTimer = null;
      }, globalSkeletonState.config.showDuration);
    }
  }

  // 获取页面骨架屏配置
  getPageConfig(pagePath: string) {
    return pageSkeletonConfigs[pagePath as keyof typeof pageSkeletonConfigs] || {
      elements: [
        {
          height: '40rpx',
          width: '100%',
          marginBottom: '20rpx'
        },
        {
          height: '30rpx',
          width: '80%',
          marginBottom: '20rpx'
        },
        {
          height: '30rpx',
          width: '60%',
          marginBottom: '20rpx'
        }
      ]
    };
  }

  // 更新全局配置
  updateConfig(config: Partial<typeof globalSkeletonState.config>) {
    Object.assign(globalSkeletonState.config, config);
  }
}

// 导出单例实例
export const skeletonManager = new SkeletonManager();

// 页面路由拦截器
export const setupSkeletonInterceptor = () => {
  // 拦截页面跳转
  const originalNavigateTo = uni.navigateTo;
  const originalSwitchTab = uni.switchTab;
  const originalReLaunch = uni.reLaunch;
  const originalRedirectTo = uni.redirectTo;

  // 重写 navigateTo
  uni.navigateTo = function(options: any) {
    const url = options.url;
    const pagePath = url.split('?')[0].replace(/^\//, '');
    
    // 显示骨架屏
    skeletonManager.show(pagePath);
    
    return originalNavigateTo.call(this, options);
  };

  // 重写 switchTab
  uni.switchTab = function(options: any) {
    const url = options.url;
    const pagePath = url.split('?')[0].replace(/^\//, '');
    
    // 显示骨架屏
    skeletonManager.show(pagePath);
    
    return originalSwitchTab.call(this, options);
  };

  // 重写 reLaunch
  uni.reLaunch = function(options: any) {
    const url = options.url;
    const pagePath = url.split('?')[0].replace(/^\//, '');
    
    // 显示骨架屏
    skeletonManager.show(pagePath);
    
    return originalReLaunch.call(this, options);
  };

  // 重写 redirectTo
  uni.redirectTo = function(options: any) {
    const url = options.url;
    const pagePath = url.split('?')[0].replace(/^\//, '');
    
    // 显示骨架屏
    skeletonManager.show(pagePath);
    
    return originalRedirectTo.call(this, options);
  };
};
