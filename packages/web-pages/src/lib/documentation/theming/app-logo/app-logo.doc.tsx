import { Text } from '@inithium/ui';
import { CodeBlock } from '../../components/code-block.js';
import { ThemingDocSection } from '../components/theming-doc-section.js';

export const AppLogoDoc = () => (
  <div className="flex flex-col gap-10">
    <ThemingDocSection
      title="Seeded Primary Logo"
      description="Every fresh environment ships with a default logo, seeded at boot with a fixed asset key alongside the two system fonts. Unlike fonts, the logo isn't hardcoded into any CSS — it's wired through a normal site.logo Setting, which is what Navbar's LogoSlot in both apps/web and apps/cms actually reads."
    >
      <CodeBlock
        code={`const { data: settingsData } = useReadAllSettingsQuery();
const settingsMap = extractSettingsMap(settingsData);
const logoUrl = typeof settingsMap['site.logo'] === 'string' ? settingsMap['site.logo'] : undefined;
const siteLogo = logoUrl ? { src: resolveAssetUrl(logoUrl), alt: siteName } : undefined;

<Navbar logo={siteLogo} title={siteName} />`}
      />
    </ThemingDocSection>

    <ThemingDocSection
      title="Architecture & Serving"
      description="The logo asset and the setting that points at it are seeded independently, both idempotently, both from ensureDefaultSystemLogo/ensureDefaultSiteLogo alongside the existing font and theme seeds in main.ts."
    >
      <Text size="sm">
        1. The source fixture is committed at{' '}
        <Text as="span" font="mono" size="sm">apps/api/src/assets/system-logo/primary-logo.png</Text>.
      </Text>
      <Text size="sm">
        2. On boot, <Text as="span" font="mono" size="sm">ensureDefaultSystemLogo</Text> uploads it through the
        same <Text as="span" font="mono" size="sm">AssetService.uploadAsset</Text> pipeline every image goes
        through — optimized to WebP and stored under{' '}
        <Text as="span" font="mono" size="sm">system-assets/images/&lt;key&gt;.webp</Text> — using the same
        fixed-key, self-healing idempotency check as the seeded fonts.
      </Text>
      <Text size="sm">
        3. <Text as="span" font="mono" size="sm">ensureDefaultSiteLogo</Text> then seeds the{' '}
        <Text as="span" font="mono" size="sm">site.logo</Text> Setting — only if it doesn't already exist — with
        value <Text as="span" font="mono" size="sm">/assets/by-key/&lt;key&gt;</Text>, the same
        domain-independent asset proxy path format <Text as="span" font="mono" size="sm">site.theme</Text> and
        every other asset-backed Setting use.
      </Text>
      <Text size="sm">
        4. Serving is identical to fonts: the Express{' '}
        <Text as="span" font="mono" size="sm">/assets</Text> router, proxied in dev by each app's Vite config,
        with <Text as="span" font="mono" size="sm">resolveAssetUrl</Text> resolving the stored relative path
        against whichever API origin is active at render time.
      </Text>
      <CodeBlock
        language="ts"
        code={`export const PRIMARY_SYSTEM_LOGO_KEY = 'a2231849-e571-4d82-b039-b3e5993fa3c5';

const primaryLogoSeedResult = await ensureDefaultSystemLogo(assetCollection.service, {
  key: PRIMARY_SYSTEM_LOGO_KEY,
  originalName: 'PrimaryLogo.png',
  mimeType: 'image/png',
  fileContentBase64: primaryLogoBuffer.toString('base64')
});

const siteLogoSeedResult = await ensureDefaultSiteLogo(settingCollection.service);`}
      />
    </ThemingDocSection>

    <ThemingDocSection title="Replacement & Customization Workflows">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Text weight="medium">1. Binary replacement (Asset Module)</Text>
          <Text size="sm" color="muted">
            Open the Asset Module, find the seeded system logo, and use its Replacement File action to update
            the underlying image in place. The asset keeps its key, so the existing site.logo Setting keeps
            resolving to it — no change needed in the Settings Module.
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text weight="medium">2. CMS Asset + Settings Module re-linking</Text>
          <Text size="sm" color="muted">
            Delete the seeded logo asset and upload a brand-new one via the Asset Module — it will get a fresh,
            random key. Then open the site.logo Setting in the Settings Module, where SettingValueEditor
            recognizes it as an asset-typed field (its stored value already matches the /assets/by-key/&lt;key&gt;
            pattern) and lets you re-pick it via the Asset Picker, scoped to the images category. Save the
            Setting to complete the swap.
          </Text>
        </div>
      </div>
    </ThemingDocSection>
  </div>
);
