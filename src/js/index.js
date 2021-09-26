require(['config'], () => {
  require(['jquery', 'swiper', 'artTemplate', 'include', 'm2top'], ($, Swiper, template) => {
    class IndexPage {
      constructor() {
        this.initSwiper()
        this.loadHotProducts()
        this.loadAllProducts()
        this.bindEventlistener()
      }

      /**
       * 初始化创建 Swiper 对象实例，实现滑块轮播效果
       */
      initSwiper () {
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
            const html = template('slide-template', { slides: banners })
            $('.swiper-wrapper').html(html)
            // 创建 Swiper 对象实例，实现轮播效果
            new Swiper('.swiper-container', {
              loop: true, // 循环模式选项
              autoplay: true,
              speed: 500,
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
      loadHotProducts () {
        $.ajax({
          url: '/store/api/hotproduct_v2/gets?limit=60&offset=0',
          dataType: 'json',
          success (resData) {
            // console.log('成功：', resData)
            // 构建在模板中需要渲染到的数据
            const products = resData.data.hotProduct.map(prod => prod.products)
            // 渲染
            const html = template('hot-template', { products })
            $('.shop_main_all > ul:first').html(html)
          }
        })
      }

      /**
       * 加载所有商品
       */
      loadAllProducts () {
        $.ajax({
          url: '/store/api/allProduct/gets?limit=60&offset=0',
          dataType: 'json',
          success (resData) {
            // console.log('所有：', resData.data.allProduct)
            const html = template('hot-template', { products: resData.data.allProduct })
            $('.shop_main_all > ul:last').html(html)
          }
        })
      }

      bindEventlistener () {
        $(' .login_top_btn span').on('click', e => {
          $('.iphone_login').css({ "display": "none" })
          $('.iphone_signin').css({ "display": "none" })
        })
        $('.iphone_login .login_main_bottom a:eq(1)').on('click', e => {
          e.preventDefault()
          $('.iphone_login').css({ "display": "none" })
          $('.iphone_signin').css({ "display": "block" })
        })
        $('.iphone_signin .login_main_bottom a:eq(0)').on('click', e => {
          e.preventDefault()
          $('.iphone_signin').css({ "display": "none" })
          $('.iphone_login').css({ "display": "block" })
        })
        $('.iphone_login .login_btn a').on('click', e => {
          e.preventDefault()
          const _username = $('.iphone_login #username').val()
          const _password = $('.iphone_login #password').val()
          $.ajax({
            url: 'http://localhost:7600/login.do',
            method: 'POST',
            data: {
              username: _username,
              password: _password
            },
            success: resData => {
              console.log(resData.data)
              console.log('成功：', resData);
              if (resData.data.status == 200) {
                alert('登录成功，欢迎 ' + resData.data.userInfo.nickname)
                $('.iphone_login').css({ "display": "none" })
              }
              if (resData.data.status == 400) {
                alert('登录失败' + resData.data.message)
              }
              $('.shop_top_center_user .login').html(resData.data.userInfo.nickname)
            }
          })
          //登录
        })
        $('.iphone_signin .login_btn a').on('click', e => {
          e.preventDefault()
          console.log('sigin')
          //注册
          const _username = $('.iphone_signin #username').val()
          const _password = $('.iphone_signin #password').val()
          const _nickname = $('.iphone_signin #nickname').val()
          $.ajax({
            url: 'http://localhost:7600/register.do',
            method: 'POST',
            data: {
              username: _username,
              password: _password,
              nickname: _nickname
            },
            success: resData => {
              console.log(resData.data)
              console.log('成功：', resData);
              if (resData.code == 200) {
                alert('注册成功请登录')
              }
              if (resData.code == 400) {
                alert('注册失败')
              }
            }
          })
        })
        $('.iphone_signin .login_username input').on('blur', e => {
          const _username = $(e.target).val()
          $.ajax({
            url: 'http://localhost:7600/exist.do',
            method: 'GET',
            data: {
              username: _username,
            },
            success: resData => {
              if (resData.data.status == 200) {
                console.log('用户名可用')
                $('.iphone_signin .correct').css({ 'display': 'block' })
                $('.iphone_signin .error').css({ 'display': 'none' })
              }
              if (resData.data.status == 400) {
                console.log('用户已存在')
                $('.iphone_signin .error').css({ 'display': 'block' })
                $('.iphone_signin .correct').css({ 'display': 'none' })
              }
            }
          })
        })

        $('#app').on('mousedown', '.login_top', function (e) {
          // console.log($('.iphone_login').width())
          //获取光标
          const _offsetX = e.offsetX, _offsetY = e.offsetY
          // const _offsetLeft = $('.father').offsetLeft, _offsetTop = $('.father').offsetTop

          const _faWidth = window.innerWidth - 20
          const _faHeight = window.innerHeight

          const _soWidth = $('.iphone_login').width()
          const _soHeight = $('.iphone_login').height()

          const move = function (e) {
            console.log('move')
            const X = e.pageX, Y = e.pageY

            let left = X - _offsetX
            let top = Y - _offsetY

            if (left < 0) { left = 0 } else if (left > _faWidth - _soWidth) { left = _faWidth - _soWidth }
            if (top < 0) { top = 0 } else if (top > _faHeight - _soHeight) { top = _faHeight - _soHeight }

            // console.log(_faWidth, _faHeight)
            console.log(_soWidth, _soHeight)
            // console.log(left, top)

            $('.iphone_login').css({ "left": left, "top": top })

          }
          document.addEventListener('mousemove', move, false)

          const up = function () {
            console.log('up')
            document.removeEventListener('mousemove', move, false)
            document.removeEventListener('mouseup', up, false)
          }

          document.addEventListener('mouseup', up, false)
        })
      }
    }

    new IndexPage()
  })
})