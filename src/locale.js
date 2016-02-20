import IntlPolyfill from 'intl';
import areIntlLocalesSupported from 'intl-locales-supported';
import createFormatCache from 'intl-format-cache';
import Lie from 'lie';

import polyglot from 'polyglot';
import utils from 'utils';

const defaultLocale = 'en';

function checkValidLocale(localeName) {
  if (!localeName) {
    return false;
  }

  localeName = localeName.toLowerCase();

  if (locale.available.indexOf(localeName) !== -1) {
    return localeName;
  }

  localeName = localeName.substring(0, 2);

  if (locale.available.indexOf(localeName) !== -1) {
    return localeName;
  }

  return false;
}

const locale = {
  available: [
    'en',
    'fr',
  ],
  data: {
    en: {
      iso: 'en_US',
      firstDayOfWeek: 0,
    },
    fr: {
      iso: 'fr_FR',
      firstDayOfWeek: 1,
    },
  },
  current: null,
  phrases: {},
  numberFormat: null,
  dateTimeFormat: null,
  currencyToString(currency) {
    const amount = locale.numberFormat(this.current, {
      style: 'currency',
      currency: currency,
    }).format(0);

    return amount.replace(/[0,.\s]/g, '');
  },
  setCurrent(localeName) {
    this.current = localeName;
    polyglot.locale(localeName);
    polyglot.extend(this.phrases[localeName]);

    let NumberFormat;
    let DateTimeFormat;

    if (areIntlLocalesSupported(localeName)) {
      NumberFormat = global.Intl.NumberFormat;
      DateTimeFormat = global.Intl.DateTimeFormat;
    } else {
      NumberFormat = IntlPolyfill.NumberFormat;
      DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }

    this.numberFormat = createFormatCache(NumberFormat);
    this.dateTimeFormat = createFormatCache(DateTimeFormat);
  },
  load(localeName) {
    let localePromise;

    // Feature of webpack not available on node
    if (process.env.PLATFORM === 'server' && process.env.NODE_ENV !== 'production') {
      const phrases = eval('require')(`locale/${localeName}.js`);

      localePromise = () => {
        return new Lie((resolve) => {
          resolve(phrases);
        });
      };
    } else {
      const localeRequire = require.context('promise?lie!./locale', false, /^.\/(en|fr).js$/);
      localePromise = localeRequire(`./${localeName}.js`);
    }

    return localePromise().then((phrases) => {
      this.phrases[localeName] = phrases.default;
    });
  },
  getBestLocale(req) {
    let isValidLocale;

    // Server
    if (req && typeof window === 'undefined') {
      isValidLocale = checkValidLocale(req.url.substring(1, 3));

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(req.query.locale);

      if (isValidLocale) {
        return isValidLocale;
      }

      const accepts = req.acceptsLanguages(this.available);

      if (accepts) { // Not false
        return accepts;
      }
    } else {
      isValidLocale = checkValidLocale(window.location.pathname.substring(1, 3));

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(utils.parseUrl('locale'));

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(window.navigator.language);

      if (isValidLocale) {
        return isValidLocale;
      }
    }

    return defaultLocale;
  },
};

export default locale;
