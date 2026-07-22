import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n, localeNames } from './i18n';

// Builds the fumadocs-ui i18n provider props (locale list + translated UI
// strings). `displayName` drives the label shown in the language switcher.
// English uses fumadocs' built-in defaults; Khmer overrides the common UI
// chrome so search, TOC, pagination, etc. read in ខ្មែរ too.
export const { provider } = defineI18nUI(i18n, {
  en: {
    displayName: localeNames.en,
  },
  km: {
    displayName: localeNames.km,
    'Search(search dialog)': 'ស្វែងរក',
    'Search(search trigger)': 'ស្វែងរក',
    'No results found(search dialog)': 'រកមិនឃើញលទ្ធផល',
    'On this page(table of contents)': 'នៅលើទំព័រនេះ',
    'No Headings(table of contents)': 'គ្មានចំណងជើង',
    'Table of Contents(inline table of contents)': 'តារាងមាតិកា',
    'Last updated on(page footer)': 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ',
    'Choose a language(language switcher)': 'ជ្រើសរើសភាសា',
    'Next Page(pagination)': 'ទំព័របន្ទាប់',
    'Previous Page(pagination)': 'ទំព័រមុន',
    'Edit on GitHub(edit page)': 'កែសម្រួលនៅ GitHub',
    'Toggle Theme(theme switcher)(aria-label)': 'ប្តូររូបរាង',
    'Back to Home(404 page)': 'ត្រឡប់ទៅទំព័រដើម',
    'Page Not Found(404 page)': 'រកមិនឃើញទំព័រ',
  },
});