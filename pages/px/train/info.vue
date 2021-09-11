<template>
  <view>
    <view
      v-for="item in trainInfo"
      :key="item.id"
      style="background-color: white"
      class="wrap"
    >
      <view>
        <view class="list-title">{{ item.title }}</view>
        <view class="list-score">
          <view
            :class="item.maxScore ? 'info-maxScore' : 'info-maxScoreNull'"
            v-if="item.paperId"
            >{{ item.maxScore >= 0 ? item.maxScore : "暂无成绩"
            }}<text class="fen" v-show="item.maxScore">分</text></view
          >

          <view
            @click="toVideoDetail(item)"
            :class="item.maxScore ? 'info-maxScore' : 'info-maxScoreNull'"
            v-else
            >{{ item.lookTime ? item.lookTime : "请学习" }}</view
          >

          <view class="score-yg">
            <!-- 已经学习过 -->
            <block v-if="item.isLook">
              <u-tag
                class="finishFlag"
                text="已完成"
                type="error"
                border-color="#fef0f0"
                mode="light"
                :closeable="false"
                size="default"
              />
            </block>
            <!-- 还未学习 -->
            <block v-else>
              <u-tag
                class="finishFlag"
                text="未学习"
                bg-color="#ffbdbd"
                border-color="#ffbdbd"
                color="#f56c6c"
                size="default"
              /> </block
          ></view>
        </view>
      </view>
    </view>
    <u-loadmore :status="status" bgColor="#f2f2f2" />
    <u-tabbar :list="menu" :mid-button="false" active-color="#1779FF" />
  </view>
</template>

<script>
import { getTrainInfo } from "@/common/train.js";
export default {
  name: "Info",
  data() {
    return {
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        type: null,
      },
      trainInfo: [],
      /**
       * 培训类型列表
       */
      trainTypeList: [],
      menu: uni.getStorageSync("menu"),
      total: 0,
      id: null, //当前页的id
      status: "loadmore", //加载更多
    };
  },

  //获取params传递过来的id
  onLoad(option) {
    this.id = option.id;
    //执行查询 获取id
    this.listQuery.type = this.id;
    this.getTrainSingle();
  },

  mounted() {
    this.getTrainType();
  },

  methods: {
    /**
     * 获取培训列表信息
     */
    getTrainSingle() {
      this.status = "loading";
      getTrainInfo(this.listQuery).then((res) => {
        this.total = res.data.total;
        const info = res.data.pageInfo;
        this.trainInfo =
          this.trainInfo.length > 0 ? this.trainInfo.concat(info) : info;
        this.status =
          this.listQuery.pageNum >=
          Math.ceil(this.total / this.listQuery.pageSize)
            ? "nomore"
            : "loadmore";
      });
    },

    /**
     * @description 页面上拉触底事件的处理函数 获取更多的单个课程数据
     */
    onReachBottom() {
      const totalPage = Math.ceil(this.total / this.listQuery.pageSize);

      //1.已经没有数据的情况下
      if (this.listQuery.pageNum >= totalPage) return;
      //2.还有未加载数据的情况下
      this.listQuery.pageNum++;
      this.getTrainSingle();
    },
    /**
     * @description 未学习的情况下，点击学习，跳转到视频页
     */
    toVideoDetail(item) {
      uni.navigateTo({
        url: `/pages/px/train/detail?id=${item.id}&amountScore=${item.amountScore}`,
      });
    },

    /**
     * 获取数据字典
     */
    getTrainType() {
      this.$common.getDataDictory("train_course_type").then((res) => {
        this.trainTypeList = res.info;
      });
    },
    /**
     * 转化成 名称
     * @param {Object} type
     */
    parseTypeName(type) {
      let rts;
      this.trainTypeList.map((res, index) => {
        if (type === Number(res.Code)) {
          rts = res.Interpretation;
        }
      });
      return rts;
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  padding: 40upx;
  margin-bottom: 20upx;
  letter-spacing: 0.5px;
}

.list-title {
  font-size: 32rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-score {
  padding: 10px 0px;
  display: flex;
  align-items: center;
  font-weight: bold;

  .info-maxScore {
    font-size: 26px;
    color: #2c9678;

    .fen {
      font-size: 14px;
      margin-left: 3px;
    }
  }

  .info-maxScoreNull {
    font-size: 20px;
    color: #2c9678;

    .fen {
      font-size: 14px;
      margin-left: 3px;
    }
  }

  .score-yg {
    font-weight: bold;
    margin-left: auto;
  }

  .shuxian {
    padding: 0px 5px;
    color: #a2a2a3;
  }
}

.finishFlag {
  float: right;
}
</style>
