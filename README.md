# ToolKit - Online Toolkit

English | [简体中文](./README_zh.md)

A pure static online toolkit website designed for developers and office workers. All tools run locally in the browser without a backend server, ensuring your data privacy and security.

## ✨ Features

- 🔒 **Privacy First** - All data processing happens locally, never uploaded to servers
- ⚡ **Instant Use** - No registration or login required, just open and use
- 🌈 **Beautiful UI** - Built with Vue 3 + Element Plus for a modern experience
- 📱 **Responsive Design** - Perfectly adapts to desktop and mobile devices
- 🌓 **Dark Mode** - Supports automatic light/dark theme switching
- 🔍 **Tool Search** - Search by name, description, or tags
- ⭐ **Favorites** - Save your frequently used tools
- 📜 **History** - Automatically saves operation history

## 🛠️ Tool Categories

Currently includes **35+ tools** across 9 categories:

### 🔐 Encoding & Encryption
- Base64 Encoding/Decoding
- URL Encoding/Decoding
- Hash Calculator (MD5, SHA1, SHA256, SHA512)
- AES Encryption/Decryption
- Morse Code
- Base32/Base58 Encoding
- ROT13/ROT47 Cipher

### 💻 Developer Tools
- JSON Format/Minify
- Timestamp Converter
- UUID Generator
- Random Password Generator
- Base Converter
- Regex Tester
- Cron Expression Parser

### 🎨 CSS Design
- Color Format Converter (HEX, RGB, HSL, HSB)
- CSS Gradient Generator
- Color Picker
- Box Shadow Generator
- Border Radius Generator

### ✨ Generators
- QR Code Generator (Text, URL, WiFi, Email, vCard, etc.)
- Lorem Ipsum Text Generator

### 🖼️ Image Tools
- Image Compressor
- QR Code Reader
- Image to Base64

### 📝 Formatters
- HTML Formatter/Minifier
- Code Formatter

### 📊 Data Processing
- CSV/JSON Converter
- Text Processor (Case, Sort, Dedupe, Line Numbers)
- Data Validator (Email, Phone, ID, IP, URL, etc.)

### 🌐 Network Tools
- URL Parser
- HTTP Status Code Lookup

### 🔢 Calculators
- Timezone Converter
- Unit Converter (Length, Weight, Temperature, Area, Speed, Time)
- Date Calculator

## 🚀 Quick Start

### Requirements

- Node.js >= 20.19.0
- pnpm >= 8.0.0 (recommended) or npm >= 10.0.0

### Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Development

```bash
# Start dev server
pnpm dev

# Or
npm run dev
```

Visit http://localhost:5173 to see the project.

### Build for Production

```bash
# Build project
pnpm build

# Preview production build
pnpm preview
```

### Code Quality

```bash
# Run all checks
pnpm lint

# TypeScript type checking
pnpm type-check

# Format code
pnpm format
```

## 📁 Project Structure

```
toolkit/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Common components
│   │   └── common/       # Shared components
│   ├── composables/      # Composables
│   ├── layouts/          # Layout components
│   ├── router/           # Router configuration
│   ├── stores/           # Pinia stores
│   ├── tools/            # Tool definitions
│   └── views/            # Page views
├── public/               # Public assets
├── docs/                 # Project documentation
├── index.html
├── vite.config.ts        # Vite configuration
├── uno.config.ts         # UnoCSS configuration
├── package.json
└── tsconfig.json         # TypeScript configuration
```

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Next Generation Frontend Tooling
- **Vue Router** - Official Router for Vue.js
- **Pinia** - State Management for Vue.js
- **Element Plus** - A Vue 3 UI Library
- **UnoCSS** - The instant on-demand atomic CSS engine
- **VueUse** - Vue Composition Utilities

## 📝 Adding New Tools

### 1. Create Tool File

Create a new tool file in `src/tools/<category>/`, for example `src/tools/encoder/myTool.ts`:

```typescript
import type { ToolDefinition } from '../types'

export const myToolTool: ToolDefinition = {
  id: 'my-tool',
  name: 'My Tool',
  description: 'Tool description',
  category: 'encoder',
  icon: 'Tools',
  tags: ['tag1', 'tag2'],
  priority: 10,
  options: [
    {
      name: 'optionName',
      label: 'Option Label',
      type: 'select',
      defaultValue: 'value1',
      options: [
        { label: 'Option 1', value: 'value1' },
        { label: 'Option 2', value: 'value2' }
      ]
    }
  ],
  execute: (input: string, options) => {
    // Tool logic
    return `Result: ${input}`
  },
  examples: [
    {
      input: 'example input',
      output: 'example output',
      description: 'Example description',
      options: { optionName: 'value1' }
    }
  ]
}
```

### 2. Register Tool

Export from the category's `index.ts`:

```typescript
export { myToolTool } from './myTool'
```

Then import and register in `src/tools/index.ts`:

```typescript
import { myToolTool } from './encoder'

// In initTools() function
registerTool(myToolTool)
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 📄 License

MIT License

## 🙏 Acknowledgements

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Element Plus](https://element-plus.org/) - A Vue 3 UI Library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [UnoCSS](https://unocss.dev/) - The instant on-demand atomic CSS engine
