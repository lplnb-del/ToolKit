/**
 * CSS 渐变生成器
 * 支持线性渐变、径向渐变、圆锥渐变
 */

import type { ToolDefinition } from '../types'

/**
 * 颜色停止点
 */
interface ColorStop {
  color: string
  position: number
}

/**
 * 预设渐变颜色组
 */
const GRADIENT_PRESETS: Record<string, { colors: ColorStop[]; angle?: number; type?: string }> = {
  'sunset': { colors: [{ color: '#ff6b6b', position: 0 }, { color: '#feca57', position: 50 }, { color: '#48dbfb', position: 100 }], angle: 90 },
  'ocean': { colors: [{ color: '#006ba6', position: 0 }, { color: '#0496ff', position: 50 }, { color: '#6ccff6', position: 100 }], angle: 90 },
  'forest': { colors: [{ color: '#2d6a4f', position: 0 }, { color: '#40916c', position: 50 }, { color: '#52b788', position: 100 }], angle: 90 },
  'purple-haze': { colors: [{ color: '#5f27cd', position: 0 }, { color: '#a55eea', position: 50 }, { color: '#c44569', position: 100 }], angle: 90 },
  'midnight': { colors: [{ color: '#0c2461', position: 0 }, { color: '#1e3799', position: 50 }, { color: '#4a69bd', position: 100 }], angle: 90 },
  'cherry': { colors: [{ color: '#eb3349', position: 0 }, { color: '#f45c43', position: 100 }], angle: 90 },
  'lime': { colors: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }], angle: 90 },
  'berry': { colors: [{ color: '#8e2de2', position: 0 }, { color: '#4a00e0', position: 100 }], angle: 90 },
  'sunrise': { colors: [{ color: '#ff512f', position: 0 }, { color: '#dd2476', position: 100 }], angle: 90 },
  'cool-blue': { colors: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }], angle: 90 },
  'pink-love': { colors: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 100 }], angle: 90 },
  'morning': { colors: [{ color: '#e0c3fc', position: 0 }, { color: '#8ec5fc', position: 100 }], angle: 90 },
  'fire': { colors: [{ color: '#ff416c', position: 0 }, { color: '#ff4b2b', position: 100 }], angle: 90 },
  'sky': { colors: [{ color: '#56ccf2', position: 0 }, { color: '#2f80ed', position: 100 }], angle: 90 },
  'spring': { colors: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }], angle: 90 },
  'golden': { colors: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }], angle: 90 }
}

/**
 * 生成线性渐变 CSS
 */
function generateLinearGradient(
  angle: number,
  colorStops: ColorStop[]
): string {
  const stops = colorStops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')
  return `linear-gradient(${angle}deg, ${stops})`
}

/**
 * 生成径向渐变 CSS
 */
function generateRadialGradient(
  shape: 'circle' | 'ellipse',
  position: string,
  colorStops: ColorStop[]
): string {
  const stops = colorStops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')
  return `radial-gradient(${shape} at ${position}, ${stops})`
}

/**
 * 生成圆锥渐变 CSS
 */
function generateConicGradient(
  angle: number,
  position: string,
  colorStops: ColorStop[]
): string {
  const stops = colorStops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')
  return `conic-gradient(from ${angle}deg at ${position}, ${stops})`
}

/**
 * 生成 CSS 代码
 */
 
 
 
 
 
function generateCSS(
  gradientType: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>,
  colorStops: ColorStop[]
): string {
  let gradient = ''

  switch (gradientType) {
    case 'linear':
      gradient = generateLinearGradient(options.angle || 90, colorStops)
      break
    case 'radial':
      gradient = generateRadialGradient(
        options.shape || 'ellipse',
        options.position || 'center',
        colorStops
      )
      break
    case 'conic':
      gradient = generateConicGradient(
        options.angle || 0,
        options.position || 'center',
        colorStops
      )
      break
    case 'preset':
      const preset = GRADIENT_PRESETS[(options.preset as string) || 'sunset']
      gradient = generateLinearGradient(preset?.angle || 90, preset?.colors || [])
      break
    default:
      gradient = generateLinearGradient(90, colorStops)
  }

  return `/* CSS 渐变代码 */
.background {
  background: ${gradient};
}

/* 作为文字渐变 */
.text-gradient {
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 完整 CSS */
.gradient-box {
  width: 200px;
  height: 100px;
  background: ${gradient};
  border-radius: 8px;
}`
}

/**
 * 解析颜色停止点
 */
