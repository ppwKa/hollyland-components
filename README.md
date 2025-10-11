# Hollyland Components

一个基于 Astro 的组件库，提供可复用的 UI 组件和页面模板。

## 🚀 Project Structure

项目采用 Astro 框架，具有以下目录结构：

```text
hollyland-components/
├── public/                    # 静态资源
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── layouts/              # 页面布局
│   │   └── DefaultLayout.astro
│   ├── pages/                # 页面文件
│   │   ├── index.astro       # 主页（组件展示）
│   │   └── example/          # 组件示例页面
│   │       ├── HighlightSwiper.astro
│   │       └── NavCountDown.astro
│   ├── scripts/              # JavaScript 脚本
│   │   └── pages/            # 页面专用脚本
│   ├── styles/               # 样式文件
│   │   └── pages/            # 页面专用样式
│   └── utils/                # 工具函数
├── dist/                     # 构建输出目录
├── astro.config.mjs          # Astro 配置文件
├── package.json
└── tsconfig.json
```

## 🧞 Commands

所有命令都在项目根目录的终端中运行：


| Command                   | Action                                            |
| :------------------------ | :------------------------------------------------ |
| `npm install`             | 安装依赖包                                        |
| `npm run dev`             | 启动本地开发服务器`localhost:4321`                |
| `npm run build`           | 构建生产版本到`./dist/` 目录                      |
| `npm run preview`         | 本地预览构建结果                                  |
| `npm run astro ...`       | 运行 Astro CLI 命令，如`astro add`, `astro check` |
| `npm run astro -- --help` | 获取 Astro CLI 帮助信息                           |

## 📝 如何新增组件

### 1. 创建组件页面

在 `src/pages/example/` 目录下创建新的 `.astro` 文件：

```astro
---
/**
 * 组件名称和描述
 * 例如：Hollyland Product Card
 * 产品卡片组件
 */

// 引入布局
import DefaultLayout from "../../layouts/DefaultLayout.astro";

// 引入样式
import "../../styles/pages/YourComponent.scss";

// 组件配置数据
const pageTitle = "HL Your Component";
const componentData = {
  // 你的组件数据
};
---

<DefaultLayout pageTitle={pageTitle}>
  <div class="hl-your-component">
    <!-- 你的组件 HTML 结构 -->
    <div class="your-component-container">
      <!-- 组件内容 -->
    </div>
  </div>
</DefaultLayout>

<script>
  import "../../scripts/pages/YourComponent.js";
</script>
```

### 2. 创建样式文件

在 `src/styles/pages/` 目录下创建对应的 `.scss` 文件：

```scss
.hl-your-component {
  // 组件根样式
  padding: 2rem 0;

  .your-component-container {
    // 容器样式
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    // 响应式设计
    @media (max-width: 768px) {
      padding: 0 0.5rem;
    }
  }
}
```

### 3. 创建 JavaScript 脚本

在 `src/scripts/pages/` 目录下创建对应的 `.js` 文件：

```javascript
/**
 * 组件名称和描述
 * 例如：Hollyland Product Card Manager
 * 产品卡片管理器
 */
class YourComponentManager {
  constructor() {
    // 选择器配置
    this.SELECTORS = {
      // 使用组件前缀避免冲突
      yourComponent: '.hl-your-component .your-component-container'
    }

    // 初始化
    this.init();
  }

  /**
   * 初始化组件功能
   */
  init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initAfterDOMLoaded());
    } else {
      this.initAfterDOMLoaded();
    }
  }

  /**
   * DOM 加载完成后的初始化
   */
  initAfterDOMLoaded() {
    this.cacheElements();
    this.initEvents();
  }

  /**
   * 缓存 DOM 元素
   */
  cacheElements() {
    this.elements = {
      yourComponent: document.querySelector(this.SELECTORS.yourComponent)
    };
  }

  /**
   * 初始化事件监听
   */
  initEvents() {
    // 你的事件处理逻辑
  }
}

// 初始化组件管理器
const yourComponentManager = new YourComponentManager();

// 导出管理器实例（如果需要在其他地方使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = YourComponentManager;
}
```

