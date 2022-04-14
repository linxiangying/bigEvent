// 立即执行函数
; (function () {
  // 入口函数
  $(function () {
    // 点击“去注册账号”切换注册界面
    $('#link_reg').click(function () {
      $('.login').hide()
      $('.reg').show()
    })
    // 点击“去登录”切换登录界面
    $('#link_login').click(function () {
      $('.login').show()
      $('.reg').hide()
    })
    // 自定义校验规则
    let form = layui.form
    form.verify({
      // 方式一：数组
      // 密码
      pwd:[
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
      ],
      // 方式二：方法
      // 再次输入密码
      rePwd: function (value) {
        // 属性选择器
        let rePwdVal = $('.reg input[name="password"]').val()
        if(value !== rePwdVal) {
          return '两次密码输入不一致！';
        }
      }
    })
    // 注册表单ajax请求
    $('#form_reg').on('submit', function (e) {
      // 1、阻止表单提交
      e.preventDefault()
      // 2、post请求
      $.ajax({
        method:'post',
        url: '/api/reguser',
        data: {
          username: $('#form_reg [name="username"]').val(),
          password:$('#form_reg [name="password"]').val()
        },
        success: function (res) {
          // res.status === 0 就是接收 ajax 响应成功
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg('注册成功，请登录！')
          // 触发 link_login 的点击事件
          $('#link_login').click()
        }
      })
    })
    // 登录表单的ajax请求
    $('#form_login').submit(function (e) {
      e.preventDefault()
      $.post('/api/login', $(this).serialize(), function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        localStorage.setItem('token',res.token)
        location.href = '../../index.html'
      })
    })
  })
}())