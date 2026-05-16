/**
 * 图片转 Base64 工具
 * 将图片文件转换为 Base64 编码字符串
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export const imageToBase64Tool: ToolDefinition = {
  id: 'image-to-base64',
  name: '图片转 Base64',
  description: '将图片转换为 Base64 编码，支持 Data URL 和纯 Base64 输出',
  category: 'image',
  icon: 'PictureFilled',
  tags: ['base64', '图片转换', '编码', 'Data URL'],
  priority: 5,
  outputType: 'text',
  options: [
    {
      name: 'outputFormat',
      label: '输出格式',
      type: 'select',
      defaultValue: 'dataurl',
      options: [
        { label: 'Data URL (完整)', value: 'dataurl' },
        { label: '纯 Base64 (无前缀)', value: 'base64' },
        { label: 'HTML img 标签', value: 'html' },
        { label: 'CSS background-image', value: 'css' }
      ]
    },
    {
      name: 'maxSize',
      label: '最大尺寸 (px, 0=原始)',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 4096
    },
    {
      name: 'quality',
      label: 'JPEG 质量 (0-1)',
      type: 'slider',
      defaultValue: 0.92,
      min: 0.1,
      max: 1,
      step: 0.01
    }
  ],
  async execute(input: string, options?: ToolExecuteOptions): Promise<string> {
    // 检查是否为图片文件（通过 File API）
    if (typeof window !== 'undefined' && input.startsWith('data:image')) {
      // 已经是 base64 数据
      const format = options?.outputFormat || 'dataurl'

      if (format === 'base64') {
        // 移除 data:image/xxx;base64, 前缀
        const base64 = input.split(',')[1] || input
        return base64
      }

      if (format === 'html') {
        return `<img src="${input}" alt="embedded image" />`
      }

      if (format === 'css') {
        return `background-image: url("${input}");`
      }

      return input
    }

    // 如果不是图片数据，提示用户上传图片
    throw new Error('请上传图片文件进行转换。此工具支持拖拽或点击上传图片。')
  },

  examples: [
    {
      input: '',
      options: { outputFormat: 'dataurl' },
      output: '请上传图片文件进行转换',
      description: '图片转 Base64 - Data URL 格式'
    },
    {
      input: '',
      options: { outputFormat: 'html' },
      output: '<img src="..." />',
      description: '图片转 HTML img 标签'
    },
    {
      input: '',
      options: { outputFormat: 'css' },
      output: 'background-image: url("...");',
      description: '图片转 CSS background-image'
    }
  ]
}
