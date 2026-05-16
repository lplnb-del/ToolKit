<template>
  <div class="color-picker-container">
    <!-- 颜色预览和取色器 -->
    <div class="flex items-center gap-4 mb-4">
      <div class="color-preview" :style="{ backgroundColor: currentColor }"></div>
      <div class="flex-1">
        <div class="hex-input">
          <span class="text-sm text-gray-500">HEX</span>
          <el-input v-model="hexValue" size="small" @change="updateFromHex" />
        </div>
      </div>
      <el-tooltip :content="supportsEyeDropper ? '点击取色' : '取色器需要 Chrome/Edge 浏览器'" placement="top">
        <el-button 
          size="small" 
          @click="pickColor"
          :type="supportsEyeDropper ? 'default' : 'info'"
          :disabled="!supportsEyeDropper"
        >
          <el-icon><Brush /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <!-- 饱和度-亮度选择器 -->
    <div class="saturation-picker" ref="saturationRef" @mousedown="startSaturationPick"
      :style="{ backgroundColor: hueColor }">
      <div class="saturation-white"></div>
      <div class="saturation-black"></div>
      <div class="saturation-cursor" :style="{ left: saturationX + '%', top: saturationY + '%' }"></div>
    </div>

    <!-- 色调选择器 -->
    <div class="hue-slider" ref="hueRef" @mousedown="startHuePick">
      <div class="hue-cursor" :style="{ left: hue + '%' }"></div>
    </div>

    <!-- 透明度选择器 -->
    <div class="alpha-slider" ref="alphaRef" @mousedown="startAlphaPick"
      :style="{ background: `linear-gradient(90deg, transparent, ${hexValue})` }">
      <div class="alpha-cursor" :style="{ left: alpha * 100 + '%' }"></div>
    </div>

    <!-- 格式输出 -->
    <div class="color-outputs mt-4">
      <div class="output-row" v-for="format in formats" :key="format.key">
        <span class="label">{{ format.label }}</span>
        <code class="value">{{ format.value }}</code>
        <el-button text size="small" @click="copyValue(format.value)">
          <el-icon><DocumentCopy /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Brush, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Refs
const saturationRef = ref<HTMLElement>()
const hueRef = ref<HTMLElement>()
const alphaRef = ref<HTMLElement>()

// State
const hexValue = ref('#3B82F6')
const hue = ref(217)
const saturation = ref(91)
const lightness = ref(60)
const alpha = ref(1)
const isPicking = ref(false)
const pickTarget = ref<'saturation' | 'hue' | 'alpha' | null>(null)

// Computed
const supportsEyeDropper = computed(() => {
  return 'EyeDropper' in window
})

const currentColor = computed(() => {
  return `hsla(${hue.value}, ${saturation.value}%, ${lightness.value}%, ${alpha.value})`
})

const hueColor = computed(() => {
  return `hsl(${hue.value}, 100%, 50%)`
})

const formats = computed(() => [
  { key: 'hex', label: 'HEX', value: hexValue.value.toUpperCase() },
  { key: 'rgb', label: 'RGB', value: `rgb(${getRgb().r}, ${getRgb().g}, ${getRgb().b})` },
  { key: 'rgba', label: 'RGBA', value: `rgba(${getRgb().r}, ${getRgb().g}, ${getRgb().b}, ${alpha.value})` },
  { key: 'hsl', label: 'HSL', value: `hsl(${Math.round(hue.value)}, ${Math.round(saturation.value)}%, ${Math.round(lightness.value)}%)` },
  { key: 'hsla', label: 'HSLA', value: `hsla(${Math.round(hue.value)}, ${Math.round(saturation.value)}%, ${Math.round(lightness.value)}%, ${alpha.value})` }
])

