<template>
  <view class="siyuan">
    <u-parse :content="trainInfo.content"></u-parse>

    <view class="time-btn" v-if="trainInfo.paperId != null && amountSorce < 3">
      <u-button
        type="primary"
        size="medium"
        shape="circle"
        :disabled="disabled"
        @click="goContent()"
      >
        <text v-if="!disabled">完成学习去考试</text>
        <text v-else>学习剩余时间：{{ times }}</text></u-button
      >
    </view>
  </view>
</template>

<script>
import { getTrainInfo, userTrainLog } from "@/common/train.js";
import uParse from "@/components/u-parse/u-parse.vue";
export default {
  components: {
    uParse,
  },
  data() {
    return {
      /**
       * 倒计时初始值
       */
      times: 10,
      /**
       * 定时器执行次数
       */
      interval: 0,
      /**
       * 考试不及格次数
       */
      amountSorce: null,
      /**
       * 是否禁用按钮
       */
      disabled: true,
      trainInfo: {},
      timeId: 0,
      /**
       * @param {string} 试卷id
       */
      paperId: "",
    };
  },
  onLoad(options) {
    if (options.amountSorce === "undefined") {
      this.amountSorce = 0;
    } else {
      this.amountSorce = options.amountSorce;
    }
    //
    this.paperId = options.id;
    this.getInfo();
    // 定时器
    this.interval = setInterval(this.close, 1000);
    this.timeId = setInterval(this.getUserTrainLog, 30000);
  },
  methods: {
    /**
     * 协调定时器函数
     * 倒计时
     */
    close() {
      if (this.times > 1) {
        this.times--;
      } else {
        this.disabled = false;
        clearInterval(this.interval);
      }
    },
    /**
     * 获取详请
     * @param {Object} id
     */
    getInfo() {
      getTrainInfo({
        id: this.paperId,
      }).then((res) => {
        this.trainInfo = res.data;
      });
    },
    /**
     * @description 跳转到题目页面
     */
    goContent() {
      uni.navigateTo({
        url: "./exam?id=" + this.trainInfo.paperId,
      });
    },
    /**
     * @param {string} paperId 试卷id
     * @description 监听用户阅读时间 向后台发送日志信息
     */
    getUserTrainLog() {
      userTrainLog({
        trainId: this.paperId,
      }).then((res) => {
        clearInterval(this.timeId);
      });
    },
  },
};
</script>

<style>
.time-btn {
  position: fixed;
  bottom: 40rpx;
  width: 100%;
  text-align: center;
}
</style>
