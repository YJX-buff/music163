/* 定义模块，用于复用页面的头部与尾部 */
define(['jquery', 'artTemplate', 'cookie'], ($, template) => {
  $('<header >').load('/includes/header.html', () => {
    // 为搜索框绑定事件
    $('.shop_top_center_search input').on('focus', e => {
      // 提示内容显示
      $('.suggest').show()
      // ajax 请求接口数据
      $.getJSON(
        '/store/api/searchsuggest/get',
        resData => {
          // 利用模板引擎渲染响应数据
          const html = template('suggest-template', { suggests: resData.data.configKey })
          $('.suggest').html(html)
        })

      // 请求接口数据
      // $.getJSON('https://music.163.com/store/api/searchsuggest/get', data => console.log('成功：', data))
      // $.getJSON('/mock/suggest.json', data => console.log('成功：', data))
      // $.getJSON('http://rap2api.taobao.org/app/mock/290725/store/api/searchsuggest/get',
      //   data => console.log("接口：", data)
      // )
      // $.getJSON('/store/api/product/ipbanner?type=0', data => console.log(data))
    }).on('blur', () => {
      // 提示内容隐藏
      $('.suggest').hide()
    })
    //获取购物车商品数量
    $.cookie.json = true
    const total = ($.cookie('cart') || []).reduce((result, curr) => result + curr.amount, 0)
    $('.shop_top_center_shopcart span').html(total)
    // $('.m2top-nums').html(total)
    // console.log(total)
    // console.log($('.m2top-nums'))


    $('.login').on('click', e => {
      // console.log('in')
      $('.iphone_login').css({ "display": "block" })
    })
  }).prependTo('body')
  $('<footer>').load('/includes/footer.html').appendTo('body')
})
