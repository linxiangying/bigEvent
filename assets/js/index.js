// 获取用户信息这个函数，因为后面其他页面要调用，所以得写成全局作用域下的函数，不能被立即执行函数包裹
// 获取用户信息
function getUserIfo() {
  $.ajax({
    method:'get',
    url: '/my/userinfo',
    // 要身份认证，得在请求头中写 Authorization 字段
    /*  headers: {
      authorization:localStorage.getItem('token') || ''
    }, */
    success: function (res) {
      // console.log(res)
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      // console.log(res.data)
      // 调用头像渲染函数
      renderAvatar(res.data)
    },
    // complete 是每次执行完 success 或 error 后，jQuery 都会执行的函数
    /* complete: function (res) {
      console.log(res)
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
    } */
  })
}
// 渲染头像
function renderAvatar(user) {
  // 1、渲染欢迎语
  let name = user.nickname || user.username
  $('.welcome').html(`
  欢迎&nbsp;&nbsp;${name}
  `)
  // 2、渲染头像
  // console.log(user.user_pic)
  // console.log(name)
  if (!user.user_pic) {
    // console.log(name[0])
    let username = name[0].toUpperCase()
    // 2.1 用户如果没有传入图片
    $('.avatar_test').html(username).show()
    $('.layui-nav-img').hide()
  }
  else {
    // 2.2 用户传入图片
    $('.avatar_test').hide()
    $('.layui-nav-img').attr('src',user.user_pic)
  }
}

// 下面开始立即执行函数
; (function () {
  // 入口函数
  $(function () {
    // 页面打开就调用 获取用户信息 函数
    getUserIfo()

    // 退出功能
    $('#logout').click(function () {
      // console.log('ok')
      let layer = layui.layer
      layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function (index) {
        // 点击“确定”就执行的回调函数（点击取消不会执行任何事情，只会退出询问框）
        // 1、清除本地存储
        localStorage.removeItem('token')
        // 2、返回到登录框
        location.href = '../../login.html'
        // 3、退出询问框
        layer.close(index);
      });
    })

  })
}())