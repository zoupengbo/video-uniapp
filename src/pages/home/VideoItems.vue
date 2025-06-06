<template>
    <div>
        <div class="view-user">@{{ videoData.user }}</div>
        <video-player :src="videoData.videoSrc"></video-player>
        <div class="title">{{ videoData.title }}</div>
        <div class="video-tip">#{{ videoData.tag }}<span>{{ videoData.views }}次播放</span></div>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import VideoPlayer from '../../components/VideoPlayer.vue';

const props = defineProps({
    videoData: {
        type: Object,
        required: true
    }
});

const message = ref('Hello, Vue 3!');
function changeMessage() {
    message.value = 'Message changed!';
}
</script>

<style>
.view-user {
    font-size: 16px;
    color: #ff9966;
    margin-top: 1.6vw;
    margin-bottom: 1.6vw;
    font-weight: 500;
}

.title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-top: 1.6vw;
}

.video-tip {
    font-size: 13px;
    color: #8a9aa9;
    margin-top: 1.6vw;
    display: flex;
    justify-content: space-between;
}

.video-tip span {
    margin-left: 1.6vw;
}
</style>