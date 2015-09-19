'use strict';

const IntlPolyfill = require('intl');
const createFormatCache = require('intl-format-cache');

const polyglot = require('polyglot');

function getCurrent() {
  const defaultLocale = 'en';

  const availabled = [
    'en',
    'fr',
  ];

  let language = navigator.language.toLowerCase();

  if (availabled.indexOf(language) !== -1) {
    return language;
  }

  language = language.substring(0, 2);

  if (availabled.indexOf(language) !== -1) {
    return language;
  }

  return defaultLocale;
}

const _current = getCurrent();

polyglot.locale(_current);

const locale = {
  current: _current,
  numberFormat: createFormatCache(IntlPolyfill.NumberFormat),
  dateTimeFormat: createFormatCache(IntlPolyfill.DateTimeFormat),
  currencyToString: function(currency) {
    const amount = locale.numberFormat(_current, {
      style: 'currency',
      currency: currency,
    }).format(0);

    return amount.replace(/[0,.\s]/g, '');
  },
  load: function() {
    const localeRequire = require.context('promise?lie!./locale', false, /^.\/(en|fr).js$/);
    const localePromise = localeRequire('./' + _current + '.js');

    return localePromise().then(function(phrases) {
      polyglot.extend(phrases);
    });
  },
};

module.exports = locale;
