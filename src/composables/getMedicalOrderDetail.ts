import { getMedicalOrderDetailAPI } from '@/apis/order'
import type { OrderDetail } from '@/types/order'
import { onMounted, ref } from 'vue'

export const useOrderDetail = (id: string) => {
    const loading = ref(false)
    const order = ref<OrderDetail>()
    onMounted(async () => {
        loading.value = true
        try {
            const res = await getMedicalOrderDetailAPI(id)
            order.value = res.data
        } finally {
            loading.value = false
        }
    })
    return { order, loading }
}
