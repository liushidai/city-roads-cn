<template>
  <div class='absolute no-webgl'>
    <h3>{{ $t('nowebgl.title') }}</h3>
    <p>{{ $t('nowebgl.desc1') }}</p>
    <p>{{ $t('nowebgl.desc2Prefix') }}<a href='https://get.webgl.org/'>{{ $t('nowebgl.desc2LinkText') }}</a>{{ $t('nowebgl.desc2Suffix') }}</p>
    <p>{{ $t('nowebgl.desc3') }}</p>
    <img src="https://i.imgur.com/Fbbe5a6.png" alt="demo">
  </div>
</template>
<style lang="stylus" scoped>

.no-webgl {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 8px;

    h3 {
      font-weight: normal;
      font-size: 32px;
      margin: 16px;
    }
    p {
      max-width: 400px;
      margin: 8px 0;
    }
    img {
      width: 100%;
      max-width: 1440px;
    }
}
</style>