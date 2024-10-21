//删除订单
import {ref} from "vue";
import type {ConsultOrderItem} from "@/types/consult";
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import {deleteOrderAPI} from "@/apis/consult";


//防止回调形参给内部函数中使用emit
export const UseDeleteConsultOrder = (cb: () => void) => {

    const deleteLoading = ref(false)
    const deleteConsultOrder = async (item: ConsultOrderItem) => {
        throw showConfirmDialog({
            title: '温馨提示',
            message: '是否确定删除订单？',
            closeOnPopstate: false
        }).then(async () => {
            try {
                deleteLoading.value = true
                await deleteOrderAPI(item.id)
                showSuccessToast('删除成功')
                //接收删除emit
                cb && cb()
            } catch (e) {
                showFailToast('删除失败')
            } finally {
                deleteLoading.value = false
            }
        })
    }


    return {
        deleteConsultOrder,
        deleteLoading,
    }
}


