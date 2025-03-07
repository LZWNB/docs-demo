# jQuery

## 选择器引擎
```js:line-numbers
// 1. 基础选择器
$('#header')          // ID选择器
$('.menu-item')       // 类选择器
$('div')              // 标签选择器

// 2. 组合选择器
$('ul.nav > li')      // 子元素
$('input[type="text"]') // 属性选择器

// 3. 筛选方法
$('li').first()       // 第一个元素
$('tr').eq(3)         // 第四个tr
$('div').filter('.active') // 过滤
```

## DOM操作示例
- 增删改查示例：

```js:line-numbers
// 创建元素
const $newDiv = $('<div>', {
  class: 'message',
  text: 'Hello World'
})

// 插入元素
$('#container').append($newDiv)  // 内部末尾
$('h1').before('<hr>')          // 前面插入

// 修改属性
$('#logo').attr('src', 'new.png')
$('input').prop('checked', true)

// 删除元素
$('.obsolete').remove() 

// 经典链式调用
$('#todoList')
  .find('li')
  .addClass('pending')
  .end()
  .append('<li>New Item</li>')
```

## 事件处理
```js:line-numbers
// 1. 基础绑定
$('#btn').click(function() {
  console.log($(this).text())
})

// 2. 事件委托（动态元素）
$('#list').on('click', '.item', function() {
  $(this).toggleClass('active')
})

// 3. 自定义事件
$('#widget').trigger('refresh')

// 4. 一次性事件
$('#init').one('click', initApp)
```

## AJAX
```js:line-numbers
// GET请求
$.get('/api/data', { page: 2 }, function(res) {
  renderTable(res.data)
})

// POST表单提交
$.post('/submit', $('#form').serialize())

// 完整配置
$.ajax({
  url: '/upload',
  method: 'PUT',
  data: JSON.stringify(payload),
  contentType: 'application/json',
  success: () => alert('保存成功'),
  error: xhr => console.error(xhr.status)
})
```

## 工具方法
```js:line-numbers
// 类型判断
$.isArray(obj)  
$.isFunction(callback)

// 数组操作
$.each(arr, (index, value) => {})
$.grep(arr, item => item > 10) // 过滤

// 对象扩展
const settings = $.extend({}, defaults, options)

// 数据缓存
$('#elem').data('timestamp', Date.now())
```


