define(['jquery'], ($) => {
  $('<aside>').load('/includes/m2top.html', () => {

    window.onscroll = function () {
      const top = document.documentElement.scrollTop
      const cle = document.documentElement.clientHeight
      const m2h = parseInt($(".m2top").css("height"))
      const newtop = (cle / 2 - m2h / 2)
      if (top >= (674 - newtop)) {
        // console.log(newtop)
        $(".m2top").css({ "position": "fixed", "top": newtop })
        $(".unshow").css({ "display": "block" })
      } else {
        // console.log("nnnmmm");
        $(".m2top").css({ "position": "absolute", "top": "674px" })
        $(".unshow").css({ "display": "none" })
      }
    }
    $(".unshow").on("click", () => {
      const step = 100
      const timer = setInterval(() => {
        document.documentElement.scrollTop -= step
        if (document.documentElement.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 10)
    })
  }).prependTo('body')
})


