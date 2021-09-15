require.config({
  baseUrl: '/libs', // 基准路径
  paths: { // 短名称
    jquery: 'jquery/jquery-3.6.0.min',
    artTemplate: 'art-template/template-web',
    swiper: 'swiper/swiper-bundle.min',
    cookie: 'jquery-plugins/jquery.cookie',
    zoom: 'jquery-plugins/jquery.elevatezoom.min',
    include: '/js/include',
    tools: '/js/tools'
  },
  shim: {
    zoom: ['jquery']
  }
})
