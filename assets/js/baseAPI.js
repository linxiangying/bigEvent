// 每次执行 $.post() 或 $.get() 或 $.ajax() 的时候，jQuery 其实都在接收了我们的配置参数后，调用了 $.ajaxPrefilter()
$.ajaxPrefilter(function (option) {
  // option 里面传的就是我们传进去的配置参数

  // 设置统一根路径
  // console.log(option.url)
  option.url = 'http://www.liulongbin.top:3007' + option.url
  // console.log(option.url)

  // 设置统一请求头
  if (option.url.indexOf('/my/') !== -1) {
    option.headers = {
      authorization:localStorage.getItem('token') || ''
    }
  }

  // 统一挂载 complete 配置对象
  // ( 因为该网页所有ajax请求，请求失败的时候的返回数据都是一样的，所以可以统一设置 )
  // complete 是每次执行完 success 或 error 后，jQuery 都会执行的函数
  option.complete = function (res) {
    // console.log(res)
      // 获取用户信息失败时
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // console.log('访问受限')
        // 1、强制清空本地存储 token
        // console.log('1、强制清空本地存储 token')
        localStorage.removeItem('token')
        // 2、强制退出登录
        // console.log('2、强制退出登录')
        location.href='../../login.html'
      }
  }
})