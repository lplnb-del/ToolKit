/**
 * 图片压缩工具
 * 支持 JPEG、PNG 格式图片压缩，纯前端实现
 */

import type { ToolDefinition } from '../types'

/**
 * 压缩选项
 */
interface CompressOptions {
  quality: number
  maxWidth: number
  maxHeight: number
  format: 'jpeg' | 'png' | 'webp' | 'original'
}

/**
 * 压缩结果
 */
interface CompressResult {
  originalSize: number
  compressedSize: number
  compressionRatio: string
  dataUrl: string
  width: number
  height: number
}

/**
 * 文件大小格式化
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 加载图片
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

/**
 * 压缩图片
 */
async function compressImage(
  dataUrl: string,
  options: CompressOptions
): Promise<CompressResult> {
  // 加载图片
  const img = await loadImage(dataUrl)

  // 计算压缩后的尺寸
  let width = img.width
  let height = img.height

  if (width > options.maxWidth || height > options.maxHeight) {
    const ratio = Math.min(
      options.maxWidth / width,
      options.maxHeight / height
    )
    width = Math.floor(width * ratio)
    height = Math.floor(height * ratio)
  }

  // 创建 canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('无法创建 canvas 上下文')
  }

  // 绘制图片
  ctx.drawImage(img, 0, 0, width, height)

  // 确定输出格式
  let mimeType = 'image/jpeg'
  let isPngOutput = false
  if (options.format === 'png') {
    mimeType = 'image/png'
    isPngOutput = true
  } else if (options.format === 'webp') {
    mimeType = 'image/webp'
  } else if (options.format === 'original') {
    // 尝试从 dataUrl 获取原始格式
    if (dataUrl.includes('image/png')) {
      mimeType = 'image/png'
      isPngOutput = true
    } else if (dataUrl.includes('image/webp')) {
      mimeType = 'image/webp'
    }
  }

  // 计算原始大小
  const originalSize = Math.ceil(dataUrl.length * 0.75) // Base64 约为原大小的 4/3

  let compressedDataUrl: string
  let compressedSize: number

  // 如果是 PNG 格式，尝试用 JPEG 压缩以获得更好的压缩率
  if (isPngOutput) {
    // 先尝试 PNG 格式
    const pngDataUrl = canvas.toDataURL('image/png')
    const pngSize = Math.ceil(pngDataUrl.length * 0.75)

    // 再尝试 JPEG 格式
    const jpegDataUrl = canvas.toDataURL('image/jpeg', options.quality / 100)
    const jpegSize = Math.ceil(jpegDataUrl.length * 0.75)

    // 选择更小的那个
    if (jpegSize < pngSize) {
      compressedDataUrl = jpegDataUrl
      compressedSize = jpegSize
      mimeType = 'image/jpeg'
    } else {
      compressedDataUrl = pngDataUrl
      compressedSize = pngSize
    }
  } else {
    // 其他格式直接使用质量参数
    compressedDataUrl = canvas.toDataURL(mimeType, options.quality / 100)
    compressedSize = Math.ceil(compressedDataUrl.length * 0.75)
  }

  // 计算压缩率
  const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1)

  return {
    originalSize,
    compressedSize,
    compressionRatio,
    dataUrl: compressedDataUrl,
    width,
    height
  }
}

/**
 * 图片压缩结果
 */
export interface ImageCompressorResult {
  type: 'image'
  dataUrl: string
  info: string
  fileName: string
}

/**
 * 图片压缩工具定义
 */
export const imageCompressorTool: ToolDefinition = {
  id: 'image-compressor',
  name: '图片压缩',
  description: '压缩 JPEG、PNG 图片，支持调整质量和尺寸',
  category: 'image',
  icon: 'PictureFilled',
  tags: ['图片', '压缩', '优化', 'JPEG', 'PNG', 'WebP'],
  priority: 80,
  outputType: 'image',

  options: [
    {
      name: 'quality',
      type: 'number',
      label: '压缩质量',
      defaultValue: 80,
      min: 1,
      max: 100
    },
    {
      name: 'maxWidth',
      type: 'number',
      label: '最大宽度 (像素)',
      defaultValue: 1920,
      min: 100,
      max: 4096
    },
    {
      name: 'maxHeight',
      type: 'number',
      label: '最大高度 (像素)',
      defaultValue: 1920,
      min: 100,
      max: 4096
    },
    {
      name: 'format',
      type: 'select',
      label: '输出格式',
      defaultValue: 'original',
      options: [
        { label: '保持原格式', value: 'original' },
        { label: 'JPEG', value: 'jpeg' },
        { label: 'PNG', value: 'png' },
        { label: 'WebP', value: 'webp' }
      ]
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (input: string, options?: Record<string, any>): Promise<ImageCompressorResult> => {
    if (!input.trim()) {
      throw new Error('请上传图片文件')
    }

    // 检查是否是有效的图片数据 URL
    if (!input.startsWith('data:image/')) {
      throw new Error('请输入有效的图片数据')
    }

    const compressOptions: CompressOptions = {
      quality: options?.quality || 80,
      maxWidth: options?.maxWidth || 1920,
      maxHeight: options?.maxHeight || 1920,
      format: options?.format || 'original'
    }

    const result = await compressImage(input, compressOptions)

    // 确定实际使用的格式
    let actualFormat = 'JPEG'
    let ext = 'jpg'
    if (result.dataUrl.includes('image/png')) {
      actualFormat = 'PNG'
      ext = 'png'
    } else if (result.dataUrl.includes('image/webp')) {
      actualFormat = 'WebP'
      ext = 'webp'
    }

    // 如果用户选择 PNG 但实际使用了 JPEG，添加提示
    let formatNotice = ''
    if ((compressOptions.format === 'png' || compressOptions.format === 'original') && actualFormat === 'JPEG') {
      formatNotice = '\n💡 提示：原 PNG 图片使用 JPEG 格式压缩以获得更好的压缩效果'
    }

    const info = `📊 压缩统计：
• 原始大小: ${formatFileSize(result.originalSize)}
• 压缩后大小: ${formatFileSize(result.compressedSize)}
• 压缩率: ${result.compressionRatio}%
• 输出格式: ${actualFormat}${formatNotice}

📐 图片尺寸：${result.width} × ${result.height} 像素`

    return {
      type: 'image',
      dataUrl: result.dataUrl,
      info,
      fileName: `compressed_${Date.now()}.${ext}`
    }
  },

  examples: [
    {
      input: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
      output: '图片压缩完成',
      description: '压缩 JPEG 图片示例'
    }
  ]
}
