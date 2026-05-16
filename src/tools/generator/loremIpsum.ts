/**
 * Lorem Ipsum 占位文本生成器
 * 生成各种长度的占位文本用于设计原型
 */

import type { ToolDefinition, ToolExecuteOptions } from '../types'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
]

const CHINESE_LOREM = [
  '这是一段', '占位文本', '用于', '展示', '页面布局', '效果',
  '在设计阶段', '使用', '可以帮助', '我们', '更好地', '理解',
  '整体', '视觉', '呈现', '实际内容', '将会', '替换', '这些文字',
  '请忽略', '具体含义', '关注', '排版', '样式', '间距', '字体大小'
]

function generateLoremIpsum(type: string, count: number): string {
  if (type === 'chinese') {
    const sentences: string[] = []
    for (let i = 0; i < count; i++) {
      const sentenceLength = Math.floor(Math.random() * 8) + 6
      const words = []
      for (let j = 0; j < sentenceLength; j++) {
        words.push(CHINESE_LOREM[Math.floor(Math.random() * CHINESE_LOREM.length)])
      }
      sentences.push(words.join('') + '。')
    }
    return sentences.join('')
  }

  // 英文 Lorem Ipsum
  if (type === 'paragraphs' || type === 'sentences') {
    const paragraphs: string[] = []
    const paraCount = type === 'paragraphs' ? count : 1

    for (let p = 0; p < paraCount; p++) {
      const sentences: string[] = []
      const sentCount = type === 'paragraphs' ? Math.floor(Math.random() * 4) + 4 : count

      for (let s = 0; s < sentCount; s++) {
        const wordCount = Math.floor(Math.random() * 12) + 8
        const words: string[] = []

        for (let w = 0; w < wordCount; w++) {
          const word = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
          if (word) words.push(word)
        }

        if (words[0]) {
          words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
        }
        sentences.push(words.join(' ') + '.')
      }

      paragraphs.push(sentences.join(' '))
    }

    return paragraphs.join('\n\n')
  }

  // 单词列表
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    const word = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
    if (word) words.push(word)
  }

  if (type === 'words') {
    return words.join(' ')
  }

  // 列表形式
  return words.map((w, i) => `${i + 1}. ${w}`).join('\n')
}

export const loremIpsumTool: ToolDefinition = {
  id: 'lorem-ipsum',
  name: 'Lorem Ipsum 生成器',
  description: '生成占位文本，支持中英文多种格式',
  category: 'generator',
  icon: 'Document',
  tags: ['lorem', '占位文本', '填充', '设计'],
  priority: 5,
  options: [
    {
      name: 'type',
      label: '输出类型',
      type: 'select',
      defaultValue: 'paragraphs',
      options: [
        { label: '段落 (Paragraphs)', value: 'paragraphs' },
        { label: '句子 (Sentences)', value: 'sentences' },
        { label: '单词 (Words)', value: 'words' },
        { label: '列表 (List)', value: 'list' },
        { label: '中文段落', value: 'chinese' }
      ]
    },
    {
      name: 'count',
      label: '数量',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 20
    },
    {
      name: 'startWithLorem',
      label: '以 Lorem ipsum 开头',
      type: 'switch',
      defaultValue: true
    }
  ],
  execute(input: string, options?: ToolExecuteOptions): string {
    try {
      const type = options?.type || 'paragraphs'
      const count = Number(options?.count) || 3

      let result = generateLoremIpsum(type, count)

      // 如果需要以标准开头
      if (options?.startWithLorem !== false && (type === 'paragraphs' || type === 'sentences')) {
        const firstPart = result.split('\n\n')[0]
        if (firstPart) {
          result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
            (type === 'sentences' ? result.split('. ').slice(1).join('. ') :
             firstPart.replace(/^lorem ipsum/i, '') + '\n\n' +
             result.split('\n\n').slice(1).join('\n\n'))
        }
      }

      const wordCount = result.split(/\s+/).length
      const charCount = result.length

      return `${result}\n\n━━━━━━━━━━━━━━━━━━━━\n📊 统计: ${wordCount} 个词, ${charCount} 个字符`
    } catch (error) {
      return `错误: 生成失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: '',
      options: { type: 'paragraphs', count: 2 },
      output: 'Lorem ipsum',
      description: '生成 2 个英文段落'
    },
    {
      input: '',
      options: { type: 'sentences', count: 5 },
      output: 'Lorem ipsum',
      description: '生成 5 个英文句子'
    },
    {
      input: '',
      options: { type: 'words', count: 20 },
      output: 'lorem',
      description: '生成 20 个英文单词'
    },
    {
      input: '',
      options: { type: 'chinese', count: 2 },
      output: '占位文本',
      description: '生成中文段落'
    }
  ]
}
