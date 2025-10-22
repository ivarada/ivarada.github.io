DO NOT PUBLISH

### Varada's GitHub Readme
https://github.com/jekyll/minima/blob/master/_includes/footer.html

```markdown
# external-links plugin + fallback for ivarada.github.com

This repository addition adds a Jekyll plugin and a client-side fallback to make external links open in a new tab/window and apply `rel="noopener noreferrer"`.

Files added
- `_plugins/external_links.rb` — server-side Jekyll plugin (requires `nokogiri`)
- `assets/js/external-links.js` — client-side fallback (works without custom plugins)
- `Gemfile` — adds `nokogiri` (and Jekyll)
- `.github/workflows/build-and-deploy.yml` — optional workflow to build site and deploy to `gh-pages`

Important note about GitHub Pages:
- GitHub Pages' hosted build does NOT allow arbitrary Ruby plugins. If you want to use the `_plugins/external_links.rb` plugin on your published site, you must build the site yourself and push the generated static site to the branch GitHub Pages serves (common approaches below).
- If you prefer not to change your build/deploy pipeline, use the client-side JS fallback (works immediately when added to your layouts).

How to use (plugin + Actions, recommended if you want server-side changes)
1. Add the plugin `_plugins/external_links.rb` to your repo.
2. Add the `Gemfile`.
3. Add the GitHub Actions workflow `.github/workflows/build-and-deploy.yml`.
4. Ensure GitHub Pages is configured to serve the `gh-pages` branch (or change the workflow to publish to whichever branch you prefer and update Pages settings).
5. On push to `main`, the workflow builds the site and deploys the generated site to `gh-pages`.

How to use (client-side only, simplest)
1. Add `assets/js/external-links.js` to your repo.
2. Include it in your site layout (e.g., in `_layouts/default.html` before </body>):
   ```html
   <script src="/assets/js/external-links.js" defer></script>
   ```
3. Publish normally — no plugin or Actions needed.

Notes
- The server-side plugin uses Nokogiri to reliably parse and update HTML. Use the GitHub Actions workflow (or build locally) to run it.
- Both approaches add `rel="noopener noreferrer"` for security.
- Both approaches attempt to avoid altering mailto:, javascript:, or anchor links, and try to detect same-host links as internal.

If you want, I can:
- Open a PR to your repository adding these files.
- Customize the GitHub Actions workflow to publish back to `main` (or `/docs`) instead of `gh-pages`.
- Make the plugin more strict/loose about what counts as "external" (ex: allow a whitelist of domains).
```
