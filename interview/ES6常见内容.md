# ES6常见内容

- promise
- async/await
- let const
- class
- 箭头函数
- proxy Reflect
- Symbol
- set WeakSet Map weakMap

## weakMap

```js
const obj = { name: 1 }
var b = {
    a:obj
}
obj = null // 会被GC回收吗
// 引用计数
```