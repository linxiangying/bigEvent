; (function () {
  $(function () {
    let form = layui.form
    let layer = layui.layer

    // 自定义密码校验规则
    form.verify({
      // 1、6-12位，不能为空
      pass: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
      ],
      // 2、新密码不能和原密码一样
      psdNew: function (value) {
        if (value === $('[name="oldPwd"]').val()) {
          return '新旧密码不能相同！'
        }
      },
      // 3、确认密码必须和新密码相同
      rePswNew: function (value) {
        if (value !== $('[name="newPwd"]').val()) {
          return '两次密码输入不一致！'
        }
      }
    })

    // 更新密码
    $('.layui-form').submit(function (e) {
      // 1、阻止表单默认行为
      e.preventDefault()
      // 2、发起 ajax 请求
      $.ajax({
        method: 'post',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg(res.message)
          // 3、清空表单
          // 利用 dom 元素方法
          $('.layui-form')[0].reset()
        }
      })
    })
  })
}())