/**
 * 工具注册中心
 * 集中管理所有工具的注册和查询
 */

import type { ToolDefinition, ToolCategory, CategoryInfo } from './types'

// 导入编码加密类工具
import { base64Tool, urlTool, hashTool, aesTool, morseCodeTool, base32Tool, rotTool } from './encoder'

// 导入开发辅助类工具
import { jsonTool, timestampTool, uuidTool, passwordTool, baseConverterTool, regexTesterTool, cronParserTool } from './developer'

// 导入 CSS 设计类工具
import { colorConverterTool, gradientGeneratorTool, colorPickerTool, boxShadowGeneratorTool, borderRadiusTool } from './css'

// 导入生成工具类
import { qrCodeTool, loremIpsumTool } from './generator'

// 导入图片工具类
import { imageCompressorTool, qrCodeReaderTool, imageToBase64Tool } from './image'

// 导入格式化工具类
import { htmlFormatterTool, codeFormatterTool } from './formatter'

// 导入数据处理工具类
import { csvJsonConverterTool, textProcessorTool, dataValidatorTool } from './data'

// 导入网络工具类
import { urlParserTool, httpStatusTool } from './network'

// 导入计算换算工具类
import { timezoneConverterTool, unitConverterTool, dateCalculatorTool } from './calculator'

// 分类信息 - 使用字符串标识图标，在组件中映射到实际图标
export const categories: CategoryInfo[] = [
  {
    id: 'encoder',
    name: '编码加密',
    icon: 'Lock',
    color: '#3b82f6',
    description: 'Base64、URL、哈希等编码加密工具',
  },
  {
    id: 'developer',
    name: '开发辅助',
    icon: 'Code',
    color: '#8b5cf6',
    description: 'JSON、正则、时间戳等开发常用工具',
  },
  {
    id: 'css',
    name: 'CSS 设计',
    icon: 'BrushFilled',
    color: '#06b6d4',
    description: '颜色转换、渐变生成等 CSS 工具',
  },
  {
    id: 'generator',
    name: '生成工具',
    icon: 'MagicStick',
    color: '#10b981',
    description: '二维码、UUID、密码等生成工具',
  },
  {
    id: 'formatter',
    name: '格式化',
    icon: 'Document',
    color: '#f59e0b',
    description: '代码美化、压缩等格式化工具',
  },
  {
    id: 'data',
    name: '数据处理',
    icon: 'DataAnalysis',
    color: '#ec4899',
    description: 'CSV、JSON、文本等数据处理工具',
  },
  {
    id: 'image',
    name: '图片工具',
    icon: 'PictureFilled',
    color: '#f97316',
    description: '图片压缩、转换等图片处理工具',
  },
  {
    id: 'network',
    name: '网络工具',
    icon: 'Connection',
    color: '#6366f1',
    description: 'IP 查询、URL 处理等网络工具',
  },
  {
    id: 'calculator',
    name: '计算换算',
    icon: 'Calculator',
    color: '#14b8a6',
    description: '日期计算、单位换算等工具',
  },
]

// 工具注册表
const toolRegistry = new Map<string, ToolDefinition>()

/**
 * 注册工具
 */
export function registerTool(tool: ToolDefinition): void {
  toolRegistry.set(tool.id, tool)
}

/**
 * 批量注册工具
 */
export function registerTools(tools: ToolDefinition[]): void {
  tools.forEach(registerTool)
}

/**
 * 初始化工具注册
 */
export function initTools(): void {
  // 注册编码加密类工具
  registerTool(base64Tool)
  registerTool(urlTool)
  registerTool(hashTool)
  registerTool(aesTool)
  registerTool(morseCodeTool)
  registerTool(base32Tool)
  registerTool(rotTool)

  // 注册开发辅助类工具
  registerTool(jsonTool)
  registerTool(timestampTool)
  registerTool(uuidTool)
  registerTool(passwordTool)
  registerTool(baseConverterTool)
  registerTool(regexTesterTool)
  registerTool(cronParserTool)

  // 注册 CSS 设计类工具
  registerTool(colorConverterTool)
  registerTool(gradientGeneratorTool)
  registerTool(colorPickerTool)
  registerTool(boxShadowGeneratorTool)
  registerTool(borderRadiusTool)

  // 注册生成工具
  registerTool(qrCodeTool)
  registerTool(loremIpsumTool)

  // 注册图片工具
  registerTool(imageCompressorTool)
  registerTool(qrCodeReaderTool)
  registerTool(imageToBase64Tool)

  // 注册格式化工具
  registerTool(htmlFormatterTool)
  registerTool(codeFormatterTool)

  // 注册数据处理工具
  registerTool(csvJsonConverterTool)
  registerTool(textProcessorTool)
  registerTool(dataValidatorTool)

  // 注册网络工具
  registerTool(urlParserTool)
  registerTool(httpStatusTool)

  // 注册计算换算工具
  registerTool(timezoneConverterTool)
  registerTool(unitConverterTool)
  registerTool(dateCalculatorTool)
}

/**
 * 获取工具
 */
export function getTool(id: string): ToolDefinition | undefined {
  return toolRegistry.get(id)
}

/**
 * 获取所有工具
 */
export function getAllTools(): ToolDefinition[] {
  return Array.from(toolRegistry.values())
}

/**
 * 按分类获取工具
 */
export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return getAllTools().filter(tool => tool.category === category)
}

/**
 * 搜索工具
 */
export function searchTools(query: string): ToolDefinition[] {
  const lowerQuery = query.toLowerCase()
  return getAllTools().filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * 获取热门工具（按优先级排序）
 */
export function getPopularTools(limit = 8): ToolDefinition[] {
  return getAllTools()
    .filter(tool => !tool.deprecated)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, limit)
}

/**
 * 获取分类信息
 */
export function getCategory(id: ToolCategory): CategoryInfo | undefined {
  return categories.find(cat => cat.id === id)
}

/**
 * 获取工具数量
 */
export function getToolCount(): number {
  return toolRegistry.size
}

/**
 * 获取分类工具数量
 */
export function getCategoryToolCount(category: ToolCategory): number {
  return getToolsByCategory(category).length
}

// 自动初始化工具
initTools()

// 重新导出 ToolCategory 类型
export type { ToolCategory } from './types'
