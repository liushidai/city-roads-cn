<template>
  <find-place v-if='!placeFound' @loaded='onGridLoaded'></find-place>
  <div id="app">
    <div v-if='placeFound'>
      <div class='controls'>
        <a href="#" class='print-button' @click.prevent='toggleSettings'>{{ $t('app.customize') }}</a>
        <a href="#" class='try-another' @click.prevent='startOver'>{{ $t('app.tryAnother') }}</a>
      </div>
      <div v-if='showSettings' class='print-window'>
        <div class='settings-section'>
          <h3 class='settings-heading'>
            <span class='settings-icon'>🎨</span>
            {{ $t('app.display') }}
          </h3>
          <div class='settings-content'>
            <div class='colors-grid'>
              <div v-for='layer in layers' :key='layer.name' class='color-item'>
                <color-picker v-model='layer.color' @change='layer.changeColor'></color-picker>
                <div class='color-label'>{{layer.name}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class='settings-section'>
          <h3 class='settings-heading'>
            <span class='settings-icon'>💾</span>
            {{ $t('app.export') }}
          </h3>
          <div class='settings-content'>
            <div class='export-grid'>
              <button class='export-btn' @click.prevent='toPNGFile'>
                <span class='export-icon'>🖼️</span>
                <span class='export-title'>{{ $t('app.exportImage.title') }}</span>
                <span class='export-desc'>{{ $t('app.exportImage.description') }}</span>
              </button>
              <button class='export-btn' @click.prevent='toSVGFile'>
                <span class='export-icon'>📐</span>
                <span class='export-title'>{{ $t('app.exportSVG.title') }}</span>
                <span class='export-desc'>{{ $t('app.exportSVG.description') }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class='settings-section settings-section--about'>
          <h3 class='settings-heading'>
            <span class='settings-icon'>ℹ️</span>
            {{ $t('app.about') }}
          </h3>
          <div class='settings-content'>
            <p class='about-text'>
              {{ $t('app.aboutDescPrefix') }}
              <a href='https://github.com/anvaka/city-roads' target='_blank' class='about-link'>@anvaka</a>
              {{ $t('app.aboutDescSuffix') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <editable-label v-if='placeFound' v-model='name' class='city-name' :printable='true' :style='{color: labelColorRGBA}' :overlay-manager='overlayManager'></editable-label>
  <div v-if='placeFound' class='license printable can-drag' :style='{color: labelColorRGBA}'>{{ $t('app.dataLicensePrefix') }}<a href='https://www.openstreetmap.org/about/' target="_blank" :style='{color: labelColorRGBA}'>{{ $t('app.dataLicenseLinkText') }}</a></div>
</template>

<script>
import FindPlace from './components/FindPlace.vue';
import LoadingIcon from './components/LoadingIcon.vue';
import EditableLabel from './components/EditableLabel.vue';
import ColorPicker from './components/ColorPicker.vue';
import createScene from './lib/createScene.js';
import GridLayer from './lib/GridLayer.js';
import appState from './lib/appState.js';
import {getPrintableCanvas, getCanvas} from './lib/saveFile.js';
import config from './config.js';
import './lib/canvas2BlobPolyfill.js';
import bus from './lib/bus.js';
import createOverlayManager from './createOverlayManager.js';
import tinycolor from 'tinycolor2';

class ColorLayer {
  constructor(name, color, callback) {
    this.name = name;
    this.changeColor = callback;
    this.color = color;
  }
}

export default {
  name: 'App',
  components: {
    FindPlace,
    LoadingIcon,
    EditableLabel,
    ColorPicker
  },
  data() {
    return {
      placeFound: false,
      name: '',
      showSettings: false,
      settingsOpen: false,
      labelColor: config.getLabelColor().toRgb(),
      backgroundColor: config.getBackgroundColor().toRgb(),
      layers: []
    }
  },
  computed: {
    labelColorRGBA() {
      return toRGBA(this.labelColor);
    }
  },
  created() {
    bus.on('scene-transform', this.handleSceneTransform);
    bus.on('background-color', this.syncBackground);
    bus.on('line-color', this.syncLineColor);
    this.overlayManager = createOverlayManager();
  },
  beforeUnmount() {
    debugger;
    this.overlayManager.dispose();
    this.dispose();
    bus.off('scene-transform', this.handleSceneTransform);
    bus.off('background-color', this.syncBackground);
    bus.off('line-color', this.syncLineColor);
  },
  methods: {
    dispose() {
      if (this.scene) {
        this.scene.dispose();
        window.scene = null;
      }
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    handleSceneTransform() {
      this.zazzleLink = null;
    },
    onGridLoaded(grid) {
      if (grid.isArea) {
        appState.set('areaId', grid.id);
        appState.unset('osm_id');
        appState.unset('bbox');
      } else if (grid.bboxString) {
        appState.unset('areaId');
        appState.set('osm_id', grid.id);
        appState.set('bbox', grid.bboxString);
      }
      this.placeFound = true;
      this.name = grid.name.split(',')[0];
      let canvas = getCanvas();
      canvas.style.visibility = 'visible';

      this.scene = createScene(canvas);
      this.scene.on('layer-added', this.updateLayers);
      this.scene.on('layer-removed', this.updateLayers);

      window.scene = this.scene;

      let gridLayer = new GridLayer();
      gridLayer.id = 'lines';
      gridLayer.setGrid(grid);
      this.scene.add(gridLayer)
    },

    startOver() {
      appState.unset('areaId');
      appState.unsetPlace();
      appState.unset('q');
      appState.enableCache();

      this.dispose();
      this.placeFound = false;
      this.zazzleLink = null;
      this.showSettings = false;
      this.backgroundColor = config.getBackgroundColor().toRgb();
      this.labelColor = config.getLabelColor().toRgb();

      document.body.style.backgroundColor = config.getBackgroundColor().toRgbString();
      getCanvas().style.visibility = 'hidden';
    },

    toPNGFile(e) {
      scene.saveToPNG(this.name)
    },

    toSVGFile(e) { 
      scene.saveToSVG(this.name)
    },

    updateLayers() {
      // TODO: This method likely doesn't belong here
      let newLayers = [];
      let lastLayer = 0;
      let renderer = this.scene.getRenderer();
      let root = renderer.getRoot();
      root.children.forEach(layer => {
        if (!layer.color) return;
        let name = layer.id;
        if (!name) {
          lastLayer += 1;
          name = this.$t('layers.lines', { number: lastLayer });
        }
        let layerColor = tinycolor.fromRatio(layer.color);
        newLayers.push(new ColorLayer(name, layerColor, newColor => {
          this.zazzleLink = null;
          layer.color = toRatioColor(newColor);
          renderer.renderFrame();
          this.scene.fire('color-change', layer);
        }));
      });

      newLayers.push(
        new ColorLayer(this.$t('layers.background'), this.backgroundColor, this.setBackgroundColor),
        new ColorLayer(this.$t('layers.labels'), this.labelColor, newColor => this.labelColor = newColor)
      );

      this.layers = newLayers;

      function toRatioColor(c) {
        return {r: c.r/0xff, g: c.g/0xff, b: c.b/0xff, a: c.a}
      }
      this.zazzleLink = null;
    },

    syncLineColor() {
      this.updateLayers();
    },

    syncBackground(newBackground) {
      this.backgroundColor = newBackground.toRgb();
      this.updateLayers()
    },
    // TODO: I need two background methods?
    updateBackground() {
      this.setBackgroundColor(this.backgroundColor)
      this.zazzleLink = null;
    },
    setBackgroundColor(c) {
      this.scene.background = c;
      document.body.style.backgroundColor = toRGBA(c);
      this.zazzleLink = null;
    }
  }
}

function toRGBA(c) {
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
}
</script>
<style lang='stylus'>
@import('./vars.styl');

#app {
  margin: 8px;
  max-height: 100vh;
  position: absolute;
  z-index: 1;
  h3 {
    font-weight: normal;
  }
}

.can-drag {
  border: 1px solid transparent;
}

.drag-overlay {
  position: fixed;
  background: transparent;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.overlay-active {
  border: 1px dashed highlight-color;
}
.overlay-active.exclusive {
  border-style: solid;
}

.controls {
  height: auto;
  background: transparent;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: desktop-controls-width;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;

  a {
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    border: 0;
    background: white;
    border-radius: 10px;
    padding: 12px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      font-size: 16px;
      line-height: 1;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08);
      background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
  }

  a.try-another {
    flex: 1;

    &::before {
      content: '🔄';
    }
  }

  a.print-button {
    flex: 1;
    border-right: none;

    &::before {
      content: '⚙️';
    }

    &:focus {
      border: 1px dashed highlight-color;
      outline: none;
    }
  }

}

/* 当设置面板存在时的按钮激活状态（Vue v-if 会在 DOM 中添加/移除元素） */
.controls:has(+ .print-window) .print-button {
  background: linear-gradient(135deg, highlight-color 0%, #f50057 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 64, 129, 0.3);

  &:hover {
    box-shadow: 0 6px 16px rgba(255, 64, 129, 0.4);
    background: linear-gradient(135deg, #ff4081 0%, #e91e63 100%);
  }
}

.col {
    display: flex;
    flex: 1;
    select {
      margin-left: 14px;
    }
  }
.row {
  margin-top: 4px;
  display: flex;
  flex-direction: row;
  min-height: 32px;
}

/* Settings Panel - Color Grid */
.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 12px;
  padding: 4px 0;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.color-label {
  font-size: 11px;
  color: #666;
  margin-top: 6px;
  line-height: 1.3;
  max-width: 100%;
  word-wrap: break-word;
}

/* Export Grid */
.export-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.export-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
    border-color: #2196F3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}

.export-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.export-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.export-desc {
  font-size: 11px;
  color: #888;
  line-height: 1.3;
}

/* About Section */
.about-text {
  font-size: 13px;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #2196F3;
  font-weight: 500;
  text-decoration: none;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(33, 150, 243, 0.08);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(33, 150, 243, 0.15);
    color: #1976D2;
  }

  &::after {
    content: '↗';
    font-size: 10px;
  }
}

a {
  border: 1px solid transparent;
  margin: -1px;
  text-decoration: none;
  color: highlight-color
}
a:focus {
  border: 1px dashed highlight-color;
  outline: none;
}
.print-window {
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-top: 1px solid border-color;
  background: #f8f9fa;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  width: desktop-controls-width;
  padding: 16px;

  /* Card-based sections */
  .settings-section {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    border: 1px solid #f0f0f0;

    &:last-child {
      margin-bottom: 0;
    }

    &--about {
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    }
  }

  .settings-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    text-align: left;
  }

  .settings-icon {
    font-size: 16px;
    line-height: 1;
  }

  .settings-content {
    padding: 0;
  }
}

.message {
  border-top: 1px solid border-color
  border-bottom: 1px solid border-color
  background: #F5F5F5;
}

.preview-actions {
  display: flex;
  padding: 8px 0;
  margin-left: -8px;
  margin-bottom: 14px;
  margin-top: 1px;
  width: desktop-controls-width;
  flex-direction: column;
  align-items: stretch;
  font-size: 14px;
  align-items: center;
  display: flex;

  .popup-help {
    text-align: center;
  }
}

.city-name {
  position: absolute;
  right: 32px;
  bottom: 54px;
  font-size: 24px;
  color: #434343;
  input {
    font-size: 24px;
  }
}

.license {
  text-align: right;
  position: fixed;
  font-family: labels-font;
  right: 32px;
  bottom: 32px;
  font-size: 12px;
  padding-right: 8px;
  a {
    text-decoration: none;
    display: inline-block;
  }
}

.c-2 {
  flex: 2
}

@media (max-width: small-screen) {
  #app {
    width: 100%;
    margin: 0;

    .preview-actions,.error,
    .controls, .print-window {
      width: 100%;
    }
    .loading-container {
      font-size: 12px;
    }

    .controls {
      gap: 8px;
      padding: 10px;

      a {
        font-size: 13px;
        padding: 10px 14px;
        border-radius: 8px;

        &::before {
          font-size: 14px;
        }
      }
    }

    .print-window {
      font-size: 14px;
      padding: 12px;

      .settings-section {
        padding: 14px;
        margin-bottom: 10px;
        border-radius: 10px;
      }

      .settings-heading {
        font-size: 13px;
        margin-bottom: 10px;
        padding-bottom: 8px;
      }

      .colors-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .color-label {
        font-size: 10px;
      }

      .export-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .export-btn {
        padding: 12px;
        flex-direction: row;
        text-align: left;
        gap: 12px;
      }

      .export-icon {
        font-size: 20px;
        margin-bottom: 0;
      }

      .export-title {
        font-size: 12px;
      }

      .export-desc {
        font-size: 10px;
      }
    }

  }
  .city-name  {
    right: 8px;
    bottom: 24px;
  }
  .license  {
    right: 8px;
    bottom: 8px;
  }
}

</style>
