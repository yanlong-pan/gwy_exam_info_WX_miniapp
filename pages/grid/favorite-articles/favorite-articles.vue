<template>
	<view class="container">
		<!-- <unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}"
			where='"user_id"==$cloudEnv_uid' :collection="'opendb-news-favorite'" @load="isLoading == false"
			@error="isLoading == false" field="article_id,user_id" :page-size="10"> -->
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="colList"
			@load="isLoading == false" @error="isLoading == false" :page-size="10">
			<uni-list>
				<uni-list-item v-for="(item, index) in data" :key="index" :clickable="true"
					@click="handleItemClick(item.article_id[0])">
					<template v-slot:body>
						<view class="item">
							<text>{{item.article_id[0].title}}</text>
							<uni-dateformat v-if="isDateString(item.article_id[0].apply_deadline)"
								class="last_modify_date" :date="item.article_id[0].apply_deadline"
								format="yyyy-MM-dd hh:mm" :threshold="[60000, 2592000000]" />
							<view v-else class="last_modify_date">
								{{item.article_id[0].apply_deadline}}
							</view>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<uni-load-state @networkResume="refreshData"
				:state="{data,pagination,hasMore, loading, error}"></uni-load-state>
		</unicloud-db>
	</view>
</template>

<script>
	import {
		isDateString
	} from '@/common/utils.js';
	const db = uniCloud.database()
	export default {
		data() {
			return {
				isLoading: true,
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: '',
				},
				colList: [
					db.collection('opendb-news-favorite').where('"user_id" == $cloudEnv_uid').orderBy('create_date',
						'desc').getTemp(),
					db.collection('custom-articles').field('_id,title,apply_deadline').getTemp()
				]
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('grid.favoriteArticles')
			})
		},
		onPullDownRefresh() {
			this.refreshData();
		},
		onReachBottom() {
			this.$refs.udb.loadMore()
		},
		methods: {
			isDateString,
			refreshData() {
				this.$refs.udb.loadData({
					clear: true
				}, (res) => {
					uni.stopPullDownRefresh()
				})
			},
			handleItemClick(item) {
				console.log('handleItemClick: ', item)
				uni.navigateTo({
					url: '/pages/list/detail?id=' + item._id + '&title=' + item.title
				})
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		flex-direction: column;
	}

	.article-date {
		color: #C8C7CC;
	}

	.last_modify_date {
		font-size: 14px;
		color: #999999;
	}
</style>