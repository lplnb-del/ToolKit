/**
 * 单位换算工具
 * 支持长度、重量、温度、面积、体积、速度、存储等多种单位换算
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

interface UnitConversion {
  name: string
  symbol: string
  toBase: number // 转换为基准单位的乘数
}

const UNIT_CATEGORIES: Record<string, { units: UnitConversion[]; baseUnit: string }> = {
  length: {
    baseUnit: 'meter',
    units: [
      { name: '毫米', symbol: 'mm', toBase: 0.001 },
      { name: '厘米', symbol: 'cm', toBase: 0.01 },
      { name: '米', symbol: 'm', toBase: 1 },
      { name: '千米', symbol: 'km', toBase: 1000 },
      { name: '英寸', symbol: 'in', toBase: 0.0254 },
      { name: '英尺', symbol: 'ft', toBase: 0.3048 },
      { name: '码', symbol: 'yd', toBase: 0.9144 },
      { name: '英里', symbol: 'mi', toBase: 1609.344 },
      { name: '海里', symbol: 'nmi', toBase: 1852 },
      { name: '光年', symbol: 'ly', toBase: 9.461e15 }
    ]
  },
  weight: {
    baseUnit: 'gram',
    units: [
      { name: '毫克', symbol: 'mg', toBase: 0.001 },
      { name: '克', symbol: 'g', toBase: 1 },
      { name: '千克', symbol: 'kg', toBase: 1000 },
      { name: '吨', symbol: 't', toBase: 1e6 },
      { name: '盎司', symbol: 'oz', toBase: 28.3495 },
      { name: '磅', symbol: 'lb', toBase: 453.592 },
      { name: ' stone', symbol: 'st', toBase: 6350.29 }
    ]
  },
  temperature: {
    baseUnit: 'kelvin',
    units: [
      { name: '摄氏度', symbol: '°C', toBase: 1 }, // 特殊处理
      { name: '华氏度', symbol: '°F', toBase: 1 }, // 特殊处理
      { name: '开尔文', symbol: 'K', toBase: 1 }
    ]
  },
  area: {
    baseUnit: 'sqmeter',
    units: [
      { name: '平方毫米', symbol: 'mm²', toBase: 1e-6 },
      { name: '平方厘米', symbol: 'cm²', toBase: 1e-4 },
      { name: '平方米', symbol: 'm²', toBase: 1 },
      { name: '平方千米', symbol: 'km²', toBase: 1e6 },
      { name: '公顷', symbol: 'ha', toBase: 1e4 },
      { name: '亩', symbol: 'mu', toBase: 666.667 },
      { name: '平方英寸', symbol: 'in²', toBase: 6.4516e-4 },
      { name: '平方英尺', symbol: 'ft²', toBase: 0.092903 }
    ]
  },
  volume: {
    baseUnit: 'liter',
    units: [
      { name: '毫升', symbol: 'mL', toBase: 0.001 },
      { name: '升', symbol: 'L', toBase: 1 },
      { name: '立方米', symbol: 'm³', toBase: 1000 },
      { name: '加仑(美)', symbol: 'gal', toBase: 3.78541 },
      { name: '品脱', symbol: 'pt', toBase: 0.473176 },
      { name: '液量盎司', symbol: 'fl oz', toBase: 0.0295735 }
    ]
  },
  speed: {
    baseUnit: 'mps',
    units: [
      { name: '米/秒', symbol: 'm/s', toBase: 1 },
      { name: '千米/时', symbol: 'km/h', toBase: 0.277778 },
      { name: '英里/时', symbol: 'mph', toBase: 0.44704 },
      { name: '节', symbol: 'kn', toBase: 0.514444 },
      { name: '马赫(海平面)', symbol: 'Ma', toBase: 340.29 }
    ]
  },
  storage: {
    baseUnit: 'byte',
    units: [
      { name: '比特', symbol: 'bit', toBase: 0.125 },
      { name: '字节', symbol: 'B', toBase: 1 },
      { name: '千字节', symbol: 'KB', toBase: 1024 },
      { name: '兆字节', symbol: 'MB', toBase: 1048576 },
      { name: '吉字节', symbol: 'GB', toBase: 1073741824 },
      { name: '太字节', symbol: 'TB', toBase: 1099511627776 },
      { name: '拍字节', symbol: 'PB', toBase: 1125899906842624 }
    ]
  },
  time: {
    baseUnit: 'second',
    units: [
      { name: '毫秒', symbol: 'ms', toBase: 0.001 },
      { name: '秒', symbol: 's', toBase: 1 },
      { name: '分钟', symbol: 'min', toBase: 60 },
      { name: '小时', symbol: 'h', toBase: 3600 },
      { name: '天', symbol: 'd', toBase: 86400 },
      { name: '周', symbol: 'week', toBase: 604800 },
      { name: '月(30天)', symbol: 'month', toBase: 2592000 },
      { name: '年(365天)', symbol: 'year', toBase: 31536000 }
    ]
  },
  pressure: {
    baseUnit: 'pascal',
    units: [
      { name: '帕斯卡', symbol: 'Pa', toBase: 1 },
      { name: '千帕', symbol: 'kPa', toBase: 1000 },
      { name: '巴', symbol: 'bar', toBase: 100000 },
      { name: '标准大气压', symbol: 'atm', toBase: 101325 },
      { name: '毫米汞柱', symbol: 'mmHg', toBase: 133.322 },
      { name: '磅/平方英寸', symbol: 'psi', toBase: 6894.76 }
    ]
  }
}

function convertTemperature(value: number, from: string, to: string): number {
  // 先转为摄氏度
  let celsius: number
  switch (from) {
    case '°C': celsius = value; break
    case '°F': celsius = (value - 32) * 5 / 9; break
    case 'K': celsius = value - 273.15; break
    default: celsius = value
  }

  // 从摄氏度转目标单位
  switch (to) {
    case '°C': return celsius
    case '°F': return celsius * 9 / 5 + 32
    case 'K': return celsius + 273.15
    default: return celsius
  }
}

export const unitConverterTool: ToolDefinition = {
  id: 'unit-converter',
  name: '单位换算器',
  description: '长度、重量、温度、面积、体积、存储等多种单位互转',
  category: 'calculator',
  icon: 'Calculator',
  tags: ['换算', '单位', '长度', '重量', '温度', '面积'],
  priority: 12,
  options: [
    {
      name: 'category',
      label: '单位类别',
      type: 'select',
      defaultValue: 'length',
      options: [
        { label: '📏 长度', value: 'length' },
        { label: '⚖️ 重量', value: 'weight' },
        { label: '🌡️ 温度', value: 'temperature' },
        { label: '📐 面积', value: 'area' },
        { label: '🥤 体积', value: 'volume' },
        { label: '🚀 速度', value: 'speed' },
        { label: '💾 存储容量', value: 'storage' },
        { label: '⏱️ 时间', value: 'time' },
        { label: '🎈 压强', value: 'pressure' }
      ]
    },
    {
      name: 'fromUnit',
      label: '源单位',
      type: 'select',
      defaultValue: 'm',
      options: [] // 动态填充
    },
    {
      name: 'toUnit',
      label: '目标单位',
      type: 'select',
      defaultValue: 'km',
      options: [] // 动态填充
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      const value = parseFloat(input)
      if (isNaN(value)) {
        return '错误: 请输入有效的数值'
      }

      const category = options?.category || 'length'
      const fromUnit = options?.fromUnit || UNIT_CATEGORIES[category]?.units[0]?.symbol || 'm'
      const toUnit = options?.toUnit || UNIT_CATEGORIES[category]?.units[1]?.symbol || 'km'

      const categoryInfo = UNIT_CATEGORIES[category]
      if (!categoryInfo) {
        return `错误: 未知的单位类别: ${category}`
      }

      let result: number

      if (category === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit)
      } else {
        const fromDef = categoryInfo.units.find(u => u.symbol === fromUnit)
        const toDef = categoryInfo.units.find(u => u.symbol === toUnit)

        if (!fromDef || !toDef) {
          return '错误: 无效的单位选择'
        }

        result = (value / fromDef.toBase) * toDef.toBase
      }

      const fromName = categoryInfo.units.find(u => u.symbol === fromUnit)?.name || fromUnit
      const toName = categoryInfo.units.find(u => u.symbol === toUnit)?.name || toUnit

      const formatted = Number.isInteger(result) ? result : result.toPrecision(10)

      const allConversions = categoryInfo.units.map(unit => {
        let converted: number
        if (category === 'temperature') {
          converted = convertTemperature(value, fromUnit, unit.symbol)
        } else {
          const unitDef = categoryInfo.units.find(u => u.symbol === fromUnit)!
          converted = (value / unitDef.toBase) * unit.toBase
        }
        const convFormatted = Number.isInteger(converted) ? converted : converted.toPrecision(8)
        return `  ${unit.name} (${unit.symbol}): ${convFormatted}`
      })

      return [
        `🔄 单位换算结果`,
        ``,
        `${value} ${fromName} = ${formatted} ${toName}`,
        ``,
        `━━━ 完整换算表 ━━━`,
        ...allConversions
      ].join('\n')
    } catch (error) {
      return `错误: 换算失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: '100',
      options: { category: 'length', fromUnit: 'km', toUnit: 'm' },
      output: '100 km = 100000 m',
      description: '公里转米'
    },
    {
      input: '32',
      options: { category: 'temperature', fromUnit: '°C', toUnit: '°F' },
      output: '摄氏度转华氏度',
      description: '温度换算 - 摄氏度转华氏度'
    },
    {
      input: '1024',
      options: { category: 'storage', fromUnit: 'KB', toUnit: 'MB' },
      output: '存储容量换算',
      description: 'KB 转 MB'
    }
  ]
}
