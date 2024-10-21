import type {
    KnowledgePage,
    KnowledgeParams,
    DoctorPage,
    PageParams,
    FollowType,
    TopDep,
    Image,
    ConsultOrderPreData,
    ConsultOrderPreParams,
    PartialConsult,
    ConsultOrderListParams,
    ConsultOrderPage, ConsultOrderItem
} from '@/types/consult'
import { request } from '@/utils/request'
import { IllnessTime } from '@/enums'


//获取知识卡片数据
export const getKnowledgePage = (params: KnowledgeParams) =>
    request<KnowledgePage>('/patient/home/knowledge', 'GET', params)

//获取医生页面
export const getDoctorPageAPI = (params: PageParams) =>{
   return request<DoctorPage>('/home/page/doc', 'GET', params)
}

//关注
export const followAPI = ( type: FollowType,id: string) =>
    request('/like', 'POST', {
        id,
        type
    })

//获取科室列表
export const getAllDepAPI = () => request<TopDep[]>('/dep/all')

//上传图片
export const uploadImgAPI = (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return request<Image>('upload','POST',fd)
}

// 拉取预支付订单信息
export const getConsultOrderPreAPI = (params: ConsultOrderPreParams) =>{
    return  request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)

}

//生成订单消息
export const createConsultOrderAPI = (data: PartialConsult)=>{
    //只要id
    return request<{id:string}>('/patient/consult/order', 'POST', data)
}

// 获取支付地址  0 是微信  1 支付宝
export const getConsultOrderPayUrl = (params: {
    paymentMethod: 0 | 1
    orderId: string
    payCallback: string
}) => request<{ payUrl: string }>('/patient/consult/pay', 'POST', params)

// 获取问诊记录列表
export const getConsultOrderListAPI = (params: ConsultOrderListParams) =>
    request<ConsultOrderPage>('/patient/consult/order/list', 'GET', params)

//取消订单
export const cancelOrderAPI = (id:string) =>{
    return request(`/patient/order/cancel/${id}`, 'PUT', )
}
//删除订单
export const deleteOrderAPI = (id: string) => request(`/patient/order/${id}`, 'DELETE')

//查看处方
export const getPrescriptionPicAPI = (id: string) => request<{ url: string }>(`/patient/consult/prescription/${id}`)

//获取订单详情
export const getConsultOrderDetailAPI = (orderId: string) => request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })


//抽取常量数据
export const timeOptions = [
    { label: '一周内', value: IllnessTime.Week },
    { label: '一月内', value: IllnessTime.Month },
    { label: '半年内', value: IllnessTime.HalfYear },
    { label: '大于半年', value: IllnessTime.More }
]
export const flagOptions = [
    { label: '就诊过', value: 0 },
    { label: '没就诊过', value: 1 }
]


//提交评价
// 评价问诊
export const evaluateConsultOrderAPI = (data: {
    score: number;
    anonymousFlag: number;
    orderId: string | undefined;
    docId: string | undefined;
    content: string
}) => request<{ id: string }>('/patient/order/evaluate', 'POST', data)
