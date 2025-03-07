# proxy

## 什么是Proxy？它的主要用途是什么？
- JavaScript的Proxy对象用于定义基本操作（如属性查找、赋值、枚举、函数调用等）的自定义行为。它允许你在对对象进行操作时拦截并重新定义这些操作。

## 能否举一个实际开发中使用Proxy的场景？比如如何用它实现数据绑定或验证？
```js
const handler = {
    get(target, property) {
        console.log(`Getting ${property}`);
        return target[property];
    },
    set(target, property, value) {
        if (typeof value === 'number') {
            target[property] = value;
            console.log(`Setting ${property} to ${value}`);
            return true;
        } else {
            console.error(`Invalid value for ${property}`);
            return false;
        }
    }
};

const data = { count: 0 };
const proxyData = new Proxy(data, handler);

proxyData.count = 1; // Setting count to 1
console.log(proxyData.count); // Getting count, 1
proxyData.count = 'a'; // Invalid value for count
```

## Proxy和Object.defineProperty有什么区别？在Vue 3中，为什么选择用Proxy替代Object.defineProperty？
- `Proxy`和`Object.defineProperty`都可以用于拦截和定义对象的行为，但`Proxy`更强大和灵活。`Proxy`可以拦截更多类型的操作（如删除属性、函数调用等），而`Object.defineProperty`只能拦截属性的读取和写入。
- 在Vue 3中，选择用Proxy替代Object.defineProperty是因为Proxy可以更全面地拦截对象操作，解决Vue 2中无法检测数组和对象新增属性的问题。