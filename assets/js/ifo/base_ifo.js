; (function () {
  // 入口函数
  $(function () {
    /* $('.layui-form [name="username"]').val('张三') */

    let form = layui.form
    let layer = layui.layer

    // 初始化表单数据
    function initUserIfo() {
        $.ajax({
          method: 'get',
          url: '/my/userinfo',
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg('获取用户信息失败！')
            }
            // console.log(res)
            // 使用 form.val 快速为表单赋值
            // 会根据第二个参数，为相应 name 的表单域填写内容
            form.val('formUserIfo',res.data)
          }
        })
    }

    // 配置表单验证属性
    form.verify({
      nickname: [
        /^[\S]{6,12}$/
        ,'昵称必须6到12位，且不能出现空格'
      ]
    })

    // 初始化用户信息
    initUserIfo()

    // 提交前重置信息
    $('#btnReset').click(function (e) {
      // 1、阻止表单默认行为
      e.preventDefault()
      // 2、初始化表单
      initUserIfo()
    })

    // 提交用户信息
    $('.layui-form').submit(function (e) {
      // 1、阻止默认行为
      e.preventDefault()
      // console.log($(this).serialize())
      // 2、ajax 请求提交
      $.ajax({
        method: 'post',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('提交用户信息失败！')
          }
          layer.msg('提交用户信息成功！')
          // 3、信息提交成功，就更新欢迎语
          // 因为是父页面的函数,所以
          window.parent.getUserIfo()
        }
      })
    })
  })
}())