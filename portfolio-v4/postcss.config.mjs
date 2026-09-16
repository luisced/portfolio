/**
 * The only place breakpoints are defined. Components write `@media (--md)`;
 * this plugin expands the token. scripts/check-i18n.mjs rejects raw px/em queries.
 */
export const customMedia = {
  '--sm': '(width >= 30em)', // 480px
  '--md': '(width >= 48em)', // 768px
  '--lg': '(width >= 64em)', // 1024px
  '--xl': '(width >= 90em)', // 1440px
  '--pointer': '(hover: hover) and (pointer: fine)',
  '--motion-ok': '(prefers-reduced-motion: no-preference)',
  '--motion-reduce': '(prefers-reduced-motion: reduce)',
};

const expandCustomMedia = () => ({
  postcssPlugin: 'expand-custom-media',
  AtRule: {
    media(rule) {
      if (!rule.params.includes('(--')) return;
      rule.params = rule.params.replace(/\(\s*(--[\w-]+)\s*\)/g, (whole, name) => {
        const value = customMedia[name];
        if (!value) throw rule.error(`Unknown custom media ${name}`);
        return value;
      });
    },
  },
});
expandCustomMedia.postcss = true;

export default { plugins: [expandCustomMedia()] };
