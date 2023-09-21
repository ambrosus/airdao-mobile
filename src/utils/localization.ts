import { Language, LanguageCode } from '@appTypes';

const languageToCode = (lang: Language): LanguageCode => {
  switch (lang) {
    case 'English':
      return 'en';
    case 'Arabic':
      return 'ar';
    case 'Chinese':
      return 'zh';
    case 'Hindi':
      return 'hi';
    case 'Portuguese':
      return 'pt';
    case 'Russian':
      return 'ru';
    case 'Spanish':
      return 'es';
    case 'Turkish':
      return 'tr';
    default:
      return 'en';
  }
};

const languageFromCode = (code: LanguageCode): Language => {
  switch (code) {
    case 'en':
      return 'English';
    case 'ar':
      return 'Arabic';
    case 'zh':
      return 'Chinese';
    case 'hi':
      return 'Hindi';
    case 'pt':
      return 'Portuguese';
    case 'ru':
      return 'Russian';
    case 'es':
      return 'Spanish';
    case 'tr':
      return 'Turkish';
    default:
      return 'English';
  }
};

export const LocalizationUtils = { languageToCode, languageFromCode };
