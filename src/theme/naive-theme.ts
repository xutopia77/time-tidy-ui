import type { GlobalThemeOverrides } from 'naive-ui';

// Single source of truth for Naive UI colors. Tailwind @theme tokens are kept
// for utility classes - new colors must be synced on both sides.
export const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#6366f1',
        primaryColorHover: '#4f46e5',
        primaryColorPressed: '#4338ca',
        primaryColorSuppl: '#818cf8',

        bodyColor: '#0a0a0a',
        cardColor: '#141414',
        modalColor: '#141414',
        popoverColor: '#1f1f1f',

        borderColor: '#27272a',
        dividerColor: '#1f1f1f',

        textColorBase: '#fafafa',
        textColor1: '#fafafa',
        textColor2: '#a1a1aa',
        textColor3: '#71717a',
        textColorDisabled: '#52525b',

        // density: tighter than Naive defaults, closer to lap's information density
        fontSize: '13px',
        fontSizeSmall: '12px',
        fontSizeMedium: '13px',
        borderRadius: '8px',
        borderRadiusSmall: '6px',
        heightSmall: '28px',
        heightMedium: '32px',
        heightLarge: '36px',
    },
    Card: { color: '#141414', borderColor: '#27272a', borderRadius: '12px', paddingMedium: '14px 16px' },
    Modal: { color: '#141414', borderRadius: '12px' },
    Button: { borderRadiusMedium: '8px', borderRadiusSmall: '6px' },
    Input: { color: '#141414', colorFocus: '#141414' },
    DataTable: { thColor: '#1f1f1f', tdColor: '#141414', tdColorHover: '#1f1f1f', borderColor: '#27272a' },
    Tree: { nodeTextColor: '#fafafa', nodeColorHover: '#1f1f1f' },
    Tag: { borderRadius: '12px' },
    Message: { color: '#1f1f1f', textColor: '#fafafa' },
};
