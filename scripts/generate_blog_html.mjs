import fs from 'fs/promises';
import path from 'path';

async function main() {
  const blogPath = 'blog.html';
  const postsDir = 'posts';

  let blogHtml = await fs.readFile(blogPath, 'utf-8');

  // Mostrar si encuentra el marcador
  if (!blogHtml.includes('<!-- BLOG_ENTRIES_MARKER -->')) {
    console.error('❌ No se encontró el marcador en blog.html');
    return;
  }

  // Leer archivos en la carpeta posts
  let postFiles;
  try {
    postFiles = await fs.readdir(postsDir);
  } catch (err) {
    console.error(`❌ Error leyendo la carpeta ${postsDir}:`, err.message);
    return;
  }

  console.log(`📂 Archivos encontrados en "${postsDir}":`, postFiles);

  const articlesHtml = [];

  for (const file of postFiles) {
    if (!file.endsWith('.html')) continue;

    const filePath = path.join(postsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // Extraer título y primer párrafo como resumen
    const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
    const paragraphMatch = content.match(/<p>(.*?)<\/p>/);

    if (titleMatch && paragraphMatch) {
      const articleHtml = `
        <div class="article-card" onclick="window.location.href='posts/${file}'">
          <div class="article-image">
            🤖
          </div>
          <div class="article-content">
            <div class="article-meta">Publicado en 2025 • 3 min de lectura</div>
            <h3 class="article-title">${titleMatch[1]}</h3>
            <p class="article-excerpt">${paragraphMatch[1]}</p>
            <a href="posts/${file}" class="article-link">Leer más →</a>
          </div>
        </div>`;
      articlesHtml.push(articleHtml);
    } else {
      console.warn(`⚠️ No se encontró <h1> o <p> en ${file}`);
    }
  }

  // Mostrar cuántos artículos válidos se encontraron
  console.log(`🧩 Artículos válidos encontrados: ${articlesHtml.length}`);

  // Reemplazar el marcador
  const newHtml = blogHtml.replace(
    '<!-- BLOG_ENTRIES_MARKER -->',
    articlesHtml.join('\n') + '\n<!-- BLOG_ENTRIES_MARKER -->'
  );

  await fs.writeFile(blogPath, newHtml, 'utf-8');
  console.log(`✅ blog.html actualizado con ${articlesHtml.length} artículo(s).`);
}

main();
