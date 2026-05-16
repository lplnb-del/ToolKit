/**
 * 工具类型定义
 * 定义工具的完整数据结构
 */

// 工具分类
export type ToolCategory =
  | 'encoder'      // 编码加密
  | 'developer'    // 开发辅助
  | 'converter'    // 转换工具
  | 'generator'    // 生成工具
  | 'formatter'    // 格式化
  | 'css'          // CSS 工具
  | 'image'        // 图片工具
  | 'text'         // 文本工具
  | 'data'         // 数据处理
  | 'network'      // 网络工具
  | 'calculator'   // 计算换算

// 工具执行选项
export interface ToolExecuteOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

// 工具选项配置
export interface ToolOption {
  name: string
  type: 'select' | 'checkbox' | 'number' | 'text' | 'radio' | 'switch' | 'slider' | 'input'
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: { label: string; value: any }[]
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

// 工具示例
export interface ToolExample {
  input: string
  output: string
  description?: string
  options?: ToolExecuteOptions
}

// 图片输出结果
export interface ImageOutputResult {
  type: 'image'
  dataUrl: string
  info: string
  fileName: string
}

// 工具执行结果类型
export type ToolExecuteResult = string | ImageOutputResult

// 工具定义
export interface ToolDefinition {
  // 唯一标识
  id: string

  // 显示信息
  name: string
  description: string
  category: ToolCategory
  icon: string
  tags?: string[]

  // 功能实现
  execute: (input: string, options?: ToolExecuteOptions) => ToolExecuteResult | Promise<ToolExecuteResult>

  // 配置选项
  options?: ToolOption[]

  // 示例数据
  examples?: ToolExample[]

  // 输出类型：text | image
  outputType?: 'text' | 'image'

  // 元数据
  priority?: number
  deprecated?: boolean
}

// 工具分类信息
export interface CategoryInfo {
  id: ToolCategory
  name: string
  icon: string
  color: string
  description: string
}
