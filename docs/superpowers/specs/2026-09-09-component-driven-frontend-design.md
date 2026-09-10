# Component-Driven Frontend Skill 设计规范

日期：2026-09-09  
状态：待用户审阅

## 1. 目标

创建一个仓库级 Codex Skill：`component-driven-frontend`。当用户要求设计或实现 React 前端，并希望复用现有组件系统、选择合适的 UI 组件、改善视觉品质或从组件库组合页面时，该 Skill 负责把模糊需求转换为可执行的设计方向、组件计划和验证流程。

Skill 的核心价值不是维护“好看组件清单”，而是提供一个可重复的决策机制：先理解项目和设计意图，再从当前项目与已配置组件源中选择最合适的组件，最后通过工程检查和视觉检查验证结果。

## 2. 成功标准

完整实现必须满足以下条件：

1. Codex 能通过用户请求中的明确症状触发该 Skill，例如“设计 React 页面”“选择好看的 UI 组件”“用 shadcn、Magic UI 或 Aceternity 实现页面”“改善现有页面的视觉和组件组合”。
2. Skill 在修改代码前检查当前项目的框架、包管理器、样式系统、已安装依赖、组件目录、主题变量和现有组件。
3. Skill 先输出简短的 Design Intent 与 Component Plan，再开始实现。
4. Skill 默认复用当前项目组件；需要新增组件时，优先选择项目的基础设计系统，再选择一个兼容的视觉增强源，最后才自建组件。
5. Skill 能通过确定性脚本扫描项目、查询或整理组件候选、校验 Component Plan。
6. 脚本只使用 Node.js 标准库，离线时仍可完成项目扫描和静态组件计划校验。
7. Skill 明确处理动态查询失败、Registry 不可用、组件冲突、未知依赖和无浏览器环境等情况。
8. Skill 包含可运行的自动化测试、离线 fixtures 和手动场景验证说明。
9. 纯逻辑 React 缺陷和无需组件系统判断的单行样式修改不触发完整工作流；只有确实涉及 Token、variant、组件或无障碍判断的有界修改才走轻量路径。
10. Skill 将视觉方向落实为可审查的形态、材质和交互系统，避免整页重复方框、无层级玻璃态，以及只用整块淡入代替核心产品交互。

## 3. 非目标

第一版不做以下事情：

- 不建立长期缓存的完整组件截图数据库。
- 不自动混用 shadcn、HeroUI、Mantine、MUI 和 Ant Design 等多个基础设计系统。
- 不把视觉审美简化为固定风格或固定颜色模板。
- 不替用户决定产品需求、品牌规范或高影响依赖变更。
- 不绕过已有项目的组件、Tokens、Code Connect 或设计系统约束。
- 不要求外部 MCP 才能运行；MCP 和在线 Registry 仅作为增强能力。

## 4. 设计原则

### 4.1 一个基础系统，一个增强源

每个项目最多选择一个基础设计系统。若需要更强视觉表现，可额外选择一个兼容的增强源。默认推荐：

- 基础系统：项目已有系统；新项目采用 shadcn/ui。
- 增强源：Magic UI 或 Aceternity UI 二选一。
- 专项库：Lucide、TanStack Table、Recharts、Motion、Sonner 按实际能力需求引入，不算第二个基础系统。

若项目已使用 HeroUI、Mantine、MUI 或 Ant Design，Skill 应留在该体系中，不为了视觉效果迁移基础系统。

### 4.2 动态发现优于硬编码目录

组件版本、名称和安装方式会变化。Skill 只维护来源能力、查询协议和选择规则；具体组件必须尽量通过项目文件、官方 CLI、Registry、文档脚本或 MCP 在运行时发现。离线时使用项目现状和少量稳定的能力映射，不伪造在线结果。

### 4.3 先能力，后组件名

先把页面拆成能力需求，例如导航、筛选、数据展示、主要操作、反馈和空状态，再搜索能承担这些能力的组件。组件候选不能只依据“好看”排序，还要考虑一致性、可访问性、状态完整度、依赖成本、客户端开销和响应式适配。

### 4.4 先复用，后组合，最后自建

选择顺序固定为：

1. 当前项目已有且合适的组件；
2. 当前基础设计系统中的组件；
3. 与基础系统兼容的增强组件；
4. 组合已有 primitives；
5. 自建组件。

## 5. Skill 包结构

```text
.agents/skills/component-driven-frontend/
├── SKILL.md
├── references/
│   ├── design-intent.md
│   ├── visual-language.md
│   ├── component-selection.md
│   ├── source-adapters.md
│   ├── composition-patterns.md
│   └── visual-qa.md
├── scripts/
│   ├── inspect-project.mjs
│   ├── query-components.mjs
│   └── validate-component-plan.mjs
└── tests/
    ├── inspect-project.test.mjs
    ├── query-components.test.mjs
    ├── validate-component-plan.test.mjs
    └── fixtures/
```

`SKILL.md` 保持紧凑，只包含触发边界、核心约束和主工作流。详细决策知识放在 `references/`，确定性操作放在 `scripts/`，测试使用完全离线的临时项目与 Registry fixtures。

