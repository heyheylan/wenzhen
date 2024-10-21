//查看处方逻辑
import {getPrescriptionPicAPI} from "@/apis/consult";
import {showImagePreview} from 'vant'

export const useShowPrescription = () => {
    const onShowPrescription = async (id?: string) => {
        if (id) {
            const res = await getPrescriptionPicAPI(id)
            showImagePreview([res.data.url])
        }
    }

    return {
        onShowPrescription
    }
}