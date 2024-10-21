<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import type {Socket} from 'socket.io-client'
import {io} from 'socket.io-client'
import {nextTick, onMounted, onUnmounted, ref,provide,inject} from 'vue'
import {baseURL} from '@/utils/request'
import {useUserStore} from '@/stores'
import {useRoute} from 'vue-router'
import {MsgType, OrderType} from '@/enums'
import type {Message, TimeMessages} from '@/types/room'
import {getConsultOrderDetailAPI} from "@/apis/consult";
import type {ConsultOrderItem, Image} from "@/types/consult";
import dayjs from "dayjs";
import {showFailToast} from "vant";


//如果是初始化获取的聊天，需要滚动到最底部
const initialMsg = ref(true)

const list = ref<Message[]>([])
//记录每段消息的开始时间，作为下一次请求的开始时间
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))


const store = useUserStore()
const route = useRoute()

//传输医生和订单ID
const consult = ref<ConsultOrderItem>()
provide('consult', consult)


//传输评分处理函数
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    //提交评分，评价状态
    // item.msg.evaluateDoc = { score }
    // item.msgType = MsgType.CardEvaForm
    // console.log(item.msg.evaluateDoc.score)
    console.log(item)
  }
}
provide('completeEva', completeEva)

const consultOrderItem = ref<ConsultOrderItem>()
//获取订单详情
const getConsultOrderDetail = async()=>{
 const res =  await  getConsultOrderDetailAPI(route.query.orderId as string)
  consultOrderItem.value = res.data
}

let socket: Socket

onMounted(async () => {
  const res = await getConsultOrderDetailAPI(route.query.orderId as string)
  consult.value = res.data
})
onMounted(() => [
  // 建立链接，创建 socket.io 实例 ,打开聊天窗口时，传token，传参数
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  }),

  socket.on('connect', () => {
    // 建立连接成功
    console.log('connect')
    //如果断开连接后再次连接，需要清空聊天记录
    list.value = []
  }),
  // 订单状态
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetailAPI(route.query.orderId as string)
    consult.value = res.data
  }),
  socket.on('error', (event) => {
    // 错误异常消息
    console.log('error')
  }),
  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  }),
  // 聊天记录
  socket.on('chatMsgList', ({data}: { data: TimeMessages[] }) => {
    // console.log(data, 22222)
    // 准备转换常规消息列表
    const arr: Message[] = []
    // console.log('data',data)
    data.forEach((item, i) => {
      //确定请求时间
      if (i === 0) time.value = item.createTime
      // console.log(item)
      //聊天室需要的信息
      arr.push({
        msgType: MsgType.Notify,
        msg: {content: item.createTime},
        createTime: item.createTime,
        id: item.createTime //时间是唯一的作为id
      })
      //实际的聊天内容
      arr.push(...item.items)
    })
    // console.log(arr)
    // 追加到聊天消息列表
    list.value.unshift(...arr)
    console.log(list.value)

    loading.value = false
    if (!data.length) {
      return showFailToast('没有聊天记录了')
    }
    nextTick(() => {
      //如果是初始化获取的聊天，需要滚动到最底部
      if (initialMsg.value) {
        //默认加载的消息，需要用最后一条消息设置已读，之前所有消息即是已读
        socket.emit('updateMsgStatus', arr[arr.length - 1].id)
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
  }),
  // 订单状态的变化
  socket.on('/statusChange', () => {
    getConsultOrderDetail()
  }),
  //接收消息
  socket.on('receiveChatMsg', async (event) => {
    list.value.push(event)
    await nextTick()
    //接收到消息的时候，需要把消息设置为已读
    socket.emit('updateMsgStatus', event.id)
    console.log('接收消息:' , event)
    window.scrollTo(0, document.body.scrollHeight)
  })
])
onUnmounted(() => {
  //关闭连接
  socket.close()
})

//发送消息
const sendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: text
    }
  })
  console.log(text)
}
//发送图片
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: {picture: img}
  })
}
console.log(consult)
//下拉刷新
const loading = ref(false)
const onRefresh = () => {
  // 触发下拉
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar :LeftTo="'/user/consult'" :arrow="true" title="问诊室"/>
    <room-status :status="consult?.status" :countdown="consult?.countdown"/>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message v-for="item in list" :key="item.id" :item="item"></room-message>
    </van-pull-refresh>
    <room-action @send-text="sendText" :disabled="consult?.status !== OrderType.ConsultChat"
                 @send-image="sendImage"></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);

  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>