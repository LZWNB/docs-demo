0# Vue-Router

### 前言

router 路由<br />
因为`vue`是单页应用，不会有那么多`html`用于跳转，所以要使用路由做页面跳转<br />
Vue 路由允许我们通过不同的`URL`访问不同的内容，通过 Vue 可以实现多视图的单页 Web 应用

### 安装

```
$ npm init vue@latest  // 创建时自带一个router模板
// 或者
$ npm init vite@latest // 创建时没有router模板
```

```
$ cd 项目名

$ npm install vue-router -s
```

#### 创建路由

在`src`下创建`router`文件夹，在`router`文件夹下创建`index.js`文件，内容如下：

```ts
import { createRouter, createWebHistory, RouteRecorRaw } from "vue-router";

const router: Array<RouteRecorRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("../components/logiin.vue"),
  },
  {
    path: "/reg",
    name: "Reg",
    component: () => import("../components/reg.vue"),
  },
];

const routes = createRouter({
  history: createWebHistory(),
  routes: [],
});
```

#### 注册

在`main.ts`中引入`router`，并挂载到 app 上

```ts
// 其他代码
import router from "./router";

createApp(App).use(router).mount("#app");
```

<b>路由出口:</b>
注册完之后，需要有容器承载，需要配置路由出口`router-view`, 路由匹配到的组件将渲染在这里，需要在`vue`文件中配置

```js
<template>
  // ...其他代码
  <router-view></router-view>
</template>
```

<b>router-link:</b>
`router-link`组件用于导航，可以配置`to`属性，表示要导航到的目标地址，点击时，会跳转到目标地址，并且会触发路由的跳转。

```js
<template>
  // ...其他代码
  <div>
    <router-link to="/">Login</router-link>
    <router-link to="/Reg">Reg</router-link>
  </div>
  <router-view></router-view>
</template>
```

### 路由模式

常用的路由模式为`hash`和`history`

`hash`实现: <br />
hash 是 URL 中 `hash(#)`及后面的那部分，常用作锚点在页面内进行导航，`改变URL中的hash部分不会引起页面刷新`<br>
通过`hashchange`事件监听 URL 的变化，改变 URL 的方式只有这几种：

1. 通过浏览器前进后退改变 URL
2. 通过`<a>`标签改变 URL
3. 通过`window.location`改变 URL

<br />

`history`实现: <br />
history 提供了`pushState`和`replaceState`两个方法，`这两个方法改变URL的path部分不会引起页面刷新`<br />
history 提供类似`hashchange`事件的`popstate`事件，但 popstate 事件有些不同：

1. 通过浏览器前进后退改变 URL 时会触发 popstate 事件
2. 通过 pushState/replaceState 或`<a>`标签改变 URL 不会触发`popstate`事件。
3. 好在我们可以拦截`pushState/replaceState`的调用和`<a>`标签的点击事件来检测 URL 变化
4. 通过 js 调用`history`的`back`，`go`，`forward`方法课触发该事件
   <br />

- 所以监听 URL 变化可以实现，只是没有`hashchange`那么方便。

### 命名路由-编程式导航

- router/index.ts:

```ts
import { createRouter, createWebHistory, RouteRecorRaw } from "vue-router";

const router: Array<RouteRecorRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("../components/logiin.vue"),
  },
  {
    path: "/reg",
    name: "Reg",
    component: () => import("../components/reg.vue"),
  },
];

const routes = createRouter({
  history: createWebHistory(),
  routes: [],
});
```

#### 字符串

- App.vue:

```vue
<template>
  <!-- ...其他代码 -->
  <div>
    <button @click="toPage('/')">Login</button>
    <button @click="toPage('/Reg')">Reg</button>
  </div>
  <router-view></router-view>
</template>
<script setup lang="ts">
    import {useRouter} from 'vue-router';

    const routes = useRouter();

    const toPage = (path: string) => {
        // 字符串
        routes.push(path)
    }
</script>
```

#### 命名式：

```vue
<template>
  <!-- ...其他代码 -->
  <div>
    <button @click="toPage('/')">Login</button> // [!code --]
    <button @click="toPage('/Reg')">Reg</button> // [!code --]
    <button @click="toPage('Login')">Reg</button> // [!code ++]
    <button @click="toPage('Reg')">Reg</button> // [!code ++]
  </div>
  <router-view></router-view>
</template>
<script setup lang="ts">
    import {useRouter} from 'vue-router';

    const routes = useRouter();

    const toPage = (path: string) => {
        // 字符串
        routes.push(path) // [!code --]
        routes.push({    // [!code ++]
            name: url    // [!code ++]
        })               // [!code ++]

    }
</script>
```

### 历史记录

在不希望留下历史记录的应用场景中，可以给`router-link`添加`replace`属性，这样就不会留下路由的历史记录了

- App.vue:

