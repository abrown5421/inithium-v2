import { Heading, Text } from '@inithium/ui';
import { CodeBlock } from '../../components/code-block.js';
import { ThemingDocSection } from '../components/theming-doc-section.js';

export const AppFontsDoc = () => (
  <div className="flex flex-col gap-10">
    <ThemingDocSection
      title="Seeded Primary & Secondary Fonts"
      description="Every fresh environment ships with two system fonts, seeded at boot with fixed, well-known asset keys so the CSS that references them never has to change across reseeds. They're exposed to components as the font-primary and font-secondary Tailwind utilities."
    >
      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-6">
        <Heading level={3} font="primary">
          Primary font sample
        </Heading>
        <Heading level={3} font="secondary">
          Secondary font sample
        </Heading>
      </div>
      <CodeBlock
        code={`<Heading level={3} font="primary">Primary font sample</Heading>
<Heading level={3} font="secondary">Secondary font sample</Heading>
<Text font="primary">Body copy can opt into either seeded font too.</Text>`}
      />
    </ThemingDocSection>

    <ThemingDocSection
      title="Architecture & Serving"
      description="Fonts live in the API's own source tree as committed fixtures, get processed through the same ingest pipeline every uploaded asset goes through, and are served back out through a proxy — nothing about globals.css's @font-face rules is environment-specific."
    >
      <Text size="sm">
        1. Source fixtures are committed at{' '}
        <Text as="span" font="mono" size="sm">
          apps/api/src/assets/system-fonts/{'{primary,secondary}'}.ttf
        </Text>
        .
      </Text>
      <Text size="sm">
        2. On boot, <Text as="span" font="mono" size="sm">main.ts</Text> reads both files and calls{' '}
        <Text as="span" font="mono" size="sm">ensureDefaultSystemFont</Text>, which is idempotent and self-healing: it
        skips re-seeding if a matching asset record already exists and its file still resolves on disk, and
        transparently re-seeds if the record is stale (file moved or deleted outside the app).
      </Text>
      <Text size="sm">
        3. The seed call runs through the same{' '}
        <Text as="span" font="mono" size="sm">AssetService.uploadAsset</Text> pipeline as any user upload, which
        converts TTF/OTF to WOFF2 and stores the result at{' '}
        <Text as="span" font="mono" size="sm">system-assets/fonts/&lt;key&gt;.woff2</Text> under the API's file root.
      </Text>
      <Text size="sm">
        4. The Express app mounts the asset router at{' '}
        <Text as="span" font="mono" size="sm">/assets</Text>, each frontend's Vite dev server proxies{' '}
        <Text as="span" font="mono" size="sm">/assets</Text> to the API origin, and{' '}
        <Text as="span" font="mono" size="sm">globals.css</Text> references the fonts by their fixed keys directly.
      </Text>
      <CodeBlock
        language="css"
        code={`@font-face {
  font-family: 'PrimaryFont';
  src: url('/assets/by-key/900e0f9c-97e7-4213-a3cb-82c63e1e8350') format('woff2');
  font-weight: normal;
  font-display: swap;
}`}
      />
    </ThemingDocSection>

    <ThemingDocSection title="Replacement & Customization Workflows">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Text weight="medium">1. Binary replacement (Asset Module)</Text>
          <Text size="sm" color="muted">
            Open the Asset Module, find the existing seeded system font, and use its Replacement File action.
            This overwrites the file at the same key in place, so globals.css's hardcoded @font-face URL keeps
            resolving with zero code changes — the correct way to change a font in a running environment.
            Replacing the .ttf fixture in the repo instead only affects environments that seed fresh: the boot
            seed is idempotent by database record, not by fixture content, so it won't touch an environment
            that has already seeded successfully.
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text weight="medium">2. CMS Asset + Settings Module re-linking</Text>
          <Text size="sm" color="muted">
            This path doesn't apply to fonts today. Admin-facing asset uploads always receive a fresh random
            key — only the internal boot seed can pin the fixed key globals.css depends on — and there is no
            site.font.* Setting anywhere in the app for a newly uploaded font to be linked into. Use path 1
            for fonts; path 2 is the supported workflow for the application logo instead.
          </Text>
        </div>
      </div>
    </ThemingDocSection>
  </div>
);
