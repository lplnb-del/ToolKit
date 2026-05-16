/**
 * HTTP 状态码查询工具
 * 提供完整的 HTTP 状态码说明和常见场景解释
 */

import type { ToolDefinition } from '../types'

interface HttpStatusInfo {
  code: number
  name: string
  category: string
  description: string
  commonCauses: string[]
  solution: string
}

const HTTP_STATUS_CODES: Record<number, HttpStatusInfo> = {
  // 1xx 信息响应
  100: { code: 100, name: 'Continue', category: '信息', description: '服务器已收到请求的初始部分，客户端应继续发送剩余部分', commonCauses: [], solution: '继续发送请求体' },
  101: { code: 101, name: 'Switching Protocols', category: '信息', description: '服务器根据客户端请求切换协议', commonCauses: ['WebSocket 升级'], solution: '正常行为' },

  // 2xx 成功
  200: { code: 200, name: 'OK', category: '成功', description: '请求成功', commonCauses: ['GET/POST 成功返回数据'], solution: '正常处理响应数据' },
  201: { code: 201, name: 'Created', category: '成功', description: '资源创建成功', commonCauses: ['POST 创建新资源'], solution: '从 Location 头获取新资源URL' },
  204: { code: 204, name: 'No Content', category: '成功', description: '请求成功但无返回内容', commonCauses: ['DELETE 操作成功'], solution: '无需处理响应体' },
  206: { code: 206, name: 'Partial Content', category: '成功', description: '部分内容响应（范围请求）', commonCauses: ['视频/大文件分片下载', '断点续传'], solution: '处理部分数据并继续请求' },

  // 3xx 重定向
  301: { code: 301, name: 'Moved Permanently', category: '重定向', description: '资源永久移动到新URL', commonCauses: ['网站改版迁移', 'HTTP 到 HTTPS 跳转'], solution: '使用 Location 头中的新URL' },
  302: { code: 302, name: 'Found', category: '重定向', description: '资源临时移动到新URL', commonCauses: ['登录后跳转', '临时维护页面'], solution: '跟随重定向获取实际内容' },
  304: { code: 304, name: 'Not Modified', category: '重定向', description: '资源未修改，可使用缓存', commonCauses: ['ETag/Last-Modified 未变'], solution: '使用本地缓存数据' },
  307: { code: 307, name: 'Temporary Redirect', category: '重定向', description: '临时重定向（保持请求方法）', commonCauses: ['POST 请求重定向'], solution: '使用相同方法重新请求新URL' },

  // 4xx 客户端错误
  400: { code: 400, name: 'Bad Request', category: '客户端错误', description: '请求语法错误或参数无效', commonCauses: ['JSON 格式错误', '缺少必填参数', '参数类型错误'], solution: '检查请求体格式和参数' },
  401: { code: 401, name: 'Unauthorized', category: '客户端错误', description: '未认证或认证失败', commonCauses: ['Token 过期', '未登录', 'API Key 无效'], solution: '重新登录获取有效凭证' },
  403: { code: 403, name: 'Forbidden', category: '客户端错误', description: '无权限访问该资源', commonCauses: ['权限不足', 'IP 被封禁', '账户被冻结'], solution: '联系管理员申请权限' },
  404: { code: 404, name: 'Not Found', category: '客户端错误', description: '请求的资源不存在', commonCauses: ['URL 错误', '资源已被删除', 'ID 不存在'], solution: '检查 URL 路径和资源 ID' },
  405: { code: 405, name: 'Method Not Allowed', category: '客户端错误', description: '请求方法不被允许', commonCauses: ['用 GET 替代 POST', '用 POST 替代 DELETE'], solution: '检查 Allow 头支持的 HTTP 方法' },
  408: { code: 408, name: 'Request Timeout', category: '客户端错误', description: '请求超时', commonCauses: ['网络延迟', '服务端处理慢', '请求体过大'], solution: '增加超时时间或优化请求' },
  409: { code: 409, name: 'Conflict', category: '客户端错误', description: '请求与当前资源状态冲突', commonCauses: ['并发编辑同一资源', '重复创建唯一资源'], solution: '先 GET 最新状态再操作' },
  413: { code: 413, name: 'Payload Too Large', category: '客户端错误', description: '请求体过大', commonCauses: ['上传文件超过限制', 'JSON 数据太大'], solution: '压缩数据或分片上传' },
  422: { code: 422, name: 'Unprocessable Entity', category: '客户端错误', description: '语义错误，无法处理', commonCauses: ['验证失败', '业务逻辑冲突'], solution: '检查响应体中的具体错误信息' },
  429: { code: 429, name: 'Too Many Requests', category: '客户端错误', description: '请求过于频繁', commonCauses: ['触发速率限制', '爬虫被拦截'], solution: '等待 Retry-After 时间后重试' },

  // 5xx 服务器错误
  500: { code: 500, name: 'Internal Server Error', category: '服务器错误', description: '服务器内部错误', commonCauses: ['代码异常', '数据库连接失败', '依赖服务挂掉'], solution: '联系后端开发查看日志' },
  502: { code: 502, name: 'Bad Gateway', category: '服务器错误', description: '网关/代理从上游收到无效响应', commonCauses: ['后端服务未启动', '负载均衡配置错误'], solution: '检查后端服务运行状态' },
  503: { code: 503, name: 'Service Unavailable', category: '服务器错误', description: '服务暂时不可用', commonCauses: ['服务器过载', '正在维护部署', '数据库连接池满'], solution: '等待 Retry-After 后重试' },
  504: { code: 504, name: 'Gateway Timeout', category: '服务器错误', description: '网关超时', commonCauses: ['后端处理时间过长', '网络拥堵'], solution: '增加网关超时时间或优化后端性能' }
}

