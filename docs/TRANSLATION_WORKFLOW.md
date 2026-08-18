# Translation Workflow

This project supports multilanguage content (Spanish, English, Portuguese, French) using a file-based approach with automated translation via Gemini AI.

## Architecture

- **Default Language**: Spanish (`es`) - Source of truth.
- **Supported Languages**: English (`en`), Portuguese (`pt`), French (`fr`).
- **File Structure** (per-locale directories, one dir per content type):
  - Spanish (Original): `content/posts/es/my-post.md`
  - English (Generated): `content/posts/en/my-post.md`
  - Portuguese (Generated): `content/posts/pt/my-post.md`
  - French (Generated): `content/posts/fr/my-post.md`
- **Locale is derived from the first path segment** (`es/`, `en/`, `pt/`, `fr/`) — not a filename suffix. The same layout applies to `src/content/pages`, `src/content/projects`, and `src/content/videos`.
- **Routing**:
  - Spanish: `/posts/my-post`
  - English: `/en/posts/my-post`
  - Portuguese: `/pt/posts/my-post`
  - French: `/fr/posts/my-post`

## How to Translate Content

We use a custom script `scripts/translate-content.mjs` powered by Google's Gemini 2.5 Flash model to automate translations.

### Prerequisites

1.  Get a Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Add it to your `.env` file:
    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

### Commands

Run the following commands in your terminal:

-   **Translate everything** (skips already translated files):
    ```bash
    pnpm run translate
    ```

-   **Translate only to English**:
    ```bash
    pnpm run translate:en
    ```

-   **Translate only to Portuguese**:
    ```bash
    pnpm run translate:pt
    ```

-   **Translate only to French**:
    ```bash
    pnpm run translate:fr
    ```

### How it Works

1.  The script scans the Spanish source dirs: `src/content/posts/es`, `src/content/pages/es`, `src/content/projects/es`, and `src/content/videos/es`.
2.  For each `.md` source it looks for the target file (e.g. `posts/en/my-post.md`) and skips it if it already exists.
3.  It sends the content to Gemini API with a specific prompt to translate frontmatter and markdown body while preserving structure.
4.  It saves the translated file into the target locale dir (`en|pt|fr/<slug>.md`).

## CMS Integration (Keystatic)

-   **Editing**: You only edit the **Spanish** versions in Keystatic (collections point at the `es/` dirs only; the admin lives at `/keystatic` in dev).
-   **Visibility**: The CMS only exposes `es/` content, so generated translations can't be accidentally edited.
-   **Workflow**:
    1.  Write/Edit post in Spanish via Keystatic.
    2.  Save changes.
    3.  Run `pnpm run translate` locally or in CI/CD to generate translations.

## Manual Overrides

If you need to manually correct a translation:
1.  Open the specific file (e.g., `src/content/posts/en/my-post.md`).
2.  Edit the text.
3.  **Note**: If you delete the file, the translation script will regenerate it from the Spanish source on the next run.

## Troubleshooting

-   **Build Errors**: If a translation fails (e.g., invalid YAML), delete the generated file and run the script again.
-   **Missing Translations**: Ensure the source file is a valid `.md` file in an `es/` dir and not excluded by the script (currently filters for content from 2022 onwards).
