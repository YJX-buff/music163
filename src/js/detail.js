require(['config'], () => {
  require(['jquery', 'artTemplate', 'include', 'tools', 'zoom'], function($, template) {
    class DetailPage {
      constructor() {
        this.render()
      }

      /**
       * 加载数据，并渲染页面
       */
      render() {
        // 获取在请求查询字符串中的参数 id
        const { id } = $.qsToObj(location.search.slice(1))
        console.log('obj:', id)

        $.ajax({
          url: '/store/api/product/detail',
          data: {
            id
          },
          success: (resData) => {
            console.log('详情：', resData)
            // 渲染模板引擎
            const html = template('detail-template', {detail: resData.product})
            $('main').append(html)

            // 添加放大镜
            this.addZoom()
          }
        })
      }

      /**
       * 添加放大镜效果
       */
      addZoom() {
        $('.left_box img').elevateZoom({
          gallery: 'zoom-gal',
          galleryActiveClass: 'active'
        })
      }
    }

    new DetailPage()
  })
})