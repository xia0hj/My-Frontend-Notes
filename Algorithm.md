# 算法

## 二叉树的非递归遍历模板

```js
// 前序遍历：中->左->右
var preorderTraversal = function(root) {
  const result = []
  const stack = []
  if(root) stack.push(root) // 根节点第一个入栈
  while ( stack.length > 0 ) {
    const cur = stack.pop()
    if( cur !== null ) {
      // 入栈顺序与遍历顺序相反：右->左->中
      // 不同的遍历顺序只需调整此处的入栈顺序即可
      if(cur.right !== null) stack.push(cur.right)
      if(cur.left !== null) stack.push(cur.left)
      // 中节点入栈后要再入栈null作为标记
      stack.push(cur)
      stack.push(null)
    } else {
      result.push(stack.pop().val)
    }
  }
  return result
};
```

## 约瑟夫环

```js
// n=当前有多少人, k=报数报到k的人退出(每轮都不会变)
// fn(n,k) = ( fn(n-1, k) + k ) % n = 当前有n人的轮次获胜者的下标
let winner = 0 // 最后一轮剩下一个人，获胜者是0
// 从剩下2个人开始反推
for(let i=2; i<=n; i++){
  winner = (winner+k)%i
}
return winner+1 // 前面计算是从0开始的下标，结果要加1
```

## 双指针滑窗模板

```js
// 例题leetcode-713 leetcode-1004
function slidingWindow(nums, k){
  let left = 0, right = 0 // [left, right] 闭区间双指针
  let sum = 0 // 决定区间是否有效的计数，可以是区间总和或乘积(如为乘积初始为1)，也可以是区间内0的个数，一般要求sum < k
  let result = 0 // 返回结果，可以是有效的区间数量，也可以是最大有效区间长度

  // 右指针会在循环中遍历数组每一个元素
  while(right < nums.length){
    sum += nums[right] // 将右指针元素加入区间
    // sum不符合区间要求，右移左指针
    while(sum>=k && left<=right){
      sum -= nums[left] // 将左指针元素移出区间
      left++
    }
    // 此时的区间为固定右指针时的最大有效区间，长度为(right-left+1)
    // 返回结果，可以是有效的区间数量，也可以是最大有效区间长度
    result = Math.max(result, (right-left+1))
    right++ // 不要忘记右移右指针
  }
  return result
}
```

## 树状数组模板(可用于保存前缀和)

```js
class BIT{
  constructor(length){
    // 树状数组的下标从1开始
    this.tree = new Array(length+1).fill(0)
  }
  addVal(index, val){
    // 修改从左往右
    while(index < this.tree.length){
      this.tree[index] += val
      index += (index & -index)
    }
  }
  prefixSum(index){
    // 前缀和从右往左
    let sum = 0
    while(index>0){
      sum += this.tree[index]
      index -= (index & -index)
    }
    return sum
  }
}
```

## 广度优先搜索模板

```js
function DFS(start, end){
  let step = 0
  const queue = []
  queue.push(start)
  while(queue.length>0){
    const curLength = queue.length
    for(let i=0; i<curLength; i++){
      const cur = queue.shift()
      // 根据cur将下一层的数据入队
    }
    step++
  }
}
```

## 序列化二叉树通解

```js
// 将树转为前序遍历的字符串
function serialize(root){
  if(root===null) return '#'
  const leftTree = serialize(root.left)
  const rightTree = serialize(root.right)
  return `${root.val},${root.left},${root.right}`
}
// 将前序遍历的字符串转为树
function deserialize(str){
  const splitData = str.split(',')
  return buildTree(splitData)
}
function buildTree(array){
  if(array[0]==='#'){
    array.shift()
    return null
  }
  const curVal = array.shift()
  const node = new TreeNode(curVal)
  node.left = buildTree(array)
  node.right = buildTree(array)
  return node
}
// 树的定义
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}
```
