const sch = document.querySelector('.sch')
sch.addEventListener('focus', () => {
  sch.value = ''
}, false)
sch.addEventListener('blur', () => {
  (sch.value == '') ? sch.value = '音乐/视频/电台/用户' : sch.value = sch.value
}, false)