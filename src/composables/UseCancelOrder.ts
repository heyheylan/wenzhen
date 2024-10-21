import type {ConsultOrderItem} from "@/types/consult";
import {cancelOrderAPI} from "@/apis/consult";
import {showFailToast, showSuccessToast} from "vant";
import {ref} from 'vue'
import {OrderType} from "@/enums";
import {showConfirmDialog} from "vant";

export const useCancelOrder = ()=>{
    const loading = ref(false)
    const cancelOrder = async (item:ConsultOrderItem)=>{
        showConfirmDialog({
            title: '温馨提示',
            message: '确定取消订单吗？',
            closeOnPopstate: false
        }).then(async ()=>{
            try{
                loading.value = true
                await cancelOrderAPI(item.id)
                //改状态为取消问诊
                item.status=OrderType.ConsultCancel
                item.statusValue = '已取消'
                showSuccessToast('取消成功')
            }catch(e){
                showFailToast('取消失败')
            }
            loading.value = false
        })
    }


    return{
        loading,
        cancelOrder
    }

}

