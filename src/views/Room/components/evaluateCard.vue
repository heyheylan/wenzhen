<script setup lang="ts">
import type {EvaluateDoc, Message} from '@/types/room'
import {computed, inject, ref, type Ref, onMounted, provide} from 'vue'
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import {evaluateConsultOrderAPI} from "@/apis/consult";
import type {ConsultOrderItem} from '@/types/consult'
import {MsgType} from "@/enums";


const score = ref(0)
const anonymousFlag = ref(false)
const content = ref('')
const disabled = ref(false)


//接收祖先组件的数据
const consult = inject<Ref<ConsultOrderItem>>('consult')
//评价后提交评分数据，更改状态
const completeEva = inject<(score: number) => void>('completeEva')

const onSubmit = async () => {
  if (!score.value) return showFailToast('请选择评分')
  if (!content.value) return showFailToast('请输入评价')
  if (!consult?.value) return showFailToast('未找到订单')
  if (consult.value.docInfo?.id) {
    showConfirmDialog({
      title: '温馨提示',
      message: '确定提交评价吗？',
      closeOnPopstate: false
    }).then(async () => {
      //提交评价
      const res = await evaluateConsultOrderAPI({
        docId: consult.value?.docInfo?.id,
        orderId: consult.value?.id,
        score: score.value,
        content: content.value,
        anonymousFlag: anonymousFlag.value ? 1 : 0
      })
      // console.log(res)
      if (res.code === 10000) {
        showSuccessToast('评价成功')
        //处理评分
        completeEva && completeEva(score.value)
        // 更改样式
        disabled.value = true
      } else {
        showFailToast('评价失败，请稍后再尝试')
      }
    })
  }

}
const props = defineProps<{
  evaluateDoc?: EvaluateDoc,
  // msgtype?: MsgType
}>()
// console.log(props.msgtype)

// const  AllList = inject('AllList')
// console.log(AllList)

//提交分数给回显
// const ReshowEva = async (list:Message[]) => {
//   const item = list.find((item) => item.msgType === MsgType.CardEva)
//   if (item) {
//     console.log('got it')
//     //提交评分，评价状态
//     // if(item.msg.evaluateDoc?.score){
//     //   item.msg.evaluateDoc.score = score.value
//     // }
//   }
// }
// provide('ReshowEva', ReshowEva)

</script>


<template>
  <div class="evalutate-card" v-if="evaluateDoc">
    <!--<div class="evalutate-card">-->
    <p class="title">{{ disabled === true ? '感谢你的评价！' : '请提交评价' }}</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
        :readonly="disabled"
        v-model="score"
        size="7vw"
        gutter="3vw"
        color="#FADB14"
        void-icon="star"
        void-color="rgba(0,0,0,0.04)"

    />
    <van-field
        :disabled="disabled"
        v-model="content"
        type="textarea"
        maxlength="150"
        show-word-limit
        rows="3"
        placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button type="primary" size="small" round @click="onSubmit" :disabled="disabled">
        {{ disabled === true ? '已提交' : '提交评价' }}
      </van-button>
    </div>
  </div>

</template>


<style scoped>
.evalutate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;

  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }

  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }

  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    ::v-deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }

        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }

        height: 16px;
      }

      .van-button {
        padding: 0 16px;

        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}

</style>