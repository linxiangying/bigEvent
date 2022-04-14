// 每次执行 $.post() 或 $.get() 或 $.ajax() 的时候，jQuery 其实都在接收了我们的配置参数后，调用了 $.ajaxPrefilter()
$.ajaxPrefilter(function (option) {
  // option 里面传的就是我们传进去的配置参数
  // console.log(option.url)
  option.url = 'http://www.liulongbin.top:3007' + option.url
  // console.log(option.url)
  
})