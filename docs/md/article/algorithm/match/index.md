---
title: 字符串匹配算法
sidebar: false
---

# 字符串匹配算法

## 字符串匹配算法目录

+ [朴素字符串匹配算法](./naive_string_matching.md)
+ [Knuth-Morris-Pratt 算法](./kmp_algorithm.md)
+ [Boyer-Moore 算法](./boyer_moore_algorithm.md)
+ [Rabin-Karp 算法](./rabin_karp_algorithm.md)
+ [Sunday 算法](./sunday_algorithm.md)
+ [Aho-Corasick 算法](./aho_corasick_algorithm.md)
+ [Horspool 算法](./horspool_algorithm.md)
+ [Zhu-Takaoka 算法](./zhu_takaoka_algorithm.md)
+ [Bitap 算法](./bitap_algorithm.md)
+ [Wu-Manber 算法](./wu_manber_algorithm.md)
+ [Karp-Rabin 指纹算法](./karp_rabin_algorithm.md)
+ [Ukkonen's 算法](./ukkonens_algorithm.md)

## 总结

字符串匹配算法用于在文本中查找子字符串或模式。以下是一些常见的字符串匹配算法：

### 1. 朴素字符串匹配算法 (Naive String Matching Algorithm)

- **描述**：逐个字符比较文本和模式，直到找到匹配或遍历完整个文本。
- **时间复杂度**：O((n - m + 1) * m)，其中 n 是文本长度，m 是模式长度
- **空间复杂度**：O(1)

### 2. Knuth-Morris-Pratt 算法 (KMP Algorithm)

- **描述**：通过预处理模式，构建部分匹配表（前缀函数），在匹配过程中避免重复比较。
- **时间复杂度**：O(n + m)
- **空间复杂度**：O(m)

### 3. Boyer-Moore 算法 (Boyer-Moore Algorithm)

- **描述**：从右向左比较模式和文本，通过预处理模式，使用坏字符规则和好后缀规则来跳过不必要的比较。
- **时间复杂度**：O(n) 平均，O(nm) 最坏
- **空间复杂度**：O(m)

### 4. Rabin-Karp 算法 (Rabin-Karp Algorithm)

- **描述**：使用哈希函数计算模式和文本子串的哈希值，通过比较哈希值来查找匹配。
- **时间复杂度**：O(n + m) 平均，O(nm) 最坏
- **空间复杂度**：O(1)

### 5. Sunday 算法 (Sunday Algorithm)

- **描述**：Boyer-Moore 算法的变种，通过预处理模式，使用最右字符规则来跳过不必要的比较。
- **时间复杂度**：O(n) 平均，O(nm) 最坏
- **空间复杂度**：O(m)

### 6. Aho-Corasick 算法 (Aho-Corasick Algorithm)

- **描述**：多模式匹配算法，通过构建有限状态自动机（Trie 树和失败函数），在一次遍历中查找所有模式。
- **时间复杂度**：O(n + m + z)，其中 z 是匹配到的模式数量
- **空间复杂度**：O(m)

### 7. Horspool 算法 (Horspool Algorithm)

- **描述**：Boyer-Moore 算法的简化版本，只使用坏字符规则来跳过不必要的比较。
- **时间复杂度**：O(n) 平均，O(nm) 最坏
- **空间复杂度**：O(m)

### 8. Zhu-Takaoka 算法 (Zhu-Takaoka Algorithm)

- **描述**：Boyer-Moore 算法的改进版本，通过预处理模式，使用双字符跳跃来提高效率。
- **时间复杂度**：O(n) 平均，O(nm) 最坏
- **空间复杂度**：O(m)

### 9. Bitap 算法 (Bitap Algorithm)

- **描述**：基于位操作的字符串匹配算法，通过位掩码来实现快速匹配。
- **时间复杂度**：O(nm) 最坏
- **空间复杂度**：O(m)

### 10. Wu-Manber 算法 (Wu-Manber Algorithm)

- **描述**：多模式匹配算法，通过预处理模式，使用哈希表和位掩码来实现快速匹配。
- **时间复杂度**：O(n) 平均，O(nm) 最坏
- **空间复杂度**：O(m)

### 11. Karp-Rabin 指纹算法 (Karp-Rabin Fingerprint Algorithm)

- **描述**：Rabin-Karp 算法的变种，通过滚动哈希函数来计算模式和文本子串的哈希值。
- **时间复杂度**：O(n + m) 平均，O(nm) 最坏
- **空间复杂度**：O(1)

### 12. Ukkonen's 算法 (Ukkonen's Algorithm)

- **描述**：用于构建后缀树的在线算法，可以用于快速字符串匹配。
- **时间复杂度**：O(n)
- **空间复杂度**：O(n)
