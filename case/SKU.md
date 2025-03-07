# 商品规格SKU选择说明文档

## 需求
1. 多规格选择，提供不同的词条供用户自由搭配，在每次选择完一次词条之后，更新组件显示可选词条和被禁用词条
2. 提供默认的配置选择，从接口里获取第一项有库存的规格配置，赋值给SKU组件作为初始配置

## 预期效果
```
种类1
|-----词条1、词条2、词条3
种类2
|-----词条4、词条5、词条6
种类3
|-----词条7、词条8、词条9
```

## 代码
### 代码路径
- `src\component\SKU\index.vue`(SKU组件)
- `src\component\productSpecification\indexV1.vue`(使用SKU组件的弹窗组件)

### 代码结构(SKU组件)
- SKU组件
```js
<view class="" v-for="(item, index) in goodsInfo.optionName" :key="index">
        <view class="text">{{ item }}</view>

        <view class="" style="display: flex; flex-wrap: wrap">
          <view
            class="boxItem"
            v-for="(item1, index1) in optionItems[index]"
            :key="index1"
            :class="[
               item1.selected ? 'selected' : '',
               item1.disabled ? 'disabled' : '',
              ]"
            @click="handleToSelect(item1, optionItems[index])"
          >
            {{ item1.value }}
          </view>
        </view>
      </view>
```
- 点击任意词条触发的`handleToSelect`函数：
```js
/** 
 * @description 点击选择
 * @param item 当前选择的那一项词条
 * @param itemList 选择的词条所属的规格种类的数组
 */
function handleToSelect(item: OptionItem, itemList: Array<OptionItem>) {

  // 如果当前词条处于禁选状态则不处理
  if (item.disabled) {
    return 
  }

  // 如果当前词条处于选中状态则设为未选中
  if (item.selected) {
    item.selected = false
  } else {
    // 遍历当前种类的全部词条，其他词条为未选中，当前词条为选中
    itemList.forEach((value) => {
      value.selected = false
    })
    item.selected = true
  }

  // 更新禁选状态
  updateDisabledStatus(pathMap.value, optionItems.value)
}
```