function parseColorStops(input: string): ColorStop[] {
  const stops: ColorStop[] = []
  const lines = input.split('\n').filter(line => line.trim())

  for (const line of lines) {
    const parts = line.trim().split(/\s+/)
    if (parts.length >= 1 && parts[0]) {
      const color = parts[0]
      const position = parts[1] ? parseFloat(parts[1].replace('%', '')) : 0
      stops.push({ color, position: isNaN(position) ? 0 : position })
    }
  }

  return stops.length > 0 ? stops : [
    { color: '#ff6b6b', position: 0 },
    { color: '#4ecdc4', position: 100 }
  ]
}

/**
 * CSS 渐变生成器工具定义
 */
export const gradientGeneratorTool: ToolDefinition = {
  id: 'gradient-generator',
  name: '渐变生成器',
  description: '生成 CSS 线性、径向、圆锥渐变代码，支持预设渐变',
  category: 'css',
  icon: 'BrushFilled',
  tags: ['CSS', '渐变', '线性渐变', '径向渐变', '背景'],
  priority: 85,

  options: [
    {
      name: 'mode',
      type: 'select',
      label: '选择模式',
      defaultValue: 'preset',
      options: [
        { label: '🎨 预设渐变', value: 'preset' },
        { label: '✨ 自定义渐变', value: 'custom' }
      ]
    },
    {
      name: 'type',
      type: 'select',
      label: '渐变类型',
      defaultValue: 'linear',
      options: [
        { label: '线性渐变', value: 'linear' },
        { label: '径向渐变', value: 'radial' },
        { label: '圆锥渐变', value: 'conic' }
      ]
    },
    {
      name: 'preset',
      type: 'select',
      label: '预设渐变',
      defaultValue: 'sunset',
      options: [
        { label: '🌅 日落 (Sunset)', value: 'sunset' },
        { label: '🌊 海洋 (Ocean)', value: 'ocean' },
        { label: '🌲 森林 (Forest)', value: 'forest' },
        { label: '💜 紫雾 (Purple Haze)', value: 'purple-haze' },
        { label: '🌙 午夜 (Midnight)', value: 'midnight' },
        { label: '🍒 樱桃 (Cherry)', value: 'cherry' },
        { label: '🍋 青柠 (Lime)', value: 'lime' },
        { label: '🫐 浆果 (Berry)', value: 'berry' },
        { label: '🌅 日出 (Sunrise)', value: 'sunrise' },
        { label: '❄️ 冷蓝 (Cool Blue)', value: 'cool-blue' },
        { label: '💕 粉色 (Pink Love)', value: 'pink-love' },
        { label: '🌤️ 晨光 (Morning)', value: 'morning' },
        { label: '🔥 火焰 (Fire)', value: 'fire' },
        { label: '☁️ 天空 (Sky)', value: 'sky' },
        { label: '🌸 春天 (Spring)', value: 'spring' },
        { label: '✨ 金色 (Golden)', value: 'golden' }
      ]
    },
    {
      name: 'angle',
      type: 'number',
      label: '角度 (0-360)',
      defaultValue: 90,
      min: 0,
      max: 360
    },
    {
      name: 'shape',
      type: 'select',
      label: '形状（径向渐变）',
      defaultValue: 'ellipse',
      options: [
        { label: '椭圆形', value: 'ellipse' },
        { label: '圆形', value: 'circle' }
      ]
    },
    {
      name: 'position',
      type: 'select',
      label: '中心位置',
      defaultValue: 'center',
      options: [
        { label: '中心', value: 'center' },
        { label: '左上', value: 'left top' },
        { label: '右上', value: 'right top' },
        { label: '左下', value: 'left bottom' },
        { label: '右下', value: 'right bottom' }
      ]
    }
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (input: string, options?: Record<string, any>): string => {
    const mode = options?.mode || 'preset'

    if (mode === 'preset') {
      return generateCSS('preset', options || {}, [])
    }

    const colorStops = parseColorStops(input)
    return generateCSS(options?.type || 'linear', options || {}, colorStops)
  },

  examples: [
    {
      input: '',
      options: { mode: 'preset', preset: 'sunset', angle: 90 },
      output: 'linear-gradient',
      description: '日落渐变'
    },
    {
      input: '',
      options: { mode: 'preset', preset: 'ocean', angle: 90 },
      output: 'linear-gradient',
      description: '海洋渐变'
    },
    {
      input: '',
      options: { mode: 'preset', preset: 'fire', angle: 45 },
      output: 'linear-gradient',
      description: '火焰渐变'
    }
  ]
}
