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

    // 5. 生成 README 文件
    const readmeContent = `# ${componentName} 组件

## 文件说明

- \`component.html\` - 组件的 HTML 结构
- \`component.css\` - 组件的样式文件
- \`component.js\` - 组件的 JavaScript 逻辑
- \`example.html\` - 完整的使用示例

## 使用方法

1. 将 \`component.html\` 中的内容复制到你的页面中
2. 引入 \`component.css\` 样式文件
3. 引入 \`component.js\` 脚本文件

## 示例

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 ${componentName} 组件</title>
    <link rel="stylesheet" href="component.css">
</head>
<body>
    <!-- 在这里粘贴 component.html 的内容 -->
    <script src="component.js"></script>
</body>
</html>
\`\`\`

## 注意事项

1. 确保文件路径正确
2. 某些组件可能需要额外的依赖库
3. 根据实际需求修改数据内容
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
    console.log(`✅ README 文件已生成: ${path.join(outputDir, 'README.md')}`);

  } catch (error) {
    console.error('❌ 提取组件失败:', error.message);
  }
}

// 从命令行参数获取组件名称
const componentName = process.argv[2];
if (!componentName) {
  console.error('请提供组件名称: node extract-component.js ComponentName');
  console.log('例如: node extract-component.js ProductCard');
  process.exit(1);
}

extractComponent(componentName);
