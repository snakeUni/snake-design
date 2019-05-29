---
imports:
  import SimpleDemoCode from '!raw-loader!./simpleTable.tsx';
  import SimpleDemo from './simpleTable.tsx';
  import SelectDemoCode from '!raw-loader!./rowSelection.tsx';
  import SelectDemo from './rowSelection.tsx';
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
<Block des="简单的 table" code={SelectDemoCode}>
  <SelectDemo />
</Block>
:::