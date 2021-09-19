require(['config'], () => {
  require(['jquery', 'artTemplate', 'cookie', 'include'], ($, template) => {
    class CartPage {
      constructor() {
        this.cart = []
        $.cookie.json = true
        this.loadCart()
        this.render()
      }
      loadCart () {
        this.cart = $.cookie('cart') || []
      }
      render () {
        const html = template('cart-template', { cart: this.cart })
        $('.prod_list > .first_line').after(html)
      }
    }
    new CartPage()
  })
})