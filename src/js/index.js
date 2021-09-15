require(['config'], () => {
  require(['jquery', 'swiper', 'artTemplate', 'include'], ($, Swiper, template) => {
    class IndexPage {
      constructor() {
        this.initSwiper()
        this.loadHotProducts()
        this.loadAllProducts()
      }

      /**
       * 初始化创建 Swiper 对象实例，实现滑块轮播效果
       */
      initSwiper() {
        $.ajax({
          url: '/store/api/product/ipbanner', // 请求资源的地址
          method: 'GET', // 请求方法
          data: { // 向服务端发送的数据
            type: 0
          },
          dataType: 'json', // 预期从服务端返回的数据格式
          success: resData => { // 请求成功时执行的回调函数
            // 获取返回数据中轮播图相关的数组
            const { banners } = resData
            // 渲染模板
            const html = template('slide-template', {slides: banners})
            $('.swiper-wrapper').html(html)
            // 创建 Swiper 对象实例，实现轮播效果
            new Swiper('.swiper-container', {
              loop: true, // 循环模式选项
              
              // 如果需要分页器
              pagination: {
                el: '.swiper-pagination',
                clickable: true
              },
              
              // 如果需要前进后退按钮
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            })
          },
          error: err => { // 请求失败时执行的回调函数
            console.log('失败：', err)
          },
          complete: data => { // 不管成功还是失败都会执行
            // console.log('完成：', data)
          }
        })
      }

      /**
       * 加载编辑推荐商品
       */
      loadHotProducts() {
        $.ajax({
          url: '/store/api/hotproduct_v2/gets?limit=60&offset=0',
          dataType: 'json',
          success(resData) {
            // console.log('成功：', resData)
            // 构建在模板中需要渲染到的数据
            const products = resData.data.hotProduct.map(prod => prod.products)
            // 渲染
            const html = template('hot-template', {products})
            $('.shop_main_all > ul:first').html(html)
          }
        })
      }

      /**
       * 加载所有商品
       */
      loadAllProducts() {
        $.ajax({
          url: '/store/api/allProduct/gets?limit=60&offset=0',
          dataType: 'json',
          success(resData) {
            // console.log('所有：', resData.data.allProduct)
            const html = template('hot-template', {products: resData.data.allProduct})
            $('.shop_main_all > ul:last').html(html)
          }
        })
      }
    }

    new IndexPage()
  })
})