export const httpStatusTool: ToolDefinition = {
  id: 'http-status-codes',
  name: 'HTTP 状态码查询',
  description: '查询 HTTP 状态码含义、常见原因和解决方案',
  category: 'network',
  icon: 'Connection',
  tags: ['HTTP', '状态码', 'REST', 'API', 'Web'],
  priority: 8,
  execute(input: string): string {
    try {
      const query = input.trim()

      if (!query) {
        // 显示所有状态码概览
        const categories = Object.values(HTTP_STATUS_CODES).reduce<Record<string, HttpStatusInfo[]>>((acc, status) => {
          if (!acc[status.category]) acc[status.category] = []
          acc[status.category]!.push(status)
          return acc
        }, {})

        let output = '📚 HTTP 状态码速查表\n\n'

        Object.entries(categories).forEach(([category, statuses]) => {
          output += `【${category}】\n`
          statuses.forEach(s => {
            output += `  ${s.code} - ${s.name}: ${s.description}\n`
          })
          output += '\n'
        })

        output += `共收录 ${Object.keys(HTTP_STATUS_CODES).length} 个常用状态码`
        return output
      }

      // 查询特定状态码
      const codes = query.split(/[,\s]+/).map(c => parseInt(c)).filter(c => !isNaN(c) && c >= 100 && c < 600)

      if (codes.length === 0) {
        throw new Error('请输入有效的 HTTP 状态码 (100-599)，多个状态码用逗号分隔')
      }

      const results: string[] = []

      codes.forEach(code => {
        const info = HTTP_STATUS_CODES[code]

        if (info) {
          results.push(
            `━━━ ${code} ${info.name} ━━━\n` +
            `类别: ${info.category}\n` +
            `描述: ${info.description}\n` +
            (info.commonCauses.length > 0 ?
              `常见原因:\n${info.commonCauses.map(c => `  • ${c}`).join('\n')}\n` :
              ''
            ) +
            `解决方法: ${info.solution}`
          )
        } else {
          // 根据状态码范围给出通用说明
          const range =
            code < 200 ? '1xx 信息响应' :
            code < 300 ? '2xx 成功' :
            code < 400 ? '3xx 重定向' :
            code < 500 ? '4xx 客户端错误' :
            '5xx 服务器错误'

          results.push(
            `━━━ ${code} (未知) ━━━\n` +
            `范围: ${range}\n` +
            `说明: 此状态码不在常用列表中\n` +
            `建议: 查看 RFC 7231 规范文档获取详细信息`
          )
        }
      })

      return results.join('\n\n')
    } catch (error) {
      return `错误: 查询失败 - ${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  examples: [
    {
      input: '200',
      output: '200 OK',
      description: '查询 HTTP 200 状态码'
    },
    {
      input: '404',
      output: '404 Not Found',
      description: '查询 HTTP 404 状态码'
    },
    {
      input: '500',
      output: '500 Internal Server Error',
      description: '查询 HTTP 500 状态码'
    },
    {
      input: '',
      output: '状态码速查表',
      description: '查看所有状态码概览'
    }
  ]
}
