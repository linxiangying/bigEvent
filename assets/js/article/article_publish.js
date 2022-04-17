; (function () {
  $(function () {
    let layer = layui.layer
    let form = layui.form

    //* 初始化下拉选项框 - 文章类别
    function initSelect() {
      //* 1、发起 ajax 请求
      $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('获取文章分类列表失败！')
          }
          //* 2、获取列表成功就渲染
          let selectHtml = template('tpl-select', res)
          // console.log(selectHtml)
          $('select[name="cate_id"]').html(selectHtml)
          //* 3、得让 layui 的 form 重新渲染，不然不会显示
          form.render()
        }
      })
    }
    initSelect()

    //* 初始化富文本编辑器
    initEditor()

    //* 图片裁剪区域
    //* 1. 初始化图片裁剪器
    var $image = $('#image')
    //* 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    //* 3. 初始化裁剪区域
    $image.cropper(options)
    //* 4. 选择封面按钮上传文件
    $('#chooseImg').click(function () {
      $('#coverFile').click()
    })
    //* 5. 监听 上传文件 按钮的 change 事件
    $('#coverFile').on('change', function (e) {
      console.log(e.target.files)
      // 5.1 拿到用户上传的文件
      let file = e.target.files[0]
      // 5.2 根据选择的文件，创建一个 URL 地址
      var newImgURL = URL.createObjectURL(file)
      // 5.3 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
      $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })

    //* 定义文章状态
    let art_state = '已发布'
    //* 如果点击了 "存为草稿"，就将 art_state 改为 "草稿"
    $('#atrSave2').click(function () {
      art_state = '草稿'
    })
    //* 监听表单的提交事件，实现发布新文章的功能
    $('#formPub').submit(function (e) {
      //* 1、阻止表单默认提交行为
      e.preventDefault()
      //* 2、通过 FormData 获取表单内容
      //* 2.1、获取文字内容
      let fd = new FormData($(this)[0])
      //* 2.2、补充 state 属性
      fd.append('state', art_state)
      //* 2.3、获取图片文件 (注意：获取的是裁剪区域的图片)
      //!错误： let file = $('#coverFile').files[0]
      //!错误： fd.append('cover_img', file)
      $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function (blob) {
          // 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          fd.append('cover_img', blob)
          //* 3、发起 ajax 请求
          publicArt(fd)
        })
    })
    //* 定义 文章提交 函数
    function publicArt(fd) {
      $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        //* 提交的是 ajax 格式的文件，就要添加 contentType 和 processData 的配置对象
        contentTpye: false,
        processData: false,
        success: function (res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg('发布文章失败！')
          }
          layer.msg('发布文章成功！')
          //* 跳转到文章列表页面
          location.href = '../../../article/article_list.html'
        }
      })
    }
  })
}())