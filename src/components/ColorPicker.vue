
<template>
<div class='vue-colorpicker' @click='togglePicker' ref='container'>
  <span class='vue-colorpicker-btn' :style='btnStyle' ref='triggerButton'></span>
  <div class='vue-colorpicker-panel' v-show='showPicker' ref='panel' @click.stop>
    <component :is='pickerType' :modelValue='colors' @update:modelValue='changeColor'></component>
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import Sketch from './vue3-color/Sketch.vue'


export default {
  name: 'vue-colorpicker',
  components: {
    'sketch-picker': Sketch,
  },

  props: {
    modelValue: {
      type: Object,
    },
  },
  emits: ['update:modelValue', 'change'],
  data () {
    return {
      showPicker: false,
      colors: {
        hex: '#FFFFFF',
        a: 1
      },
      colorValue: '#FFFFFF',
    }
  },
  computed: {
    pickerType () {
      return 'sketch-picker';
    },
    isTransparent () {
      return this.colors.a === 0;
    },
    btnStyle () {
      if (this.isTransparent) {
        return {
          background: '#eee',
          backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0, transparent 75%,rgba(0,0,0,.25)0), linear-gradient(45deg, rgba(0,0,0,.25)25%,transparent 0, transparent 75%,rgba(0,0,0,.25)0)',
          backgroundPosition: '0 0, 11px 11px',
          backgroundSize: '22px 22px'
        }
      }
      let {r, g, b, a} = this.colorValue;
      return {
        background: `rgba(${r}, ${g}, ${b}, ${a})`
      }
    },
  },
  watch: {
    modelValue(val, oldVal) {
      if (val !== oldVal) {
        this.updateColorObject(val);
      }
    },
  },

  methods: {
    togglePicker () {
      this.showPicker = !this.showPicker;
      if (this.showPicker) {
        // 延迟添加点击外部监听，避免立即触发
        setTimeout(() => {
          document.addEventListener('click', this.handleClickOutside, true);
        }, 0);
      }
    },
    handleClickOutside (e) {
      const container = this.$refs.container;
      const panel = this.$refs.panel;
      if (container && !container.contains(e.target)) {
        this.showPicker = false;
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    },
    changeColor (data) {
      this.colorValue = data.rgba;
      this.$emit('update:modelValue', this.colorValue);
      this.$emit('change', this.colorValue);
    },
    updateColorObject (color) {
      if (!color) return
      const colorObj = tinycolor(color);
      if (!color || color === 'transparent') {
        this.colors = {
          hex: '#FFFFFF',
          hsl: { h: 0, s: 0, l: 1, a: 0 },
          hsv: { h: 0, s: 0, v: 1, a: 0 },
          rgba: { r: 255, g: 255, b: 255, a: 0 },
          a: 0
        };
      } else {
        this.colors = {
          hex: colorObj.toHexString(),
          hsl: colorObj.toHsl(),
          hsv: colorObj.toHsv(),
          rgba: colorObj.toRgb(),
          a: colorObj.getAlpha()
        };
      }
      this.colorValue = this.colors.rgba;
    }
  },
  mounted () {
    this.updateColorObject(this.modelValue);
  },
  beforeUnmount () {
    document.removeEventListener('click', this.handleClickOutside, true);
  }
}
</script>

<style lang="stylus" scoped>
.vue-colorpicker {
  display: inline-block;
  box-sizing: border-box;
  font-size: 0;
  cursor: pointer;
  position: relative;
  &-btn {
    display: inline-block;
    width: 30px;
    height: 22px;
    border: 1px solid #666;
    background: #FFFFFF;
  }

  .vue-colorpicker-panel {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    margin-left: -8px;
    z-index: 10000;
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 4px;
  }
}
</style>