## 6. 核心工作流

### 阶段 A：项目发现

运行 `inspect-project.mjs`，输出稳定 JSON，包含：

- React/Next.js/Vite 等框架信号；
- npm、pnpm、yarn、bun 包管理器；
- Tailwind、CSS Modules、styled-components 等样式信号；
- `components.json` 和 shadcn Registry 配置；
- 已安装的 UI、图标、图表、表格、动画与通知依赖；
- 可能的组件目录、主题文件和已有组件名称；
- 探测警告与置信度。

探测结果另含 `activeFoundation`：只探测到一个基础系统时为该系统；探测到多个基础系统时为 `null` 并附带显式冲突警告，直到页面或 import 证据能够解析当前使用者。应用框架优先于构建工具（例如 Remix + Vite 的 `primary` 为 Remix，同时保留 Vite 信号）。普通 `globals.css` 文件名不是 Tailwind 证据，必须存在依赖、配置文件或 Tailwind CSS directive/import marker。

脚本只读，不执行包管理器命令，不递归扫描 `node_modules`，并允许使用 `--root` 指定项目目录。

### 阶段 B：设计意图

根据用户目标和项目现状形成简短 Design Intent：

- 产品类型与核心任务；
- 目标用户与信息密度；
- 视觉方向与明确要避免的模板化特征；
- 字体、色彩、圆角、阴影、间距、动效原则；
- 形态层级、材质深度、交互触发与降级边界；
- 响应式与无障碍基线。

已有品牌规范、设计 Tokens、Figma 或 Code Connect 的优先级高于 Skill 默认偏好。

### 阶段 C：组件需求与查询

将页面需求转换为 capability queries。`query-components.mjs` 提供统一 CLI：

```text
node query-components.mjs --source <project|shadcn|magicui|aceternity|registry-file> --query <text> [--root <path>] [--registry-file <path>] [--json]
```

第一版支持：

- `project`：从项目组件目录中检索现有组件；
- `registry-file`：读取 shadcn Registry 风格的本地 JSON 或 fixtures；
- `shadcn`、`magicui`、`aceternity`：生成或执行受控的官方查询策略；当网络或对应 CLI 不可用时，返回结构化降级信息，不声称查询成功。

查询结果统一为 Component Candidate：

```json
{
  "id": "source/component-name",
  "name": "component-name",
  "source": "project|shadcn|magicui|aceternity|registry-file",
  "description": "",
  "capabilities": [],
  "dependencies": [],
  "registryDependencies": [],
  "installCommand": null,
  "docsUrl": null,
  "relevanceScore": 0,
  "warnings": []
}
```

候选必须至少命中一个规范化名称、能力或描述 token 才能返回；项目内或同基础系统加分不能让无关候选进入结果。`relevanceScore` 只用于查询发现排序，不封顶为 100，也不是第 7 节的最终适配度评分。中性的 `registry-file` 模式不能从 source 标签伪造安装 namespace；未提供可信 namespace 时，`installCommand` 为 `null` 并返回解释性 warning。

### 阶段 D：Component Plan

开始编码前输出或保存 Component Plan。每个条目包含：

- 页面区域或用户需求；
- 所需能力；
- 选择的组件与来源；
- 选择理由；
- 使用的 variants/states；
- 响应式行为；
- 无障碍要求；
- 新增依赖；
- 降级或自建理由。

`validate-component-plan.mjs` 校验 JSON 计划的结构与策略：

- 必填字段完整；
- 只能有一个基础设计系统；
- 最多有一个增强源；
- 新增依赖必须显式列出；
- 交互组件必须声明键盘、焦点或语义要求；
- 异步或数据区域必须覆盖 loading、empty、error、success 中适用的状态；
- 自建组件必须记录为什么现有候选不适合。
- `forms`、`controls`、`overlay` 必须同时声明 `interactive`；`table`、`chart`、`metrics` 必须同时声明 `data`；`data` 或 `async` 区域触发状态覆盖检查。
- 已知基础系统的 `selection.source` 不得与声明的 `foundation` 冲突；允许 `project`、`foundation`、`custom`、声明的基础系统及声明的 enhancer（以及存在 enhancer 时的 `enhancer` 别名）。
- Recharts、TanStack Table、Lucide、Motion 与 Sonner 是专项能力依赖，必须进入 `dependencies`，不能写入 `enhancer`。

校验器区分 `errors` 和 `warnings`，并用非零退出码表示结构或策略错误。

### 阶段 E：实现与验证

实现时以候选组件的当前官方文档和项目源码为准。安装前先查看将发生的变更；安装后检查生成文件、导入、依赖和主题变量。最终验证至少包括：

- 项目自身的 lint、typecheck、test、build 中可用的项目命令；
- 关键交互状态；
- hover、press、focus、滚动揭示和异步状态连续性；
- 桌面端与移动端渲染；
- 圆角层级、无必要框线、玻璃背景/回退、模糊成本与文字对比度；
- 溢出、遮挡、对比度、焦点和减弱动效；
- 与 Design Intent 和 Component Plan 的一致性。

