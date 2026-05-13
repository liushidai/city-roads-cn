// eslint-disable-next-line
export default {
  site: {
    title: '城市道路',
    description: '本网站可渲染一座城市内的所有道路',
  },
  search: {
    placeholder: '输入城市名称开始搜索',
    find: '查找区域',
    download: '下载该区域',
  },
  warning: {
    largeCity: '注意：大城市可能需要 200MB 以上的数据传输和性能较好的设备。',
  },
  suggestion: {
    select: '选择下方区域边界，以下载该区域内的所有道路',
    largeCityNote: '大城市可能需要 200MB 以上的数据传输和高性能设备',
  },
  noResults: '没有找到匹配的城市，试试其他搜索词？',
  noRoads: '没有找到任何道路，试试其他搜索词？',
  error: {
    serverBusy: 'OpenStreetMap 服务器繁忙或暂时不可用。',
    serverBusyNote: '我们尝试了多个服务器，但都没有及时响应。通常几分钟内会恢复。',
    general: '抱歉，加载数据时出了点问题。',
    retry: '重试',
    seeDemo: '查看本应正常工作的效果',
    reportBug: '报告此问题',
  },
  loading: {
    searching: '正在搜索匹配的城市...',
    checkingCache: '正在检查缓存...',
    connectingOSM: '正在连接 OpenStreetMap...',
    progress: '已加载 {percent}%（{loaded} 字节）...',
    progressBytes: '已加载 {loaded} 字节...',
    switchingServer: '正在尝试其他服务器',
    still: '仍在加载中...',
    sorrySlow: '抱歉加载这么慢！',
    cancel: '取消',
  },
  app: {
    customize: '个性化设置...',
    tryAnother: '更换城市',
    display: '显示',
    colors: '颜色',
    export: '导出',
    exportImage: {
      title: '导出为图片 (.png)',
      description: '将当前屏幕保存为位图图像。',
    },
    exportSVG: {
      title: '导出为矢量图 (.svg)',
      description: '将当前屏幕保存为矢量图像。',
    },
    about: '关于',
    aboutDescPrefix: "本站代码源自 ",
    aboutDescSuffix: " 的开源项目，在此基础上进行了优化。它从 OpenStreetMap 下载道路数据并使用 WebGL 渲染。",
    dataLicensePrefix: '数据 ',
    dataLicenseLinkText: '\u00A9 OpenStreetMap',
  },
  layers: {
    background: '背景',
    labels: '文字',
    lines: '线条 {number}',
  },  nowebgl: {
    title: '未启用 WebGL :(',
    desc1: '本网站会渲染数百万条道路。',
    desc2Prefix: '为了快速渲染大量数据，网站使用了 ',
    desc2LinkText: 'WebGL',
    desc2Suffix: '，而您当前使用的设备似乎不支持该功能。',
    desc3: '请尝试使用其他设备来体验本网站',
  },
};
