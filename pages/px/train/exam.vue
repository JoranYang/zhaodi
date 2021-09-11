<template>
  <view class="siyuan wrap">
    <view
      style="
        font-size: 36upx;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20upx;
        position: relative;
      "
      >{{ paper.title }}
    </view>
    <view v-for="item in paper.structure.structure" :key="item.type">
      <view style="color: #606266; font-weight: 700; line-height: 90upx">
        {{ cov(item.type, item.count, item.score) }}
      </view>
      <view v-for="(ite, key) in tableQuestionList[item.type]" :key="key">
        <view class="title-font"
          >{{ key + 1 }}、{{ ite.title }}({{
            ite.score ? ite.score : 0
          }}分)</view
        >
        <view>
          <!-- 单选题 -->
          <block v-if="Number(item.type) === 0">
            <u-radio-group
              v-model="ite.answer"
              @change="radioGroupChange(ite.id, $event)"
              class="options-flex"
            >
              <u-radio
                v-for="(op, h) in ite.options"
                :key="h"
                :name="op.option"
                :disabled="false"
              >
                {{ op.option }}、{{ op.content }}
              </u-radio>
            </u-radio-group>
          </block>
          <!-- 判断题 -->
          <block v-if="Number(item.type) === 1">
            <u-radio-group
              v-model="ite.answer"
              @change="radioGroupChange(ite.id, $event)"
              class="options-flex"
            >
              <u-radio key="1" name="yes" :disabled="false"> 对 </u-radio>
              <u-radio key="0" name="no" :disabled="false"> 错 </u-radio>
            </u-radio-group>
          </block>
          <!-- 多选题 -->
          <block v-if="Number(item.type) === 2">
            <u-checkbox-group
              @change="checkboxGroupChange(ite.id, $event)"
              v-model="ite.answer"
              :wrap="true"
            >
              <u-checkbox
                v-for="(op, h) in ite.options"
                :key="h"
                v-model="op.checked"
                :name="op.option"
                >{{ op.option }}、{{ op.content }}</u-checkbox
              >
            </u-checkbox-group>
          </block>
          <block v-if="Number(item.type) === 3">
            <view v-for="(tk, t) in getTkCount(ite.title)" :key="t">
              第{{ t + 1 }}空：
              <u-input :ref="ite.id + '_' + t" />
            </view>
          </block>
          <block v-if="ite.type == 4">
            <u-input type="textarea"></u-input>
          </block>
        </view>
      </view>
    </view>

    <u-button size="default" type="primary" form-type="submit" @click="save"
      >提交</u-button
    >
  </view>
</template>

