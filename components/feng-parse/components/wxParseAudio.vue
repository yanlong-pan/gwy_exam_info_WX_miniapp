<template>
	<div>
		<button @click="playAudio">播放</button>
		<button @click="pauseAudio">暂停</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 定义音频上下文
				audioContext: null
			};
		},
		props: {
			node: {
				type: Object,
				default: () => ({})
			}
		},
		mounted() {
			this.createAudioContext();
		},
		methods: {
			createAudioContext() {
				// 创建 InnerAudioContext 实例
				this.audioContext = uni.createInnerAudioContext();

				// 设置音频属性
				this.audioContext.src = this.node.attr.src;
				this.audioContext.loop = this.node.attr.loop;
				// 其他需要的属性...

				// 开始播放（根据需要调用）
				this.audioContext.play();
			},
			playAudio() {
				this.audioContext.play();
			},
			pauseAudio() {
				this.audioContext.pause();
			}
		},
		// 当组件销毁时停止播放并释放资源
		beforeDestroy() {
			this.audioContext.stop();
			this.audioContext.destroy();
		}
	};
</script>