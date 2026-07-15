import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

const savedLocale = localStorage.getItem('locale') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export default i18n

export function setLocale(locale: string): void {
  if (i18n.mode === 'legacy') {
    (i18n.global as unknown as { locale: string }).locale = locale
  } else {
    (i18n.global as unknown as { locale: { value: string } }).locale.value = locale
  }
  localStorage.setItem('locale', locale)
}

export function getLocale(): string {
  if (i18n.mode === 'legacy') {
    return (i18n.global as unknown as { locale: string }).locale
  }
  return (i18n.global as unknown as { locale: { value: string } }).locale.value
}