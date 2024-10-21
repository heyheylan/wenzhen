//格式化工具
import {IllnessTime} from "@/enums";

// export enum IllnessTime {
//     /** 一周内 */
//     Week = 1,
//     /** 一月内 */
//     Month,
//     /** 半年内 */
//     HalfYear,
//     /** 半年以上 */
//     More
// }

export const getIllnessTimeText = (time: IllnessTime) => {
    switch (time) {
        case IllnessTime.Week:
            return '一周内';
        case IllnessTime.Month:
            return '一月内';
        case IllnessTime.HalfYear:
            return '半年内';
        case IllnessTime.More:
            return '半年以上';
        default:
            throw new Error('Invalid IllnessTime value');
    }
}

export const getConsultFlagText = (flag: 0 | 1) => {
    switch (flag) {
        case 0:
            return '未就诊过';
        case 1:
            return '已就诊过';
        default:
            throw new Error('Invalid flag value');
    }
}