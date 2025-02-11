# promise

## 什么是Promise？它解决了JavaScript中的什么问题？
- Promise是一个用于处理异步操作的对象。它解决了JavaScript中的回调地狱问题，使得异步代码更具可读性和可维护性。

## 如何用Promise实现一个简单的超时控制（timeout）？比如在1秒后超时并返回错误。
```js
function timeoutPromise(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout'));
        }, ms);
    });
}

function fetchData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Data fetched');
        }, 500);
    });
}

Promise.race([fetchData(), timeoutPromise(1000)])
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

## Promise和async/await有什么区别？在什么情况下你会选择使用async/await而不是Promise？
- async/await是基于Promise的语法糖，使得异步代码看起来像同步代码，更加简洁和可读。选择使用async/await的情况包括：
1. 需要处理多个异步操作，避免嵌套的回调。
2. 需要更清晰的错误处理（使用try/catch）。