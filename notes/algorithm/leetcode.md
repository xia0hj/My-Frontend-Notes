# Leetcode 做题记录

## 2. 两数相加

```java
题目：
用链表表示一个数的各位的值，计算两个链表加起来的结果，结果也用链表表示

解法：
链表长度不一致的情况，null 表示该位的值为 0  
当前位的值 = sum % 10  
进位数 = sum / 10

public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode head = null, tail = null;
    int add = 0;
    while (l1 != null || l2 != null) {
        int val1 = l1 != null ? l1.val : 0;
        int val2 = l2 != null ? l2.val : 0;
        int curSum = val1 + val2 + add;
        add = curSum / 10;
        if (head == null) {
            head = new ListNode(curSum % 10);
            tail = head;
        } else {
            tail.next = new ListNode(curSum % 10);
            tail = tail.next;
        }
        l1 = l1 != null ? l1.next : null;
        l2 = l2 != null ? l2.next : null;
    }
    if (add > 0) {
        tail.next = new ListNode(add);
    }
    return head;
}
```

## 3. 无重复字符的最长子串

```java
题目：
给定字符串，找出其中 最长、无重复字符串、连续 的子串长度

解法：
双指针滑动窗口，初始双指针 = 0
将右指针加入 set，直到 set 中有重复字符
左指针右移时，如果其不为 0，从 set 中移除 left-1 下标的字符

public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int maxCount = 0;
    int right = 0;

    for (int left = 0; left < s.length(); left++) {
        if (left > 0) {
            set.remove(s.charAt(left - 1));
        }
        while (right < s.length() && !set.contains(s.charAt(right))) {
            set.add(s.charAt(right));
            right++;
        }
        maxCount = Math.max(maxCount, right - left);
    }
    return maxCount;
}
```
