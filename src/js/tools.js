define(['jquery'], ($) => {
  /**
   * 将查询字符串转换为对象
   * @param {*} qs 查询字符串，格式如：key1=value1&key2=value2
   * @returns 
   */
  $.qsToObj = qs => {
    const obj = {}
    qs.split('&').forEach(item => {
      const parts = item.split('=')
      obj[parts[0]] = parts[1]
    })
    return obj
  }
})
