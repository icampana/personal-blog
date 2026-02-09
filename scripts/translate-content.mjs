import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { glob } from 'glob';

dotenv.config();

// Configuration
const SOURCE_LANG = 'es';
const TARGET_LANGUAGES = ['en', 'pt']; // Translate to both English and Portuguese
const CONTENT_DIRS = [
  'src/content/posts',
  'src/content/pages',
  'src/content/projects',
  'src/content/videos',
];
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY is missing in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
// Using Gemini 2.5 Flash
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Date filter: only translate content from 2022 onwards
const DATE_CUTOFF = new Date('2022-01-01');

// Prompts for different languages
const PROMPTS = {
  en: `
    Role: Senior Technical Translator
    Task: Translate the following Markdown content from Spanish to English

    Strict Rules:
    1. PRESERVE Frontmatter: Only translate 'title' and 'description' values. Keep all keys exactly as is.
    2. CODE BLOCKS: Do NOT translate content inside \`\`\` blocks or inline code.
    3. TERMINOLOGY: Use standard industry terms (Stack, Deployment, Pipeline, CI/CD, etc).
    4. TONE: Professional, "Senior Engineer" voice.
    5. FORMAT: Return ONLY the raw Markdown content. No wrapper text, no explanations.
    6. YAML FORMAT: Ensure frontmatter is valid YAML. IMPORTANT: If the title contains a colon (:), you MUST wrap the title in double quotes. Example: title: "My Title: Subtitle"

    Input Content:
  `,
  pt: `
    Role: Senior Technical Translator (Brazilian Portuguese)
    Task: Translate the following Markdown content from Spanish to Brazilian Portuguese

    Strict Rules:
    1. PRESERVE Frontmatter: Only translate 'title' and 'description' values. Keep all keys exactly as is.
    2. CODE BLOCKS: Do NOT translate content inside \`\`\` blocks or inline code.
    3. TERMINOLOGY: Use standard Brazilian Portuguese tech terms (banco de dados, implementação, lançamento, etc).
    4. TONE: Professional, "Senior Engineer" voice.
    5. FORMAT: Return ONLY the raw Markdown content. No wrapper text, no explanations.
    6. YAML FORMAT: Ensure frontmatter is valid YAML. IMPORTANT: If the title contains a colon (:), you MUST wrap the title in double quotes. Example: title: "My Title: Subtitle"

    Input Content:
  `,
};

async function translateFile(filePath, targetLang) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Check if post is recent enough (2022 onwards)
    // EXCEPTION: Always translate pages and projects regardless of date
    const isPage = filePath.includes('src/content/pages');
    const isProject = filePath.includes('src/content/projects');
    
    if (data.date && !isPage && !isProject) {
      const postDate = new Date(data.date);
      if (postDate < DATE_CUTOFF) {
        console.log(
          `⏭️  Skipping (pre-2022): ${path.basename(filePath)}`,
        );
        return;
      }
    }

    // Generate target path
    const targetPath = filePath.replace(/\.md$/, `.${targetLang}.md`);

    // Check if translation already exists
    try {
      await fs.access(targetPath);
      console.log(`⏭️  Skipping existing: ${path.basename(targetPath)}`);
      return;
    } catch {
      // File doesn't exist, proceed to translate
    }

    console.log(`🤖 Translating to ${targetLang}: ${path.basename(filePath)}...`);

    const prompt = `${PROMPTS[targetLang]}\n\n${fileContent}`;

    try {
      const result = await model.generateContent(prompt);
      const translatedContent = result.response.text();

      // Validate that we got content back
      if (!translatedContent || translatedContent.length < 10) {
        console.error(
          `❌ Translation too short or empty for ${path.basename(filePath)}`,
        );
        return;
      }

      // Ensure directory exists
      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      // Write translated content
      await fs.writeFile(targetPath, translatedContent);

      console.log(`✅ Generated: ${path.basename(targetPath)}`);
    } catch (error) {
      console.error(
        `❌ Failed to translate ${path.basename(filePath)} to ${targetLang}:`,
        error.message,
      );
      if (error.response) {
        console.error('API Response:', error.response);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

async function processDirectory(dir) {
  try {
    // Find all .md files (excluding .en.md and .pt.md)
    const files = await glob(`${dir}/**/*.md`, {
      ignore: ['**/*.en.md', '**/*.pt.md'],
    });

    console.log(`📂 Found ${files.length} source files in ${dir}`);

    let processed = 0;
    let skipped = 0;

    for (const file of files) {
      // Only process non-language-specific files (Spanish originals)
      if (!file.match(/\.(en|pt)\.md$/i)) {
        for (const targetLang of TARGET_LANGUAGES) {
          await translateFile(file, targetLang);
        }
        processed++;
      } else {
        skipped++;
      }
    }

    console.log(
      `📊 ${dir}: ${processed} processed, ${skipped} skipped (already translated)`,
    );
  } catch (error) {
    console.error(`❌ Error processing directory ${dir}:`, error.message);
  }
}

// Main execution
(async () => {
  console.log('🚀 Starting translation process...');
  console.log(
    `📅 Translating content from ${DATE_CUTOFF.getFullYear()} onwards`,
  );
  console.log(`🌍 Target languages: ${TARGET_LANGUAGES.join(', ')}`);
  console.log('');

  let totalProcessed = 0;

  for (const dir of CONTENT_DIRS) {
    await processDirectory(dir);
  }

  console.log('');
  console.log('✅ Translation process completed!');
})();
