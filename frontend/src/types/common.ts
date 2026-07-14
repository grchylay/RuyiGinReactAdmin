/** 通用工具类型 */
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ValueOf<T> = T[keyof T]

/** 通用回调 */
export type VoidCallback = () => void
export type ValueCallback<T> = (value: T) => void
