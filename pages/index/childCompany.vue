<template>
	<view class="warp">
		<view v-for="(item,index) in list" :key="index" class="list">
			<view class="name">{{item.name}}</view>
			<view class="address">{{item.address}}</view>
			<view class="contacts">{{item.contacts}}</view>
			<view class="phone">{{item.phone}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						name: '浙江兆弟控股有限公司',
						address: '浙江省杭州市下城区杭玻街198号润龙湖邸12幢',
						contacts: '周兆弟、周开发',
						phone: '0571-86095120',
					},
					{
						name: '兆弟集团有限公司',
						address: '浙江省宁波市北仑区新碩东河路奥力孕商城604室',
						contacts: '周兆弟、齐金良',
						phone: '0571-88091015',
					},
					{
						name: '浙江兆筑建材有限公司',
						address: '浙江省宁波市北仑区梅山盐场1号办公楼九号2549室',
						contacts: '周继发',
						phone: '0571-88091015',
					},
					{
						name: '江苏天海建材有限公司',
						address: '江苏省张家港市金港镇南沙天海工业园区',
						contacts: '陈成',
						phone: '0512-58935188',
					},
					{
						name: '浙江和建建材有限公司',
						address: '浙江省湖州市南浔区练市镇工业功能区19号路',
						contacts: '周兆弟',
						phone: '0571-88091015',
					},
					{
						name: '上海兴山混凝土构件有限公司',
						address: '上海市金山区8巷镇金张公路5299号',
						contacts: '沈琦斌',
						phone: '021-64212272',
					},
					{
						name: '温州兆弟桩业科技有限公司',
						address: '浙江省温州市鹿城区仰义街道渔藤路18号',
						contacts: '周开发',
						phone: '0577-89799932',
					},
					{
						name: '兆弟建材(盐城)有限公司',
						address: '江苏省盐城市阜宁县东益经济开发区中小企业园11号',
						contacts: '周继发',
						phone: '0512-58935188',
					},
					{
						name: '浙江兆恒建材有限公司余姚分公司',
						address: '浙江省宁波市余桃市阳明街道新桥村指家88号',
						contacts: '甘奇兵',
						phone: '0574-62342223',
					},
					{
						name: '江苏天海建材(淮安)有限公司',
						address: '江苏省淮安市淮阴区高家堰镇沟北村化工路6号',
						contacts: '周继发',
						phone: '0512-58935188',
					},
					{
						name: '湖北天海建材有限公司',
						address: '湖北省黄石市西塞山工业园区三园路',
						contacts: '周继发',
						phone: '0714-3187293',
					}
				]
			};
		}
	}
</script>

<style lang="scss">
	page {
		background: white;
	}

	.warp {
		padding: 30rpx;
		letter-spacing: 1px;

		.list {
			padding: 30rpx 0rpx;

			.name {
				font-size: 16px;
				font-weight: bold;

			}

			.address {
				margin: 5px 0px 3px 0px;
				color: #a2a2a3;
			}

			.contacts {
				margin: 3px 0px;
			}

			.phone {
				margin: 3px 0px;
			}
		}

	}
</style>
