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
        // const total = this.cart.reduce((result, curr) => {
        //   result += curr.amount
        //   return result
        // }, 0)
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
          // console.log('属性：', this.detail.skus[0].attrs[0].attrValue + ' ' + ((this.detail.skus[0].attrs[1]) == undefined ? '' : (this.detail.skus[0].attrs[1].attrValue)))
          const currentProduct = {
            id: this.detail.id,
            title: this.detail.name,
            price: this.detail.skus[0].spePrice,
            // image: 'http://' + this.detail.skus[0].picUrl.slice(0, 64),
            image: this.detail.picUrls[0],
            style: this.detail.skus[0].attrs[0].attrValue + ' ' + ((this.detail.skus[0].attrs[1]) == undefined ? '' : (this.detail.skus[0].attrs[1].attrValue)),
            amount: Number($('.num_op span input').val()),
            checked: true
          }

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
          $('.m2top-nums').html(total)

          // fly
          // $('.flybox').css("display", "block")

          // $('.flybox').css("left", "442px")
          // $('.flybox').css("top", "-80px")

        })



        $('main').on('click', '.minus, .add', function (e) {
          e.preventDefault()

          const src = $(e.target)
          const parent = src.parents('.num_op')
          // console.log(parent.find('.amount').val())
          let amount = Number(parent.find('.amount').val())
          if (src.is('.add')) {
            amount++
            parent.find('.minus').css({ "opacity": "1" })
          } else if (src.is('.minus')) {
            if (amount > 1) {
              amount--
            }
            if (amount == 1) {
              src.css({ "opacity": "0.3" })
            }
          } else if (src.is('.amount')) {
            const _amount = src.val()
            if (!/^\+?[1-9][0-9]*$/.test(_amount)) {
              alert('格式有误')
              amount = 1
            } else {
              amount = Number(_amount)
            }
          }
          parent.find('.amount').val(amount)
        })

        window.onscroll = function () {
          const top = document.documentElement.scrollTop
          // const cle = document.documentElement.clientHeight
          // const m2h = parseInt($(".m2top").css("height"))
          // const newtop = (cle / 2 - m2h / 2)
          if (top >= 200) {
            // console.log(newtop)
            // $(".m2top").css({ "position": "fixed", "top": newtop })
            $(".unshow").css({ "display": "block" })
          } else {
            console.log("nnnmmm");
            // $(".m2top").css({ "position": "absolute", "top": "674px" })
            $(".unshow").css({ "display": "none" })
          }
        }
        $(".unshow").on("click", () => {
          const step = 10
          const timer = setInterval(() => {
            document.documentElement.scrollTop -= step
            if (document.documentElement.scrollTop === 0) {
              clearInterval(timer)
            }
          }, 10)

        })
      }
    }

    new DetailPage()
  })
})


