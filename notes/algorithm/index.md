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
  // 参数 index 从 1 开始
  addVal(index, val){
    // 修改从左往右
    while(index < this.tree.length){
      this.tree[index] += val
      index += lowbit(index)
    }
  }
  // 参数 index 从 1 开始
  prefixSum(index){
    // 前缀和从右往左
    let sum = 0
    while(index>0){
      sum += this.tree[index]
      index -= lowbit(index)
    }
    return sum
  }
  // 取 num 最低位的 1 及其右边的 0，假如 num 的二进制为 10110100，则 lowbit = 100 取 num 最右边的 100
  lowbit(num){
    return (num & -num)
  }
}
```

## 广度优先搜索模板

```js
function DFS(start, end){
  let step = 0
  const queue = []

  // 初始化二维数组，注意不要用 fill() 方法
  // 在每次 push 队列时修改 visited
  const visited = []
  for(let i=0; i<length; i++) visited[i] = []

  queue.push(start)
  visited[start.row][start.col] = true

  while(queue.length>0){
    const curLength = queue.length
    for(let i=0; i<curLength; i++){
      const cur = queue.shift()
      // 根据cur将下一层的数据入队
      if(canPush){
        queue.push(next)
        visited[next.row][next.col] = true
      }
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

## 原地合并两个有序数组

要将合并结果放到其中一个参数数组中，可以从两个数组的末尾开始双指针遍历，结果保存至其中一个数组

## 二分查找

1. 左开右开区间，初始值 left=-1，right=nums.length，循环时设 left=mid 或 right=mid
2. 求 mid 避免溢出：const mid = left + Math.floor((right-left)/2)
3. 如果发生无限循环，注意 mid 是不是小数，js不会像java默认向下取整

## 状态压缩-数字二进制用作数组

```js
function getBit(num, index) {
  const cur = (1 << index) 
  return num & cur
}
function setBit(num, index, boolVal) {
  const cur = (1 << index) // 假如修改下标 2，那么通过 << 左移后 cur = '100'
  if (boolVal) {
    return num | cur
  } else {
    return num & (~cur)
  }
}
```

## 二叉搜索树删除某节点

[leetcode 450. 删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/)

1. 如果目标节点大于当前节点值，则去右子树中删除；
2. 如果目标节点小于当前节点值，则去左子树中删除；
3. 如果目标节点就是当前节点，分为以下三种情况：
   1. 其无左子：其右子顶替其位置，删除了该节点；
   2. 其无右子：其左子顶替其位置，删除了该节点；
   3. 其左右子节点都有：其左子树转移到其右子树的最左节点的左子树上，然后右子树顶替其位置，由此删除了该节点。

```js
var deleteNode = function (root, key) {
  if (!root) {
    // 兼容找不到目标节点的情况
    return null
  } else if (key > root.val) {
    // 如果目标节点大于当前节点值，则去右子树中删除
    root.right = deleteNode(root.right, key)
  } else if (key < root.val) {
    // 如果目标节点小于当前节点值，则去左子树中删除
    root.left = deleteNode(root.left, key)
  } else if (key === root.val) {
    if (root.left === null) {
      // 如果目标节点无左子，其右子顶替其位置，使目标节点被移出
      return root.right
    } else if (root.right === null) {
      // 如果目标节点无右子，其左子顶替其位置，使目标节点被移出
      return root.left
    } else if (root.left && root.right) {
      // 如果目标节点左右子都有，将其左子树拼接到其右子树最左节点的左子上，然后由右子树顶替目标节点位置
      // 找到 右子树 的 最左节点
      let rightMin = root.right
      while (rightMin.left !== null) rightMin = rightMin.left
      // 将 目标节点 的 左子树 拼接到 右子树最左 的 左子
      rightMin.left = root.left
      // 右子树顶替目标节点
      return root.right
    }
  }
  return root
};
```
