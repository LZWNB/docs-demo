# 虚拟 DOM（Virtual DOM）

## 什么是虚拟 DOM？
虚拟 DOM 是一个轻量级的 JavaScript 对象，用于描述真实 DOM 的层次结构和属性。它是真实 DOM 的内存抽象表示，不直接操作浏览器渲染引擎。

## 为什么需要虚拟 DOM？解决了什么问题？
### 1. 性能优化
- **问题**：直接操作 DOM 会触发昂贵的重排（Reflow）和重绘（Repaint），频繁操作导致性能瓶颈
- **解决方案**：
  - 内存中比较虚拟 DOM 差异（Diff 算法）
  - 批量更新真实 DOM，减少操作次数
  - 例：更新 10 个节点 → 虚拟 DOM 可能只需 1 次 DOM 操作

### 2. 跨平台能力
- **问题**：浏览器 API 依赖限制渲染目标（如无法用于原生应用）
- **解决方案**：
  ```js
  // React Native 使用相同虚拟 DOM 机制
  import { View } from 'react-native';
  
  <View style={{flex:1}}> // 映射为 iOS/Android 原生组件
    <Text>Hello World</Text>
  </View>
  ```

### 3. 开发体验提升
- **问题**：命令式 DOM 操作（如 jQuery）导致代码冗余难维护

- **解决方案**：

    - 声明式编程：只需描述 UI 状态

    - 自动 DOM 更新：状态变化 → 虚拟 DOM 计算 → 高效更新

## 工作原理示意图
```text
内存操作（高效）                浏览器操作（昂贵）
┌─────────────┐               ┌─────────────┐
│   State     │               │   Real DOM  │
│   Change    │               └─────────────┘
└─────────────┐                      ▲
       │      │                      │
       ▼      ▼          Diff        │
┌───────────────────┐   Algorithm    │
│  New Virtual DOM  │────────────────┘
├───────────────────┤ 
│  Old Virtual DOM  │
└───────────────────┘
```

## 性能对比场景
```js
// 传统 DOM 更新：10 次插入 → 可能 10 次重排
for(let i=0; i<10; i++) {
  listEl.appendChild(createItem(i));
}

// React 虚拟 DOM：1 次批量更新
setItems(prev => [
  ...prev, 
  ...new Array(10).fill().map((_,i) => ({id: i}))
]);
```

## 虚拟 DOM 的局限性

:::warning
- 内存占用：需维护额外 JS 对象树

- 简单场景轻微性能损耗：对于极少更新的静态页面，直接操作 DOM 更快

- 不取代优化手段：大数据列表仍需 React.memo/useMemo 配合
:::
