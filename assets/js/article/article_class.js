; (function () {
  $(function () {
    let layer = layui.layer
    let indexAdd = null
    let indexEdit = null
    let form = layui.form

    //* 初始化文章列表 函数
    function initList() {
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('更新文章列表失败！')
          }
          let tbodyHtml = template('tpl-tbody', res)
          $('tbody').html(tbodyHtml)
          // layer.msg('更新文章列表成功！')
        }
      })
    }

    // 初始化文章列表
    initList()

    //* 为 “添加类别” 按钮绑定点击事件
    $('#addClass').click(function () {
        indexAdd = layer.open({
        type: 1,//信息框，没有默认的确定按钮
        title: '添加文章分类',//标题
        area: ['500px', '250px'],//设置宽高
        resize:false,//不允许拉伸
        content: $('#dialog-add').html(),//! content的内容是字符串，而这里获得的html内容就是字符串
      });
    })

    //* 为 “添加类别” 的 “确认添加” 绑定点击事件
    //! 因为 “确认添加” 所在 form 是 “添加类别” 的点击事件发生后才添加的，所以无法直接找到该 DOM 对象，需要用代理的方式找到
    $('body').on('click', '#confirmAdd', function (e) {
      //* 1、阻止默认行为
      e.preventDefault()
      // console.log('ok')
      //* 2、发起 ajax 请求 传数据
      $.ajax({
        method: 'post',
        url: '/my/article/addcates',
        data: $('#form-add').serialize(),
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('添加文章类别失败！')
          }
          //* 3、服务器响应成功就重新渲染表单
          initList()
          layer.msg('添加文章类别成功！')
          //* 4、关闭弹出层
          layer.close(indexAdd)
        }
      })
    })

    //* 为 “编辑” 绑定点击事件
    //! 因为是模板引擎渲染出来的，且有很多个编辑，所以要用代理的方式
    $('tbody').on('click', '#edit', function () {
      // 1、弹出信息框
      indexEdit = layer.open({
        type: 1,//信息框，没有默认的确定按钮
        title: '修改文章分类',//标题
        area: ['500px', '250px'],//设置宽高
        resize:false,//不允许拉伸
        content: $('#dialog-edit').html(),//! content的内容是字符串，而这里获得的html内容就是字符串
      });
      // 2、渲染弹出框内容
      let id = $(this).attr('data-id')
      $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,//接口文档中的冒号 ：要去掉
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('获取文章分类数据失败！')
          }
          // 一次性全部渲染
          form.val("form-edit",res.data)
        }
      })
    })

    //* 为 “编辑” 弹出框的 “确认修改” 绑定点击事件
    $('body').on('click', '#confirmEdit', function (e) {
      // 1、阻止默认行为发生
      e.preventDefault()
      // 2、发起 ajax 请求，更新服务器的数据
      $.ajax({
        method: 'post',
        url: '/my/article/updatecate',
        data: $('#form-edit').serialize(),
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('更新文章分类信息失败！')
          }
          // 3、更新信息成功弹出提示框
          layer.msg('更新文章分类信息成功！')
          // 4、重新渲染标文章列表
          initList()
          // 5、关闭弹出层
          layer.close(indexEdit)
        }
      })
    })

    //* 为 “删除” 绑定点击事件
    $('tbody').on('click', '#del', function () {
      //* 1、获取本行数据的 id
      let id = $(this).attr('data-id')
      //* 2、弹出询问框
      // 点击询问框中的 取消 是会 退出函数+关闭询问框
      // 点击询问框中的 确定 是会 执行回调函数
      layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
        //* 3、点击确定就发起 ajax 请求
        $.ajax({
          method: 'get',
          url: '/my/article/deletecate/' + id,
          success: function (res) {
            console.log(res)
            if (res.status !== 0) {
              return layer.msg('删除文章分类失败！')
            }
            //* 4、请求完毕重新初始化表单
            layer.msg('删除文章分类成功！')
            initList()
          }
        })
        //* 5、执行完毕关闭询问框
        layer.close(index)
      })
    })
  })
}())