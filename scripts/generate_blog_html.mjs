import fs from 'fs/promises';

async function main() {
  const blogPath = 'blog.html';
  const postsDir = 'posts';

  // Lee todos los archivos de la carpeta posts
  const files = await fs.readdir(postsDir);
  const cards = [];

  for (const file of files) {
    if (file.endsWith('.html')) {
      const content = await fs.readFile(`${postsDir}/${file}`, 'utf-8');
      cards.push(content.trim());
    }
  }

  // Lee blog.html
  let blogContent = await fs.readFile(blogPath, 'utf-8');

  // Inserta las tarjetas en el marcador
  const marker = '<!-- BLOG_ENTRIES_MARKER -->';
  const htmlCards = cards.reverse().join('\n\n');
  blogContent = blogContent.replace(
    new RegExp(`${marker}[\\s\\S]*?<\/div>`),
    `${marker}\n${htmlCards}\n</div>`
  );

  // Escribe el nuevo blog.html
  await fs.writeFile(blogPath, blogContent);
  console.log('blog.html actualizado.');
}

main().catch(console.error);