- 词条的禁选逻辑函数`updateDisabledStatus`：
```js
// 商品规格 sku 表
const pathMap = ref<Map<string, any>>()
// 规格配置组合
const optionItems = ref<Array<any>>([])

// ... 其他代码

/** 
 * @description 更新禁选状态
 * @param pathMap 商品规格 sku 表 
 * @param specs 选中的规格种类的数组,规格配置组合
 */
function updateDisabledStatus(pathMap, specs: Array<OptionItem[]>) {
  if (!specs || specs.length === 0) return;
  
  // 当前组合
  const _selectedArr = getSelectedArr(specs)

  const _Index = getSelectedIndex(specs)

  //** 获取当前选中的组合与无效组合之间的对比情况，返回一个只有true false 二维数组  */
  const disable_combination = selectIdStr.value.map(item => {
    return item.map((element, index) => element === _Index[index])
  });
  // console.log("disable_combination", disable_combination)

  // 获取需要禁用的词条的坐标
  const resultIndices = disable_combination.map((item, index) => {
    const trueCount = item.filter(value => value).length; // 计算 true 的数量
    const falseCount = item.length - trueCount; // 计算 false 的数量

    // 检查是否有 n-1 个 true 和 1 个 false
    if (trueCount === item.length - 1 && falseCount === 1) {
      const falseIndex = item.indexOf(false); // 获取 false 
      // console.log('falseIndex', falseIndex)
      return [falseIndex, selectIdStr.value[index][falseIndex]] // 返回对应的文本元素
      // return falseIndex // // 返回 [selectIdStr.value 的索引, falseIndex]
    }
    return null; // 不满足条件时返回 null
  }).filter(text => text !== null); // 过滤掉 null 值

  // console.log('optionItems.value after update??', optionItems.value);
  if (resultIndices.length > 0) {
  optionItems.value = optionItems.value.map((optionGroup, outerIndex) => {
    return optionGroup.map((item, innerIndex) => {
      // 获取当前项的索引
      const x = outerIndex
      const y = innerIndex

      // 检查 resultIndices 中是否有匹配的索引
      const shouldDisable = resultIndices.some(([resultX, resultY]) => resultX === x && resultY === y)

      if (shouldDisable) {
        // console.log(`执行了n,${item.value}`)
        return { ...item, disabled: true }
      }
      return item
    })
  })
  }
  
  // 合并选择的结果
  selectStr.value = _selectedArr.join(separator)

  //* 判断是否每一个规格种类都选择了一个子项，如果有规格子项什么都不选，则不做处理
  if (pathMap[selectStr.value]?.length === 1) {
    goodsStockId.value = pathMap[selectStr.value][0]
    let stockNum
    let stock = {}
    for (const item of goodStockInfo.value) {
      if (item.id === goodsStockId.value) {
        // 是否为无限库存
        stockNum = item.infinity == 1 ? 999 : item.stock
        // 库存信息
        stock = item
      }
      // console.log("库存信息", stock)
    }
    // 回传 --------->库存id、用户选择的结果、库存数量、库存单价
    emit("putResult", goodsStockId.value, _selectedArr, stockNum, stock)
  } else {
    emit("putResult", "", [], 999, {})
  }
  specs.forEach((spec, index) => {
    const selectedArr = [..._selectedArr]
    spec.forEach((btn) => {
      // 已经选中的
      if (btn.value === selectedArr[index]) {
        return
      }
      // 将最后一项填入用户选择的最后一项
      selectedArr[index] = btn.value
      // 去掉 null 拼接字符串，再查询
      const key = selectedArr.filter((v) => v).join(separator)
      // 若找不到 设置为true
      btn.disabled = !pathMap[key]
    })
  })
}
```
- 回传,通知父组件`productSpecification`更新
```js
const emit = defineEmits(["putResult"])

//... 其他代码
function updateDisabledStatus(pathMap, specs: Array<OptionItem[]>) {
  // ... 其他代码
  //* 判断是否每一个规格种类都选择了一个子项，如果有规格子项什么都不选，则不做处理
  if (pathMap[selectStr.value]?.length === 1) {
    goodsStockId.value = pathMap[selectStr.value][0]
    let stockNum
    let stock = {}
    for (const item of goodStockInfo.value) {
      if (item.id === goodsStockId.value) {
        // 是否为无限库存
        stockNum = item.infinity == 1 ? 999 : item.stock
        // 库存信息
        stock = item
      }
      // console.log("库存信息", stock)
    }
    // 回传 --------->库存id、用户选择的结果、库存数量、库存单价
    emit("putResult", goodsStockId.value, _selectedArr, stockNum, stock)
  } else {
    // console.log("没有选中sku------------")
    emit("putResult", "", [], 999, {})
  }
  // ... 其他代码
}
```

### 代码结构(productSpecification组件)
- 接收回传
```js
// ... 其他代码
<SkuDemo
  :goodId="goodsInfo.goodsId"
  :productSpec="goodsInfo.goodsStockSelected"
  @putResult="handleToGetSelectSkuResult"
  @click="console.log('goodsInfo', goodsInfo)"
/>
// ... 其他代码

```
- 接收回传之后触发的`handleToGetSelectSkuResult`函数
```js
/** 获取 sku 选中的结果 */
function handleToGetSelectSkuResult(...val) {
  let result = Array.from(val)
  let goods = {
    goodsStockId: "",   
    goodsStockName: "",
    goodsStockSelected: [],
    goodsStockPrice: 0,
    freeAdditionPerk: 0
  }
  if (result[0]) {
    goods = {
      goodsStockId: result[0],
      goodsStockName: result[1].join("/"),
      goodsStockSelected: result[1],
      goodsStockPrice: result[3]?.price,
      freeAdditionPerk: result[3]?.freeInstallPerk
    }
  }
  // 把接收到的数据设置到商品数据，重新传回给SKU组件
  setGoodsInfo(goods)
}
```
