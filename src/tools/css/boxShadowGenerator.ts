/**
 * Box Shadow 生成器
 * 生成 CSS box-shadow 效果代码
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

interface ShadowConfig {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

function generateShadowCode(shadows: ShadowConfig[], prefix: string = ''): string {
  return shadows.map(s => {
    const parts = [
      s.inset ? 'inset' : '',
      `${s.offsetX}px`,
      `${s.offsetY}px`,
      `${s.blur}px`,
      `${s.spread}px`,
      s.color
    ].filter(Boolean).join(' ')

    return `  ${prefix}box-shadow: ${parts};`
  }).join('\n')
}

export const boxShadowGeneratorTool: ToolDefinition = {
  id: 'box-shadow-generator',
  name: 'Box Shadow 生成器',
  description: '可视化生成 CSS box-shadow 阴影效果',
  category: 'css',
  icon: 'BrushFilled',
  tags: ['box-shadow', '阴影', 'CSS', '效果'],
  priority: 10,
  options: [
    {
      name: 'offsetX',
      label: '水平偏移 (px)',
      type: 'number',
      defaultValue: 0,
      min: -50,
      max: 50
    },
    {
      name: 'offsetY',
      label: '垂直偏移 (px)',
      type: 'number',
      defaultValue: 4,
      min: -50,
      max: 50
    },
    {
      name: 'blur',
      label: '模糊半径 (px)',
      type: 'number',
      defaultValue: 6,
      min: 0,
      max: 100
    },
    {
      name: 'spread',
      label: '扩展半径 (px)',
      type: 'number',
      defaultValue: 0,
      min: -50,
      max: 50
    },
    {
      name: 'color',
      label: '颜色',
      type: 'input',
      defaultValue: 'rgba(0, 0, 0, 0.15)'
    },
    {
      name: 'inset',
      label: '内阴影',
      type: 'switch',
      defaultValue: false
    },
    {
      name: 'outputFormat',
      label: '输出格式',
      type: 'select',
      defaultValue: 'css',
      options: [
        { label: '纯 CSS', value: 'css' },
        { label: '带预览 HTML', value: 'html' },
        { label: 'SCSS/SASS', value: 'scss' }
      ]
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      const shadow: ShadowConfig = {
        offsetX: Number(options?.offsetX) || 0,
        offsetY: Number(options?.offsetY) || 4,
        blur: Number(options?.blur) || 6,
        spread: Number(options?.spread) || 0,
        color: options?.color || 'rgba(0, 0, 0, 0.15)',
        inset: Boolean(options?.inset)
      }

      const format = options?.outputFormat || 'css'

      let output = ''

      if (format === 'html') {
        output = `<div style="
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 8px;
${generateShadowCode([shadow], '').split('\n').map(l => '  ' + l).join('\n')}
  display: flex;
  align-items: center;
  justify-content: center;
">
  <span style="color: #666;">Box Shadow</span>
</div>`
      } else if (format === 'scss') {
        output = `// Box Shadow Mixin
@mixin box-shadow($shadow...) {
  box-shadow: $shadow;
}

// 使用示例
.element {
  @include box-shadow(
    ${shadow.inset ? 'inset ' : ''}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}
  );
}`
      } else {
        output = `.element {\n${generateShadowCode([shadow])}\n}`
      }

      return output
    } catch (error) {
      return `错误: 生成失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: '',
      options: { offsetX: 0, offsetY: 4, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.15)', outputFormat: 'css' },
      output: '.element {',
      description: '默认卡片阴影'
    },
    {
      input: '',
      options: { offsetX: 0, offsetY: 10, blur: 20, spread: -5, color: 'rgba(0, 0, 0, 0.25)', outputFormat: 'css' },
      output: '.element {',
      description: '柔和阴影'
    },
    {
      input: '',
      options: { offsetX: 0, offsetY: 4, blur: 6, spread: 0, color: 'rgba(59, 130, 246, 0.5)', inset: true, outputFormat: 'css' },
      output: 'inset',
      description: '内阴影'
    }
  ]
}
