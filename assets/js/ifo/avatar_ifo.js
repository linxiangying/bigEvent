; (function () {
  $(function () {
    let layer = layui.layer

    // cropper 提供的 js
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
      // 纵横比
      aspectRatio: 1,
      // 指定预览区域
      preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 文件上传
    $('#uploadImg').click(function () {
      $('#file').click()
    })

    // 【本地】替换图片,利用change事件（文件上传了，那么文件上传按钮的内容就有发生变化，所以可以利用这个事件）
    $('#file').on('change', function (e) {
      // 1、判断是否传入文件
      // 方法 A：利用 file 的 dom 属性 files
      // console.log($(this)[0].files)
      /* if ($(this)[0].files.length !== 1) {
        return layer.msg('请重新上传图片！')
      } */
      // 方法 B：利用事件对象的 target 属性中的 files
      console.log(e.target.files)
      if (e.target.files.length !== 1) {
        return layer.msg('请重新上传图片')
      }

      // 2、拿到文件
      let imgFile = e.target.files[0]

      // 3、给文件创建的 url 地址
      let url = URL.createObjectURL(imgFile)

      // 4、图片替换
      $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', url) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    })

    // 上传图片
    $('#uploadConfirm').click(function () {
      // 1、获取裁剪过后的头像
      var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
      // 2、发起 ajax 请求
      $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
          // 直接上传 base64 的图片，可以减少图片不必要的上传事件
          avatar: dataURL
        },
        success: function (res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg('更换头像失败！')
          }
          layer.msg('更换头像成功！')
          window.parent.getUserIfo()
        }
      })
    })
  })
}())