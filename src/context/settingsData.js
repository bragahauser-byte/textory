export const TEXT_SIZES = [
  { fontSize: 16, lineHeight: 24 },
  { fontSize: 20, lineHeight: 28 },
  { fontSize: 24, lineHeight: 32 },
  { fontSize: 28, lineHeight: 36 },
  { fontSize: 32, lineHeight: 40 },
]

export const TEXT_FONTS = {
  classico: '"Source Serif 4", serif',
  moderno: 'Inter, sans-serif',
  editorial: 'Lora, serif',
  confortavel: 'Literata, serif',
}

export const FONT_GROUPS = {
  latino: {
    styles: ['classico', 'moderno', 'editorial', 'confortavel'],
    fonts: TEXT_FONTS,
    lineHeightMultiplier: 1,
    letterSpacing: '0px',
  },
  arabe: {
    styles: ['classico', 'moderno', 'editorial', 'confortavel'],
    fonts: { classico: 'Amiri, serif', moderno: 'Cairo, sans-serif', editorial: 'Tajawal, sans-serif', confortavel: '"Noto Naskh Arabic", serif' },
    lineHeightMultiplier: 1.18,
    letterSpacing: '0px',
  },
  chines: {
    styles: ['sans', 'serif'],
    fonts: { sans: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif', serif: '"Noto Serif SC", "Songti SC", serif' },
    lineHeightMultiplier: 1.75,
    letterSpacing: '0.03em',
  },
  japones: {
    styles: ['sans', 'serif'],
    fonts: { sans: '"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif', serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif' },
    lineHeightMultiplier: 1.75,
    letterSpacing: '0.03em',
  },
  coreano: {
    styles: ['sans', 'serif'],
    fonts: { sans: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif', serif: '"Noto Serif KR", "Apple SD Gothic Neo", serif' },
    lineHeightMultiplier: 1.75,
    letterSpacing: '0.03em',
  },
}

export const LANGUAGE_FONT_GROUP = {
  portugues: 'latino', ingles: 'latino', espanhol: 'latino', frances: 'latino', alemao: 'latino',
  arabe: 'arabe', chines: 'chines', japones: 'japones', coreano: 'coreano',
}

export const READING_MODES = {
  claro: { background: '#F5F5F5', primary: '#292929', secondary: '#555555' },
  papel: { background: '#F4EEDC', primary: '#342D23', secondary: '#665B4A' },
  suave: { background: '#E9E9E9', primary: '#303030', secondary: '#5D5D5D' },
  escuro: { background: '#202020', primary: '#F2F2F2', secondary: '#BDBDBD' },
}
