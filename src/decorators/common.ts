import { SetMetadata } from '@nestjs/common';
// 用于向拦截器注入参数 跳过验证
export const DisableCheck = (disableCheck: boolean = true) => SetMetadata('disableCheck', disableCheck);
