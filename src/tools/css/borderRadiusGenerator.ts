/**
 * Border Radius 生成器
 * 生成 CSS border-radius 圆角代码
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

export const borderRadiusTool: ToolDefinition = {
  id: 'border-radius-generator',
  name: 'Border Radius 生成器',
  description: '可视化生成 CSS border-radius 圆角效果',
  category: 'css',
  icon: 'BrushFilled',
  tags: ['border-radius', '圆角', 'CSS'],
  priority: 9,
  options: [
    {
      name: 'topLeft',
      label: '左上 (px 或 %)',
      type: 'input',
      defaultValue: '8px'
    },
    {
      name: 'topRight',
      label: '右上 (px 或 %)',
      type: 'input',
      defaultValue: '8px'
    },
    {
      name: 'bottomRight',
      label: '右下 (px 或 %)',
      type: 'input',
      defaultValue: '8px'
    },
    {
      name: 'bottomLeft',
      label: '左下 (px 或 %)',
      type: 'input',
      defaultValue: '8px'
    },
    {
      name: 'mode',
      label: '模式',
      type: 'select',
      defaultValue: 'individual',
      options: [
        { label: '独立设置四角', value: 'individual' },
        { label: '统一值', value: 'uniform' },
        { label: '椭圆形', value: 'ellipse' },
        { label: '常用形状预设', value: 'preset' }
      ]
    },
    {
      name: 'preset',
      label: '预设形状',
      type: 'select',
      defaultValue: 'circle',
      options: [
        { label: '圆形 (Circle)', value: 'circle' },
        { label: '药丸形 (Pill)', value: 'pill' },
        { label: '椭圆形 (Ellipse)', value: 'ellipse' },
        { label: '花瓣形 (Blob)', value: 'blob' },
        { label: '斜切角 (Notch)', value: 'notch' },
        { label: '不规则形 (Random)', value: 'random' }
      ]
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      const mode = options?.mode || 'individual'

      let borderRadius = ''

      if (mode === 'uniform') {
        const value = options?.topLeft || '8px'
        borderRadius = value
      } else if (mode === 'preset') {
        const preset = options?.preset || 'circle'

        switch (preset) {
          case 'circle':
            borderRadius = '50%'
            break
          case 'pill':
            borderRadius = '9999px'
            break
          case 'ellipse':
            borderRadius = '50% / 50%'
            break
          case 'blob':
            borderRadius = '60% 40% 30% 70% / 60% 30% 70% 40%'
            break
          case 'notch':
            borderRadius = '255px 15px 225px 15px / 15px 225px 15px 255px'
            break
          case 'random':
            const randomize = () => Math.floor(Math.random() * 80 + 20) + '%'
            borderRadius = `${randomize()} ${randomize()} ${randomize()} ${randomize()} / ${randomize()} ${randomize()} ${randomize()} ${randomize()}`
            break
          default:
            borderRadius = '8px'
        }
      } else if (mode === 'ellipse') {
        const h = options?.topLeft || '50%'
        const v = options?.topRight || '50%'
        borderRadius = `${h} / ${v}`
      } else {
        const tl = options?.topLeft || '8px'
        const tr = options?.topRight || '8px'
        const br = options?.bottomRight || '8px'
        const bl = options?.bottomLeft || '8px'

        if (tl === tr && tr === br && br === bl) {
          borderRadius = tl
        } else {
          borderRadius = `${tl} ${tr} ${br} ${bl}`
        }
      }

      const cssCode = `.element {
  border-radius: ${borderRadius};
}`

      const previewHtml = `<div style="
  width: 200px;
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
">
  Preview
</div>`

      return `/* CSS 代码 */\n${cssCode}\n\n/* 预览 */\n${previewHtml}`
    } catch (error) {
      return `错误: 生成失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: '',
      options: { mode: 'preset', preset: 'circle' },
      output: 'border-radius:',
      description: '圆形'
    },
    {
      input: '',
      options: { mode: 'preset', preset: 'pill' },
      output: 'border-radius:',
      description: '药丸形'
    },
    {
      input: '',
      options: { mode: 'uniform', topLeft: '12px' },
      output: 'border-radius:',
      description: '统一圆角 12px'
    }
  ]
}
