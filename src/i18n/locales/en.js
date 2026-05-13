// eslint-disable-next-line
export default {
  site: {
    title: 'city roads',
    description: 'This website renders every single road within a city',
  },
  search: {
    placeholder: 'Enter a city name to start',
    find: 'Find City Bounds',
    download: 'Download Area',
  },
  warning: {
    largeCity: 'Note: Large cities may require 200MB+ of data transfer and may need a powerful device to render.',
  },
  suggestion: {
    select: 'Select boundaries below to download all roads within',
    largeCityNote: 'large cities may require 200MB+ of data transfer and a powerful device',
  },
  noResults: "Didn't find matching cities. Try a different query?",
  noRoads: "Didn't find any roads. Try a different query?",
  error: {
    serverBusy: 'OpenStreetMap servers are busy or temporarily unavailable.',
    serverBusyNote: 'We tried multiple servers but none responded in time. This usually resolves within a few minutes.',
    general: 'Sorry, something went wrong while loading data.',
    retry: 'Retry',
    seeDemo: 'see how it should have worked',
    reportBug: 'report this bug',
  },
  loading: {
    searching: 'Searching cities that match your query...',
    checkingCache: 'Checking cache...',
    connectingOSM: 'Connecting to OpenStreetMap...',
    progress: 'Loaded {percent}% ({loaded} bytes)...',
    progressBytes: 'Loaded {loaded} bytes...',
    switchingServer: 'Trying a different server',
    still: 'Still loading...',
    sorrySlow: 'Sorry it takes so long!',
    cancel: 'cancel',
  },
  app: {
    customize: 'Customize...',
    tryAnother: 'Try another city',
    display: 'Display',
    colors: 'Colors',
    export: 'Export',
    exportImage: {
      title: 'As an image (.png)',
      description: 'Save the current screen as a raster image.',
    },
    exportSVG: {
      title: 'As a vector (.svg)',
      description: 'Save the current screen as a vector image.',
    },
    about: 'About',
    aboutDescPrefix: "This code is based on the open source project by ",
    aboutDescSuffix: ". It downloads roads from OpenStreetMap and renders them with WebGL.",
    dataLicensePrefix: 'data ',
    dataLicenseLinkText: '\u00A9 OpenStreetMap',
  },
  layers: {
    background: 'background',
    labels: 'labels',
  },  nowebgl: {
    title: 'WebGL is not enabled :(',
    desc1: 'This website renders millions of roads at once.',
    desc2Prefix: 'To render this amount of data fast, the website uses ',
    desc2LinkText: 'WebGL',
    desc2Suffix: ', which seem to be not supported by the device that you are using.',
    desc3: 'Please try a different device to play with this website',
  },
};