### 4. 组件开发规范

#### 命名规范

- **文件命名**：使用 PascalCase，如 `ProductCard.astro`
- **CSS 类名**：使用 BEM 命名法，如 `.hl-product-card__title`
- **JavaScript 类名**：使用 PascalCase，如 `ProductCardManager`

#### 样式规范

- 使用 SCSS 预处理器
- 组件根类名使用 `.hl-{component-name}` 格式
- 包含响应式设计（至少支持 768px 和 480px 断点）
- 使用 CSS 变量提高可维护性

#### JavaScript 规范

- 使用 ES6+ 语法
- 创建管理器类来封装组件逻辑
- 使用选择器常量避免硬编码
- 包含错误处理和边界情况处理

### 5. 组件测试

1. **本地测试**：运行 `npm run dev` 启动开发服务器
2. **访问组件**：在浏览器中访问 `http://localhost:4321/example/YourComponent`
3. **响应式测试**：测试不同屏幕尺寸下的显示效果
4. **功能测试**：验证所有交互功能正常工作

### 6. 组件文档

为每个组件添加详细的文档注释：

```javascript
/**
 * 组件功能描述
 * 
 * @example
 * // 基本使用
 * const manager = new YourComponentManager();
 * 
 * @param {Object} options - 配置选项
 * @param {string} options.selector - 选择器
 * @param {boolean} options.autoInit - 是否自动初始化
 */
```

## 📦 打包后如何使用组件

当组件开发完成并经过测试后，可以通过以下步骤将组件打包并在其他项目中使用：

### 1. 构建项目

首先运行构建命令生成生产版本：

```bash
npm run build
```

构建完成后，所有文件将输出到 `dist/` 目录中。

### 2. 提取组件文件

在 `dist/` 目录中找到对应的组件文件：

#### 2.1 获取 HTML 内容

1. 打开 `dist/example/YourComponent/index.html`
2. 找到 `<body>` 标签内的内容
3. 复制整个 body 内容作为组件的 HTML 结构

**示例：**
```html
<!-- 从 dist/example/ProductCard/index.html 的 body 中复制 -->
<div class="hl-product-card">
  <div class="product-card-container">
    <h2 class="product-card-title">Featured Products</h2>
    <div class="product-grid">
      <!-- 组件内容 -->
    </div>
  </div>
</div>
```

#### 2.2 获取 CSS 文件

在 `dist/_astro/` 目录下找到以组件名开头的 CSS 文件：

```bash
# 查找组件相关的 CSS 文件
ls dist/_astro/ | grep YourComponent
# 例如：YourComponent.abc123.css
```

**引用方式：**
```html
<link rel="stylesheet" href="path/to/YourComponent.abc123.css">
```

#### 2.3 获取 JavaScript 文件

在 `dist/_astro/` 目录下找到以组件名开头的 JS 文件：

```bash
# 查找组件相关的 JS 文件
ls dist/_astro/ | grep YourComponent
# 例如：YourComponent.def456.js
```

**引用方式：**
```html
<script src="path/to/YourComponent.def456.js"></script>
```

### 3. 完整使用示例

假设我们要使用 ProductCard 组件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 ProductCard 组件</title>
    
    <!-- 引入组件样式 -->
    <link rel="stylesheet" href="path/to/ProductCard.abc123.css">
</head>
<body>
    <!-- 组件 HTML 内容（从 dist/example/ProductCard/index.html 复制） -->
    <div class="hl-product-card">
        <div class="product-card-container">
            <h2 class="product-card-title">Featured Products</h2>
            <div class="product-grid">
                <div class="product-item" data-product-id="1">
                    <div class="product-image">
                        <img src="https://placehold.co/400x300" alt="Hollyland Mars 4K" />
                        <div class="product-badge">New</div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">Hollyland Mars 4K</h3>
                        <div class="product-price">$299</div>
                        <button class="product-btn" data-action="add-to-cart">
                            Add to Cart
                        </button>
                    </div>
                </div>
                <!-- 更多产品项... -->
            </div>
        </div>
    </div>

    <!-- 引入组件脚本 -->
    <script src="path/to/ProductCard.def456.js"></script>