没有浏览器能力时，Skill 必须说明视觉验证尚未执行，不能用代码检查代替截图结论。

## 7. 组件最终适配度评分

此处是候选通过发现后的独立 100 分最终适配度评估，不是查询阶段的 `relevanceScore`。它用于排序，不替代判断。默认权重：

| 维度 | 权重 | 说明 |
|---|---:|---|
| 项目一致性 | 30 | 已安装、已有 Tokens、相同基础系统优先 |
| 能力匹配 | 25 | 能否直接覆盖用户任务与必要状态 |
| 可访问性 | 15 | 语义、键盘、焦点和 reduced motion 支持 |
| 视觉适配 | 15 | 是否符合 Design Intent，而非单独“炫” |
| 响应式 | 10 | 是否能覆盖目标断点和触控场景 |
| 成本 | 5 | 依赖、bundle、client-only 和维护成本 |

存在基础系统冲突、缺失关键交互状态或明显无障碍问题时，候选应被拒绝，而不是靠高视觉分抵消。

## 8. 错误与降级策略

| 情况 | 行为 |
|---|---|
| 未识别出 React 项目 | 输出低置信度探测结果；Skill 先向用户确认技术栈，不安装组件 |
| Registry/网络不可用 | 返回 `offline`/`unavailable` 状态；使用项目组件和本地资料继续 |
| CLI 不存在 | 给出可复制的官方查询命令，不自动安装全局工具 |
| 多个基础系统已存在 | 报告冲突并优先保持当前页面使用的系统；不继续扩大混用 |
| 候选缺少文档或源码 | 标为不可验证，不进入自动选择结果 |
| 安装会覆盖本地组件 | 必须先 dry-run/diff；需要用户确认才能覆盖 |
| Component Plan 无合法候选 | 明确记录自建理由、接口、状态和测试要求 |

脚本错误统一写入标准错误；机器输出保持可解析 JSON；不包含密钥、环境变量值或大段源码。

## 9. 测试策略

### 自动化测试

使用 Node.js 内建 `node:test` 与 `assert`，不新增测试框架。

1. `inspect-project`：覆盖 Next.js/shadcn fixture、Vite/非 shadcn fixture、空目录、损坏 JSON、普通 globals CSS、Remix + Vite 和 shadcn + Mantine 冲突。
2. `query-components`：覆盖项目组件检索、Registry JSON 标准化、稳定 Candidate keys、发现相关度、项目与 Registry 无结果、中性 Registry 安装真值，以及不可用在线源的降级结构。
3. `validate-component-plan`：覆盖合法与 `invalid-plan.json` 计划、多个基础系统、多个增强源、foundation source 冲突、专项库 enhancer 误用、canonical capability 组合、缺少状态、缺少交互无障碍声明、`rejectedCandidates` 和错误字段类型的 total validation。
4. CLI 行为：覆盖 `--help`、真实换行、JSON 输出、严格 warning 退出码、无效参数、损坏 JSON、stdout/stderr 分流及错误类型计划返回结构化 exit `1`。

所有脚本功能必须先写失败测试，再写最小实现。

### Skill 结构验证

- YAML frontmatter 只包含合法字段，`name` 与目录一致；
- `description` 只描述触发条件，不概括工作流；
- 所有引用文件和脚本路径存在；
- `SKILL.md` 保持为路由层，详细信息确实按需加载；
- 脚本 `--help` 与实际参数一致。

### 场景验证

至少使用以下提示检查触发与行为：

1. “用 React 给我设计一个高级感 SaaS 仪表盘。”——应触发并先形成设计与组件计划。
2. “从 Magic UI 和 Aceternity 里选几个好看的组件做首页。”——应触发，但阻止无原则混用。
3. “修复这个 React reducer 的状态 bug。”——不应仅因出现 React 而触发本 Skill。
4. “现有项目用了 Mantine，帮我优化设置页。”——应保留 Mantine，而不是迁移到 shadcn。
5. “把按钮颜色改成红色。”——若只是明确的一行样式修改，不应强制完整组件选型流程。

## 10. 交付物

最终交付包括：

- 完整的 `.agents/skills/component-driven-frontend/`；
- 六份按需引用的设计与实现规则；
- 三个可直接运行的 Node.js CLI；
- 自动化测试与离线 fixtures；
- 根目录 README，说明安装到项目或个人 Skills 目录的方法、命令示例和扩展新组件源的方式；
- 验证记录，包括测试命令、结构检查和代表性 CLI 输出。

## 11. 验收命令

```bash
node --test .agents/skills/component-driven-frontend/tests/*.test.mjs
node .agents/skills/component-driven-frontend/scripts/inspect-project.mjs --root . --json
node .agents/skills/component-driven-frontend/scripts/query-components.mjs --help
node .agents/skills/component-driven-frontend/scripts/validate-component-plan.mjs --help
```

若本机 Skill 工具链提供 `quick_validate.py`，还应运行对应结构验证。只有上述检查得到新的成功输出后，才能报告实现完成。
