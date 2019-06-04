---
imports:
  import SimpleDemoCode from '!raw-loader!./simpleTable.tsx';
  import SimpleDemo from './simpleTable.tsx';
  import SelectDemoCode from '!raw-loader!./rowSelection.tsx';
  import SelectDemo from './rowSelection.tsx';
  import SorterDemoCode from '!raw-loader!./sortFilter.tsx';
  import SorterDemo from './sortFilter.tsx';
  import FixedHeaderDemoCode from '!raw-loader!./fixedHeader.tsx';
  import FixedHeaderDemo from './fixedHeader.tsx';
  import FixedColumnDemoCode from '!raw-loader!./fixedColumn.tsx';
  import FixedColumnDemo from './fixedColumn.tsx';
  import FixedHeaderAndColumnDemoCode from '!raw-loader!./fixedHeaderAndColumn.tsx';
  import FixedHeaderAndColumnDemo from './fixedHeaderAndColumn.tsx';
---

# Table 表格

用于复杂的交互

## 简单示例

:::demo
<Block des="简单的 table" code={SimpleDemoCode}>
  <SimpleDemo />
</Block>
:::

## 选择操作

:::demo
<Block des="选择操作" code={SelectDemoCode}>
  <SelectDemo />
</Block>
:::

## 筛选和排序

:::demo
<Block des="筛选和排序" code={SorterDemoCode}>
  <SorterDemo />
</Block>
:::

## 固定表头

:::demo
<Block des="筛选和排序" code={FixedHeaderDemoCode}>
  <FixedHeaderDemo />
</Block>
:::

## 固定列

:::demo
<Block des="筛选和排序" code={FixedColumnDemoCode}>
  <FixedColumnDemo />
</Block>
:::

## 固定表头和列

:::demo
<Block des="筛选和排序" code={FixedHeaderAndColumnDemoCode}>
  <FixedHeaderAndColumnDemo />
</Block>
:::