</body>
</html>
```

### 4. 自动化提取脚本

为了方便提取组件文件，可以创建一个自动化脚本：

创建 `scripts/extract-component.js`：

```javascript
const fs = require('fs');
const path = require('path');

/**
 * 提取组件文件到独立目录
 * @param {string} componentName - 组件名称
 */
function extractComponent(componentName) {
  const distDir = path.join(__dirname, '../dist');
  const outputDir = path.join(__dirname, '../extracted-components', componentName);
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 1. 提取 HTML 内容
    const htmlFile = path.join(distDir, 'example', componentName, 'index.html');
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // 提取 body 内容
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const bodyContent = bodyMatch[1].trim();
      fs.writeFileSync(path.join(outputDir, 'component.html'), bodyContent);
      console.log(`✅ HTML 内容已提取到: ${path.join(outputDir, 'component.html')}`);
    }

    // 2. 查找并复制 CSS 文件
    const astroDir = path.join(distDir, '_astro');
    const cssFiles = fs.readdirSync(astroDir).filter(file => 
      file.startsWith(componentName) && file.endsWith('.css')
    );
    
    if (cssFiles.length > 0) {
      const cssFile = cssFiles[0];
      fs.copyFileSync(
        path.join(astroDir, cssFile),
        path.join(outputDir, 'component.css')
      );
      console.log(`✅ CSS 文件已复制到: ${path.join(outputDir, 'component.css')}`);
    }

    // 3. 查找并复制 JS 文件
    const jsFiles = fs.readdirSync(astroDir).filter(file => 
      file.startsWith(componentName) && file.endsWith('.js')
    );
    
    if (jsFiles.length > 0) {
      const jsFile = jsFiles[0];
      fs.copyFileSync(
        path.join(astroDir, jsFile),
        path.join(outputDir, 'component.js')
      );
      console.log(`✅ JS 文件已复制到: ${path.join(outputDir, 'component.js')}`);
    }

    // 4. 生成使用示例
    const exampleContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} 组件示例</title>
    <link rel="stylesheet" href="component.css">
</head>
<body>
    <!-- 组件 HTML 内容 -->
    ${bodyMatch ? bodyMatch[1].trim() : '<!-- 请手动添加组件 HTML 内容 -->'}
    
    <script src="component.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, 'example.html'), exampleContent);
    console.log(`✅ 使用示例已生成: ${path.join(outputDir, 'example.html')}`);

  } catch (error) {
    console.error('❌ 提取组件失败:', error.message);
  }
}

// 从命令行参数获取组件名称
const componentName = process.argv[2];
if (!componentName) {
  console.error('请提供组件名称: node extract-component.js ComponentName');
  process.exit(1);
}

extractComponent(componentName);
```

**使用方法：**
```bash
# 提取 ProductCard 组件
node scripts/extract-component.js ProductCard

# 提取 HighlightSwiper 组件
node scripts/extract-component.js HighlightSwiper
```

### 5. 组件使用注意事项

1. **文件路径**：确保 CSS 和 JS 文件的路径正确
2. **依赖关系**：某些组件可能依赖第三方库（如 Swiper），需要额外引入
3. **数据绑定**：静态 HTML 需要手动替换动态数据
4. **样式隔离**：建议在容器元素上添加唯一类名避免样式冲突

### 6. 版本管理

建议为每个组件版本创建标签：

```bash
# 构建并标记版本
npm run build
git tag -a v1.0.0 -m "ProductCard component v1.0.0"
git push origin v1.0.0
```

## 📚 相关资源

- [Astro 官方文档](https://docs.astro.build/)
- [SCSS 官方文档](https://sass-lang.com/)
- [BEM 命名规范](https://getbem.com/)
- [WCAG 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
