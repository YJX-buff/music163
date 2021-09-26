require(['config'], () => {
  require(['jquery', 'artTemplate', 'cookie', 'include'], ($, template) => {
    class CartPage {
      constructor() {
        this.cart = []
        $.cookie.json = true
        this.loadCart()
        this.render()
        this.bindEventListener()
      }
      loadCart () {
        this.cart = $.cookie('cart') || []
      }
      //页面渲染
      render () {

        const lee = this.cart.filter(e => e.checked === true).length
        $('.check_all').prop('checked', (lee == this.cart.length))
        $(".check_all2").prop('checked', (lee == this.cart.length))

        const html = template('cart-template', { cart: this.cart })
        $('.shop_lines').remove()
        $('.prod_list > .first_line').after(html)
        const total = this.cart.reduce((result, curr) => {
          if (curr.checked) {
            result += curr.amount
            return result
          }
          else {
            return 0
          }
        }, 0)
        const allprice = this.cart.reduce((result, item) => {
          if (item.checked) {
            result += item.price * item.amount
          }
          return result
        }, 0)

        const tal = this.cart.reduce((result, item) => {
          result += item.amount
          return result
        }, 0)

        $('.check_nums_red_show').html(total)
        $('.first_all_prod_nums').html(total)
        $('.shop_top_center_shopcart span').html(tal)
        $('.total').html("¥" + allprice)

        // 件数
        if (allprice < 119) {
          let dif = 119 - allprice
          $('.show').css({ "display": "none" })
          $('.unshow').css({ "display": "inline-block" })
          $('.dif').html(dif)
        } else {
          $('.show').css({ "display": "inline-block" })
          $('.unshow').css({ "display": "none" })
        }

        //修改cookie
        $.cookie('cart', this.cart, { expires: 10 })

        if (this.cart.length == 0) {
          $(".cart-body").css({ "display": "none" })
          $(".empty").css({ "display": "block" })
        }
      }
      //删除
      removeFromCart (e) {
        // console.log(this);

        //DOM操作
        // $(e.target).parents('.shop_lines').remove()

        //数组操作
        const id = $(e.target).parents('.shop_lines').data('id')
        this.cart = this.cart.filter(item => item.id !== id)
        this.render()


      }
      //数量加减
      modifyAmount (e) {

        e.preventDefault()
        // DOM操作


        // const src = $(e.target)
        // const parent = src.parents('.ctrl')
        // const price = Number(parent.prev().children('i').html().slice(1))
        // let amount = Number(parent.find('.amount').val())


        // if (src.is('.add')) {
        //   amount++
        //   parent.find('.minus').css({ "opacity": "1" })
        // } else if (src.is('.minus')) {
        //   if (amount > 1) {
        //     amount--
        //   }
        //   if (amount == 1) {
        //     src.css({ "opacity": "0.3" })
        //   }
        // } else if (src.is('.amount')) {
        //   const _amount = src.val()
        //   if (!/^\+?[1-9][0-9]*$/.test(_amount)) {
        //     alert('格式有误')
        //     amount = 1
        //   } else {
        //     amount = Number(_amount)
        //   }
        // }
        // parent.find('.amount').val(amount)
        // parent.next().children('i').html('¥' + price * amount)

        // 修改数据，重新渲染
        const src = $(e.target)
        const id = src.parents('.shop_lines').data('id')
        this.cart.forEach(item => {
          if (item.id === id) {
            if (src.is('.add')) {
              item.amount += 1
            } else if (src.is('.minus')) {
              if (item.amount > 1) {
                item.amount -= 1
              }
            } else if (src.is('.amount')) {
              // console.log('in')
              const _amount = src.val()
              if (!/^\+?[1-9][0-9]*$/.test(_amount)) {
                alert('格式有误')
              } else {
                item.amount = Number(_amount)
              }
            }
          }
        })
        this.render()
      }
      //全选
      handleCheckall (e) {
        const checked = $(e.target).prop('checked')
        this.cart.forEach(item => item.checked = checked)
        $(".check_all2").prop('checked', checked)
        this.render()
      }
      //全选2
      handleCheckall2 (e) {
        const checked = $(e.target).prop('checked')
        this.cart.forEach(item => item.checked = checked)
        $(".check_all").prop('checked', checked)
        this.render()
      }
      //商品选中
      handleCheckprod (e) {
        const id = $(e.target).parents('.shop_lines').data('id')
        this.cart.forEach(item => {
          if (item.id === id) {
            item.checked = $(e.target).prop('checked')
          }
        })
        this.render()
      }
      //移除选中
      handleRemoveChecked () {
        // console.log('in...')
        $('.check_prod:checked').each((index, dom) => {
          const id = $(dom).parents('.shop_lines').data('id')
          this.cart = this.cart.filter(item => item.id !== id)
        })
        this.render()
      }

      bindEventListener () {
        //删除
        $('.prod_list').on('click', '.del', this.removeFromCart.bind(this))
        //数量加减
        $('.prod_list').on('click', '.minus, .add', this.modifyAmount.bind(this))
        //数量操作
        $('.prod_list').on('blur', '.amount', this.modifyAmount.bind(this))
        //全选
        $('.check_all').on('change', this.handleCheckall.bind(this))
        //全选2
        $('.check_all2').on('change', this.handleCheckall2.bind(this))
        //商品选中
        $('.prod_list').on('change', '.check_prod', this.handleCheckprod.bind(this))
        //删除
        $('.del_checked_prod').on('click', this.handleRemoveChecked.bind(this))

      }
    }
    window.onscroll = function () {
      const top = document.documentElement.scrollTop
      // const cle = document.documentElement.clientHeight
      // const m2h = parseInt($(".m2top").css("height"))
      // const newtop = (cle / 2 - m2h / 2)
      if (top >= 200) {
        // console.log(newtop)
        // $(".m2top").css({ "position": "fixed", "top": newtop })
        $(".unshowdiv").css({ "display": "block" })
      } else {
        console.log("nnnmmm");
        // $(".m2top").css({ "position": "absolute", "top": "674px" })
        $(".unshowdiv").css({ "display": "none" })
      }
    }
    $(".unshowdiv").on("click", () => {
      const step = 50
      const timer = setInterval(() => {
        document.documentElement.scrollTop -= step
        if (document.documentElement.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 10)

    })
    new CartPage()
  })
})