import { ref, onMounted, onUnmounted } from 'vue';
import { skeletonManager } from '../utils/skeletonManager';

/**
 * 骨架屏组合式函数
 * 提供页面级骨架屏控制功能
 */
export function useSkeleton() {
  const isLoading = ref(true);
  const showSkeleton = ref(true);

  /**
   * 显示骨架屏
   * @param duration 显示时长（毫秒），默认为配置的最小显示时间
   */
  const show = (duration?: number) => {
    isLoading.value = true;
    showSkeleton.value = true;
    
    if (duration) {
      setTimeout(() => {
        hide();
      }, duration);
    }
  };

  /**
   * 隐藏骨架屏
   * @param force 是否强制隐藏，忽略最小显示时间
   */
  const hide = (force = false) => {
    if (force) {
      isLoading.value = false;
      showSkeleton.value = false;
    } else {
      // 延迟隐藏，确保内容已加载
      setTimeout(() => {
        isLoading.value = false;
        showSkeleton.value = false;
      }, 300);
    }
  };

  /**
   * 切换骨架屏状态
   */
  const toggle = () => {
    if (isLoading.value) {
      hide();
    } else {
      show();
    }
  };

  /**
   * 模拟数据加载
   * @param loadFn 数据加载函数
   * @param minDuration 最小加载时间（毫秒）
   */
  const withLoading = async <T>(
    loadFn: () => Promise<T>, 
    minDuration = 800
  ): Promise<T> => {
    show();
    
    const startTime = Date.now();
    
    try {
      const result = await loadFn();
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsed);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      hide();
      return result;
    } catch (error) {
      hide(true);
      throw error;
    }
  };

  return {
    isLoading,
    showSkeleton,
    show,
    hide,
    toggle,
    withLoading
  };
}

/**
 * 全局骨架屏组合式函数
 * 控制全局骨架屏的显示和隐藏
 */
export function useGlobalSkeleton() {
  /**
   * 显示全局骨架屏
   * @param pagePath 页面路径
   * @param config 配置选项
   */
  const showGlobal = (pagePath: string, config?: any) => {
    skeletonManager.show(pagePath, config);
  };

  /**
   * 隐藏全局骨架屏
   * @param force 是否强制隐藏
   */
  const hideGlobal = (force = false) => {
    skeletonManager.hide(force);
  };

  /**
   * 更新全局骨架屏配置
   * @param config 配置选项
   */
  const updateGlobalConfig = (config: any) => {
    skeletonManager.updateConfig(config);
  };

  return {
    showGlobal,
    hideGlobal,
    updateGlobalConfig
  };
}

/**
 * 页面骨架屏Hook
 * 在页面生命周期中自动管理骨架屏
 */
export function usePageSkeleton(options?: {
  autoHide?: boolean;
  hideDelay?: number;
  minDuration?: number;
}) {
  const {
    autoHide = true,
    hideDelay = 500,
    minDuration = 800
  } = options || {};

  const { isLoading, showSkeleton, show, hide, withLoading } = useSkeleton();

  onMounted(() => {
    if (autoHide) {
      setTimeout(() => {
        hide();
      }, hideDelay);
    }
  });

  onUnmounted(() => {
    // 清理定时器等资源
    hide(true);
  });

  return {
    isLoading,
    showSkeleton,
    show,
    hide,
    withLoading
  };
}

/**
 * 列表骨架屏Hook
 * 专门用于列表页面的骨架屏管理
 */
export function useListSkeleton(options?: {
  initialCount?: number;
  loadMoreCount?: number;
}) {
  const {
    initialCount = 6,
    loadMoreCount = 3
  } = options || {};

  const isInitialLoading = ref(true);
  const isLoadingMore = ref(false);
  const skeletonCount = ref(initialCount);

  /**
   * 初始加载
   */
  const loadInitial = async <T>(loadFn: () => Promise<T>): Promise<T> => {
    isInitialLoading.value = true;
    skeletonCount.value = initialCount;
    
    try {
      const result = await loadFn();
      isInitialLoading.value = false;
      return result;
    } catch (error) {
      isInitialLoading.value = false;
      throw error;
    }
  };

  /**
   * 加载更多
   */
  const loadMore = async <T>(loadFn: () => Promise<T>): Promise<T> => {
    isLoadingMore.value = true;
    
    try {
      const result = await loadFn();
      isLoadingMore.value = false;
      return result;
    } catch (error) {
      isLoadingMore.value = false;
      throw error;
    }
  };

  /**
   * 刷新
   */
  const refresh = async <T>(loadFn: () => Promise<T>): Promise<T> => {
    return loadInitial(loadFn);
  };

  return {
    isInitialLoading,
    isLoadingMore,
    skeletonCount,
    loadInitial,
    loadMore,
    refresh
  };
}
