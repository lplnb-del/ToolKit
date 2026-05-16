/**
 * 二维码识别工具
 * 支持识别图片中的二维码
 */

import type { ToolDefinition } from '../types'
import jsQR from 'jsqr'

/**
 * 从图片数据 URL 识别二维码
 */
async function readQRCode(imageData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        // 创建 canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法创建 canvas 上下文'))
          return
        }

        // 设置 canvas 尺寸
        canvas.width = img.width
        canvas.height = img.height

        // 绘制图片
        ctx.drawImage(img, 0, 0)

        // 获取图像数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // 使用 jsQR 识别二维码
        const code = jsQR(imageData.data, canvas.width, canvas.height, {
          inversionAttempts: 'attemptBoth'
        })

        if (code) {
          resolve(code.data)
        } else {
          reject(new Error('未在图片中识别到二维码'))
        }
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    img.src = imageData
  })
}

/**
 * 二维码识别工具定义
 */
export const qrCodeReaderTool: ToolDefinition = {
  id: 'qr-code-reader',
  name: '二维码识别',
  description: '识别图片中的二维码内容',
  category: 'image',
  icon: 'Camera',
  priority: 75,
  outputType: 'text',

  execute: async (input: string): Promise<string> => {
    if (!input.trim()) {
      return '请上传包含二维码的图片'
    }

    // 检查是否是有效的图片数据 URL
    if (!input.startsWith('data:image/')) {
      return '错误: 请上传有效的图片文件'
    }

    try {
      const result = await readQRCode(input)

      return `✅ 二维码识别成功！

📋 识别结果：
${result}

📊 信息统计：
• 字符数: ${result.length}
• 字节数: ${new Blob([result]).size}

💡 提示：
• 如果识别失败，请确保二维码清晰可见
• 支持识别黑白和彩色二维码
• 支持识别倒置的二维码`
    } catch (error) {
      return `❌ 识别失败: ${(error as Error).message}

💡 建议：
• 确保图片包含清晰的二维码
• 尝试调整图片亮度或对比度
• 确保二维码没有严重变形或损坏`
    }
  },

  examples: [
    {
      input: 'data:image/png;base64,...',
      output: 'https://www.example.com',
      description: '识别二维码示例'
    }
  ]
}