// Methods
function getRgb() {
  const h = hue.value / 360
  const s = saturation.value / 100
  const l = lightness.value / 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

function hslToHex(h: number, s: number, l: number): string {
  const rgb = { r: 0, g: 0, b: 0 }
  const hNorm = h / 360
  const sNorm = s / 100
  const lNorm = l / 100

  if (sNorm === 0) {
    rgb.r = rgb.g = rgb.b = lNorm
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm
    const p = 2 * lNorm - q
    rgb.r = hue2rgb(p, q, hNorm + 1 / 3)
    rgb.g = hue2rgb(p, q, hNorm)
    rgb.b = hue2rgb(p, q, hNorm - 1 / 3)
  }

  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

const saturationX = computed(() => saturation.value)
const saturationY = computed(() => 100 - lightness.value)

function updateFromHue() {
  hexValue.value = hslToHex(hue.value, saturation.value, lightness.value)
  emit('update:modelValue', hexValue.value)
}

function updateFromSaturation() {
  hexValue.value = hslToHex(hue.value, saturation.value, lightness.value)
  emit('update:modelValue', hexValue.value)
}

function updateFromHex() {
  const hex = hexValue.value.replace('#', '')
  if (hex.length === 6) {
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min

    lightness.value = (max + min) / 2 * 100

    if (d === 0) {
      hue.value = 0
      saturation.value = 0
    } else {
      saturation.value = d / (1 - Math.abs(2 * lightness.value / 100 - 1)) * 100

      if (max === r) {
        hue.value = ((g - b) / d + (g < b ? 6 : 0)) * 60
      } else if (max === g) {
        hue.value = ((b - r) / d + 2) * 60
      } else {
        hue.value = ((r - g) / d + 4) * 60
      }
    }

    emit('update:modelValue', hexValue.value)
  }
}

function startSaturationPick(e: MouseEvent) {
  isPicking.value = true
  pickTarget.value = 'saturation'
  updateSaturation(e)
}

function startHuePick(e: MouseEvent) {
  isPicking.value = true
  pickTarget.value = 'hue'
  updateHue(e)
}

function startAlphaPick(e: MouseEvent) {
  isPicking.value = true
  pickTarget.value = 'alpha'
  updateAlpha(e)
}

function updateSaturation(e: MouseEvent) {
  if (!saturationRef.value) return
  const rect = saturationRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

  saturation.value = x * 100
  lightness.value = 100 - y * 100

  updateFromSaturation()
}

function updateHue(e: MouseEvent) {
  if (!hueRef.value) return
  const rect = hueRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))

  hue.value = x * 360
  updateFromHue()
}

function updateAlpha(e: MouseEvent) {
  if (!alphaRef.value) return
  const rect = alphaRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))

  alpha.value = Math.round(x * 100) / 100
  emit('update:modelValue', currentColor.value)
}

function onMouseMove(e: MouseEvent) {
  if (!isPicking.value) return

  switch (pickTarget.value) {
    case 'saturation':
      updateSaturation(e)
      break
    case 'hue':
      updateHue(e)
      break
    case 'alpha':
      updateAlpha(e)
      break
  }
}

function onMouseUp() {
  isPicking.value = false
  pickTarget.value = null
}

async function pickColor() {
  try {
     
    const eyeDropper = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper()
    const result = await eyeDropper.open()
    hexValue.value = result.sRGBHex.toUpperCase()
    updateFromHex()
    ElMessage.success('取色成功')
  } catch {
    // 用户取消取色
  }
}

function copyValue(value: string) {
  navigator.clipboard.writeText(value)
  ElMessage.success('已复制')
}

// Initialize
onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)

  if (props.modelValue) {
    hexValue.value = props.modelValue
    updateFromHex()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal !== hexValue.value) {
    hexValue.value = newVal
    updateFromHex()
  }
})
</script>

<style scoped>
.color-picker-container {
  padding: 12px;
}

.color-preview {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.hex-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hex-input span {
  width: 40px;
}

.saturation-picker {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 8px;
  cursor: crosshair;
  margin-bottom: 8px;
  overflow: hidden;
}

.saturation-white {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #fff, transparent);
}

.saturation-black {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #000, transparent);
}

.saturation-cursor {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.hue-slider {
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(to right,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  cursor: pointer;
  margin-bottom: 8px;
}

.hue-cursor {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 20px;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.alpha-slider {
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
  background-image: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%);
  background-size: 16px 16px;
}

.alpha-cursor {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 20px;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.color-outputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.output-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #f5f5f5;
  border-radius: 6px;
}

.dark .output-row {
  background: #2d2d2d;
}

.output-row .label {
  width: 50px;
  font-size: 12px;
  color: #666;
}

.dark .output-row .label {
  color: #999;
}

.output-row .value {
  flex: 1;
  font-size: 12px;
  font-family: monospace;
  color: #333;
}

.dark .output-row .value {
  color: #e0e0e0;
}
</style>
