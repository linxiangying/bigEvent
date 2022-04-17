; (function () {
  $(function () {
    let layer = layui.layer
    let form = layui.form

    //* 定义模板引擎中 时间 的过滤器
    template.defaults.imports.timeFormat = function (data) {
      let time = new Date(data)
      let y = time.getFullYear()
      let m = padZero(time.getMonth() + 1)
      let d = padZero(time.getDate())
      let hh = padZero(time.getHours())
      let mm = padZero(time.getMinutes())
      let ss = padZero(time.getSeconds())
      return y+'-'+m+'-'+d+''+hh+':'+mm+':'+ss
    }
    //* 定义一位数补零函数
    function padZero(n) {
      return n < 10 ? '0' + n : n
    }

    //* 初始化分类选择框数据（这个函数只在打开页面的时候执行一次）
    function initSelect() {
      //* 1、发起 ajax 请求
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('获取文章分类列表失败！')
          }
          //* 2、渲染选择框
          let selectHtml = template('tpl-select', res)
          // console.log(selectHtml)
          $('select[name="cate_id" ]').html(selectHtml)
          //! layui 的表单没法自动更新渲染，我们要让它更新
          form.render()
        }
      })
    }
    initSelect()

    //* 定义查询参数对象
    let q = {
      pagenum: 1,//默认显示第一页
      pagesize: 2,//默认每页显示两行数据
      cate_id: '',//默认不分类
      state:'',//默认不选状态
    }

    //* 初始化列表数据
    function initList() {
      //* 1、发起 ajax 获取列表数据
      $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('获取文章列表数据失败！')
          }
          // console.log(res.data)
          //* 2、获取数据成功就渲染列表
          // 用 template 模板引擎渲染
          let tbodyHtml = template('tpl-list', res)
          $('tbody').html(tbodyHtml)
          //* 3、渲染分页数据
          renderPage(res.total)
        }
      })
    }
    initList()

    //* 分页功能函数，根据分页渲染列表数据 ( 初始化列表数据的时候调用 )
    function renderPage(total) {
      // console.log('条数总数：'+total)
      layui.use('laypage', function(){
        let laypage = layui.laypage
        //执行一个laypage实例
        laypage.render({
          elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
          count: total, //数据总数，从服务端得到
          limit: q.pagesize,//每页显示条数
          curr: q.pagenum,// 起始页
          layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//自定义排版，顺序和数组顺序一致，[总条目数区域,条目选项区域,上一页区域,分页区域,下一个区域,快捷跳页区域]
          //* 如果定义了 limit ，可是原来设置的默认数目在 limit 的选项中找不到，就会默认显示 limit 选项中的第一个，这时候应该修改 limit 的选项
          limits:[2,3,5,10],
          //* 分页切换时触发该函数
          //* jump回调被触发有三种方式：
          //* 1、切换分页的时候('prev', 'page', 'next', 'skip'都能触发切换分页事件 )
          //* 2、执行 laypage.render 的时候（如果不带参数 first ，就会因为这种方式而带来死循环）
          //* 3、切换 limit 的页数
          jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：
            // console.log('当前页面：'+obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log('页面显示条数：'+obj.limit); //得到每页显示的条数
            //* 更新查询参数对象
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            //* 重新初始化列表数据
            // initList()//!直接调用会死循环
            if (!first) {
              initList()
            }
          }
        });
      });
    }

    //* 为筛选绑定点击事件,即表单的提交事件
    $('#form-screen').submit(function (e) {
      //* 1、阻止表单默认提交行为
      e.preventDefault()
      //* 2、获得 分类 和 状态 的 value 值
      let cate_id = $('select[name="cate_id"]').val()
      let state = $('select[name="state"]').val()
      //* 3、将获得的 value 值更新到 查询参数对象中
      q.cate_id = cate_id
      q.state = state
      //* 4、发起 ajax 请求，重新渲染列表数据
      initList()
      console.log('渲染成功了吗？')
    })

    //* 为删除按钮绑定点击事件
    $('#tbody').on('click', '.del', function () {
      //* 0、判断页面删除按钮的个数（为后面判断做准备）
      let len = $('.del').length
      console.log('点击的时候，当前页面还有'+len+'个删除按钮')
      //* 1、拿到 id
      let id = $(this).attr('data-id')
      // console.log('不管自己写还是系统的，我拿到的id是：'+id)
      //* 2、弹出询问框
      layer.confirm('确认删除吗?', {icon: 3, title:'提示'}, function(index){
        //* 3、点击确认就执行该函数
        //* 3.1 发起 ajax 请求
        $.ajax({
          method: 'get',
          url: '/my/article/delete/' + id,
          success: function (res) {
            // console.log('根据id删除数据ajax请求响应：')
            // console.log(res)
            if (res.status !== 0) {
              return layer.msg('删除文章失败！')
            }
            layer.msg('删除文章成功！')
            //* 3.2 当该页面的数据删完了以后，如果 q.pagenum 并没有发生变化，会导致删完后本页面数据空了，列表不会自动跳转到上一页
            //* 针对 3.2 的 bug ，应该在重新渲染前，判断当前页面数据是否清空了，如果是，就更新 q.pagenum，让其自减 1（当然，q.pagenum 最小值必须为 1）
            if (len === 1) {
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            //* 3.3 重新渲染列表
            initList()
            // console.log('渲染列表成功！')
          }
        })
        //* 3.4 关闭询问框
        layer.close(index)
      });
    })
  })
}())