<script>
import { queryPaperInfo, saveUserPaper } from "@/common/train.js";
export default {
  data() {
    return {
      /**
       * @param {Array} 题目类型列表
       */
      trainQuestionType: [],
      userAnswer: {},
      qualifiedLine: 0,
	  paperId:0,
      /**
       * @param {Object} startTime 开始时间
       */
      startTime: null,
      /**
       * @param {Object} endTime 结束时间
       */
      endTime: null,
      /**
       * @param {Object} endTime 20分钟倒计时
       */
      countDownTime: {
        totalCountTime: 1200000,
        countDownMinutes: "",
        countDownSeconds: "",
      },
      timer: "", //考试倒计时定时器
      paper: {
        title: "",
        qualifiedLine: 0,
        structure: {
          structure: [
            {
              type: "0",
              count: "",
              score: "",
            },
          ],
        },
      },
      tableQuestionList: { 0: [] },
    };
  },
  onLoad: function (options) {
    this.getQuestionType();
    this.getInfo(options.id);
	this.paperId = options.id
	console.log("加载出来的数据:",options.id)
    this.startTime = new Date();
  },
  methods: {
    /**
     * @param {IdString} id
     */
    getInfo: function (id) {
      queryPaperInfo({
        id: id,
        isShow: false,
      }).then((res) => {
        let tkCount = 0;
        this.paper = res.info;
        this.paper.questionIds = {};
        this.paper.structure = JSON.parse(this.paper.structure);
        if (this.paper.qualifiedLine < 1) {
          let df = 0;
          for (const t in this.paper.structure.structure) {
            df += Number(this.paper.structure.structure[t].zf);
          }
          this.paper.qualifiedLine = (df * this.paper.qualifiedLine).toFixed(2);
          //console.log("df-->", df);
        }
        this.tableQuestionList = this.paper.questions;
        // console.info("tableQuestionList", this.tableQuestionList);
        for (const i in this.tableQuestionList) {
          for (const j in this.tableQuestionList[i]) {
            if (this.tableQuestionList[i][j].type === 2) {
              this.paper.questionIds[this.tableQuestionList[i][j].id] = [];
            } else {
              this.paper.questionIds[this.tableQuestionList[i][j].id] = "";
            }
            this.tableQuestionList[i][j].options = JSON.parse(
              this.tableQuestionList[i][j].options
            );
            if (this.tableQuestionList[i][j].type === 3) {
              tkCount =
                this.tableQuestionList[i][j].title.split("____").length - 1;
              if (!this.paper.trainUserAnswer) {
                this.paper.trainUserAnswer = {};
              }
              this.paper.trainUserAnswer[this.tableQuestionList[i][j].id] = [];
              for (let k = 0; k < tkCount; k++) {
                this.paper.trainUserAnswer[this.tableQuestionList[i][j].id][k] =
                  "";
              }
            }
          }
        }
        this.setInter();
      });
    },
    setInter() {
      this.timer = setInterval(this.time, 1000);
      this.time();
    },
    /**
     * @description 获取题目类型
     */
    getQuestionType() {
      this.$common.getDataDictory("train_question_type").then((res) => {
        this.trainQuestionType = res.info;
      });
    },
    /**
     * @alias 转换题目类型编码
     * @param {String} no 题目类型编码
     */
    tranfer(no) {
      let ret;
      this.trainQuestionType.map((item, index) => {
        if (Number(item.Code) === no) {
          ret = item.Interpretation;
        }
      });
      return ret;
    },
    getTkCount(title) {
      return title.split("____").length - 1;
    },
    /**
     * @description 添加用户的单选和判断答案
     * @param {Object} id 题目id
     * @param {Object} e 选中的值
     */
    radioGroupChange(id, e) {
      this.userAnswer[id] = e;
    },

    time() {
      if (this.countDownTime.totalCountTime <= 1000) {
        clearInterval(timer);
        //提交试卷
        this.save();
      }
      this.countDownTime.countDownMinutes = this.double(
        Math.floor((this.countDownTime.totalCountTime / 1000 / 60) % 60)
      );
      this.countDownTime.countDownSeconds = this.double(
        Math.floor((this.countDownTime.totalCountTime / 1000) % 60)
      );

      this.countDownTime.totalCountTime -= 1000;
      uni.setNavigationBarTitle({
        title: `考试    ${this.countDownTime.countDownMinutes}: ${this.countDownTime.countDownSeconds}`,
      });
    },
    double(n) {
      if (n < 10) {
        n = "0" + n;
      }
      return n;
    },
    /**
     * @description 提交用户答案
     */
    save() {
      const saveEntity = {}; // 保存对象
      for (const i in this.$refs) {
        // 遍历填空题
        const questionKeys = i.split("_"); //  [问题主键-索引]
        const questionKey = questionKeys[0]; // 问题主键
        if (!this.userAnswer[questionKey]) {
          this.userAnswer[questionKey] = [];
        }
        const answer = this.userAnswer[questionKey]; // 答案数组
        answer.push(this.$refs[i][0].defaultValue);
      }
      this.endTime = new Date();
      const ppTime = new Date(this.endTime - this.startTime).valueOf();
      const parma = {
        ppTime: ppTime,
        trainPaperId: this.paperId,
        userAnswer: JSON.stringify(this.userAnswer),
      };
	
      saveUserPaper(parma).then((res) => {
        uni.showToast({
          title: "提交成功",
          icon: "success",
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 2000);
      });
    },
    /**
     * @param {Object} id 题目id
     * @param {Object} e 选中的值
     * @description 选择填空题答案
     */
    checkboxGroupChange(id, e) {
      this.userAnswer[id] = e;
    },
    /**
     * itemCode 题目类型
     * count 题数
     */
    cov(itemCode, count, score) {
      // console.info("trainQuestionType=>", this.trainQuestionType);
      // console.info("trainQuestionType=>", itemCode.toString());
      for (const i in this.trainQuestionType) {
        if (this.trainQuestionType[i].Code === itemCode.toString()) {
          return (
            this.trainQuestionType[i].Interpretation +
            "（共" +
            count +
            "题，总分" +
            this.calculationQuestionTypeTotalScore(itemCode) +
            "）"
          );
        }
      }
    },
    /**
     * 计算题型总分
     * @param type 题目类型
     */
    calculationQuestionTypeTotalScore(type) {
      let totalScore = 0;
      // console.info(this.tableQuestionList[type]);
      for (const i in this.tableQuestionList[type]) {
        if (this.tableQuestionList[type][i].score) {
          const fScore = this.tableQuestionList[type][i].score
            .toString()
            .split(",");
          for (const i in fScore) {
            totalScore += fScore[i] ? Number(fScore[i]) : 0;
          }
        } else {
          totalScore += 0;
        }
      }
      return totalScore;
    },
  },
  destroyed() {
    //清除定时器
    window.clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: white;
}

.wrap {
  padding: 30rpx;
}

.title-font {
  font-weight: bold;
  font-size: $uni-font-size-base;
  padding-bottom: 10px;
}

.options-flex {
  display: flex;
  flex-direction: column;
}
</style>
