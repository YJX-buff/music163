require(['config'], () => {
  require(['jquery', 'artTemplate', 'include', 'tools', 'zoom', 'cookie'], function ($, template) {
    class DetailPage {
      constructor() {
        this.detail = {}
        this.render()
        this.bindEventListener()
        $.cookie.json = true//设置cookie保存自动转换数据格式
      }

      /**
       * 加载数据，并渲染页面
       */
      render () {
        // 获取在请求查询字符串中的参数 id
        const { id } = $.qsToObj(location.search.slice(1))
        // console.log('obj:', id)

        $.ajax({
          url: '/store/api/product/detail',
          data: {
            id
          },
          success: (resData) => {
            // console.log('详情：', resData)
            this.detail = resData.product
            // 渲染模板引擎
            const html = template('detail-template', { detail: resData.product })
            $('main').append(html)


            // 添加放大镜
            this.addZoom()
          }
        })
      }

      /**
       * 添加放大镜效果
       */
      addZoom () {
        $('.left_box img').elevateZoom({
          gallery: 'zoom-gal',
          galleryActiveClass: 'active'
        })
      }

      bindEventListener () {
        $('main').on('click', '.btn_buy a:eq(1)', e => {
          e.preventDefault()
          console.log('详情：', this.detail)
          const currentProduct = {
            id: this.detail.id,
            title: this.detail.name,
            price: this.detail.skus[0].spePrice,
            image: 'http://' + this.detail.skus[0].picUrl.slice(0, 64),
            amount: Number($('.num_op span input').val()),
            checked: true
          }
          // console.log('当前选购商品:', currentProduct)

          const cart = $.cookie('cart') || []

          //判断是否是想同id
          const has = cart.some(item => item.id === currentProduct.id)
          if (has) {
            for (let i = 0, len = cart.length; i < len; i++) {
              if (cart[i].id === currentProduct.id) {
                cart[i].amount += currentProduct.amount
                break
              }
            }
          } else {
            //保存到购物车
            cart.push(currentProduct)
          }
          //将数组的内容保存到cookie中
          $.cookie('cart', cart, { expires: 10 })

          //显示购物车中商品数量
          const total = cart.reduce((result, curr) => result + curr.amount, 0)
          $('.shop_top_center_shopcart span').html(total)
        })
      }
    }

    new DetailPage()
  })
})