```vue
<template>
  <!-- ...其他代码 -->
  <div>
    <router-link to="/" replace>Login</router-link>
    <router-link to="/Reg" replace>Reg</router-link>

    <button @click="toPage('/')">Login</button>
    <button @click="toPage('/Reg')">Reg</button>
  </div>
  <router-view></router-view>
</template>
<script setup lang="ts">
    import {useRouter} from 'vue-router';

    const routes = useRouter();

    const toPage = (path: string) => {
        routes.push(path) // [!code --]
        routes.replace(path) // [!code ++]

    }
</script>
```

- 或者在保留路由历史记录的时候对历史记录进行一些操作
- App.vue:

```vue
<template>
  // ...其他代码
  <div>
    <router-link to="/" replace>Login</router-link>
    <router-link to="/Reg" replace>Reg</router-link>

    <button @click="next()">next</button>
    <button @click="prev()">prev</button>
  </div>
  <router-view></router-view>
</template>
<script setup lang="ts">
    import {useRouter} from 'vue-router';

    const routes = useRouter();

    const next = () => {
        router.go()
    }

    const prev = () => {
        router.back()
    }
</script>
```

### 路由传参
- 路由传参可以将数据从页面A传递到页面B

假设这是预期数据：

```json
{
  "data": [
    {
      "id": 1,
      "name": "张三",
      "age": 18
    },
    {
      "id": 2,
      "name": "李四",
      "age": 19
    },
    {
      "id": 3,
      "name": "王五",
      "age": 20
    }
  ]
}
```

这是页面A:
```vue
<template>
  <div v-for="item in data" :key="item.id">
    <div>{{item.name}}</div>
    <div>{{item.id}}</div>
    <div>{{item.age}}</div>
    <button @click="toDetail(item)"></button>
  </div>
  
</template>
<script setup lang="ts">
  import { data } from './json'
  import { useRouter } from 'vue-router'

  const router = useRouter()  // [!code heghtlight]

  type Item = {
    id: number;
    name: string;
    age: number;
  }

  const toDetail = (item: Item) => {
    router.push({
      path: '/Reg', // 页面B的路径
      query: item  // [!code heghtlight]
      // 或者

      // name: 'Reg',
      
      // params: item
      
    })
  }
</script>
```

:::tip
- params不会显示在url中,会存在内存中
- 使用params传递参数时,需要使用params接收,使用query传则用query接收
:::


在页面B接收一下路由传递过来的参数:
```vue
<template>
    <button @click="router.back()">返回</button>
    <div>名字: {{router.query.name}}</div> 
    <div>ID: {{router.query.id}}</div>
    <div>年龄: {{router.query.age}}</div>
    <!-- 如果是params传参，则需要使用router.params.name -->
    <!-- <div>名字: {{router.params.name}}</div>  -->
    <!-- <div>ID: {{router.params.id}}</div> -->
    <!-- <div>年龄: {{router.params.age}}</div> -->
</template>
<script setup lang="ts">
  import { data } from './json'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()  // [!code heghtlight]  用于路由传参
  const router = useRouter()  // [!code heghtlight] 用于返回路由

</script>
```

:::warning
- 因为params把数据存在内存中,刷新页面的时候会导致数据丢失,未了解决这个问题可以使用动态路由参数 
:::

#### 动态路由
- router/index.ts
```ts
import { createRouter, createWebHistory, RouteRecorRaw } from "vue-router";

const router: Array<RouteRecorRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("../components/logiin.vue"),
  },
  {
    path: "/reg/:id", // [!code heghtlight] 传参的时候需要把冒号后面的key对应着写上
    name: "Reg",
    component: () => import("../components/reg.vue"),
  },
];

const routes = createRouter({
  history: createWebHistory(),
  routes: [],
});
```

- 页面A:
```vue
<template>
  <div v-for="item in data" :key="item.id">
    <div>{{item.name}}</div>
    <div>{{item.id}}</div>
    <div>{{item.age}}</div>
    <button @click="toDetail(item)"></button>
  </div>
  
</template>
<script setup lang="ts">
  import { data } from './json'
  import { useRouter } from 'vue-router'

  const router = useRouter()  // [!code heghtlight]

  type Item = {
    id: number;
    name: string;
    age: number;
  }

  const toDetail = (item: Item) => {
    router.push({
      name: 'Reg', // 页面B的name
      params: {
        // 这里params的key为id并不是固定的，而是和路由文件index.ts下定义的path路径末尾`:`后面的key一致
        id: item.id // [!code heghtlight]
      }
    
      
    })
  }
</script>
```

- 页面B接收:
```ts
<template>
    <div>名字: {{item?.name}}</div> 
    <div>ID: {{item?.id}}</div>
    <div>年龄: {{item?.age}}</div>
</template>
<script setup lang="ts">
  import { data } from './json'
  import { useRoute } from 'vue-router'

  const route = useRoute()  // [!code heghtlight]

  const item = data.find(v => v.id === Number(route.params.id) )

</script>
```

#### 二者的区别

1. query传参配置的是`path`,而params传参配置的是`name`,在params中配置`path`无效
2. query在路由配置不需要设置参数,而`params`必须设置
3. query传递的参数会显示在地址栏中
4. params传参刷新会无效,但是query会保存传递过来的值,刷新不变
5. 路由配置

   



