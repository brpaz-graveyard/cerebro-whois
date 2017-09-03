'use strict';

const PLUGIN_REGEX = /whois\s(.*)/;
const PLUGIN_KEYWORD = 'whois';
const LOOKUP_FLAG = "-l";
const WHOIS_LOOKUP_URL = 'https://www.whois.com/whois/%domain%';

const icon = require('../assets/icon.png');

const axios = require('axios');
const cheerio = require('cheerio');
const debounce = require('debounce');

const { Loading } = require('cerebro-ui');
const Preview = require('./Preview/preview');

/**
 * Plugin entry point
 */
const plugin = ({ term, display, actions, hide}) => {

  const match = term.match(PLUGIN_REGEX);

  if (match) {

    let termParts = match[1].split(' ');

    // Whois domain lookup
    if (termParts[0] === LOOKUP_FLAG) {
      let domain = termParts[1];

      debounce(
        doWhoisLookup(domain, display, actions, hide),
        300
      );

    } else {

      display({
        id: 'whois',
        title: `Whois lookup for domain ${termParts[0]}`,
        icon: icon,
        onSelect: (event) => {
          actions.replaceTerm(PLUGIN_KEYWORD + " " + LOOKUP_FLAG + " " + termParts[0])
          event.preventDefault();
        }
      });
    }
  }
}

/**
 * Show loading message
 * @param {string} domain 
 * @param {object} display 
 */
const showLoading = (domain, display) => {
  display({
    id: 'loading',
    title: `Doing whois lookup for domain ${domain}`,
    icon: icon,
    getPreview: () => {
      return <Loading />
    }
  });
}

/**
 * Does a whois lookup for the specified domain and display the results.
 * @param {string} domain The domain to lookup
 * @param {object} display 
 * @param {object} actions
 * @param {object} hide
 */
const doWhoisLookup = (domain, display, actions, hide) => {

  showLoading(domain, display);

  axios.get(WHOIS_LOOKUP_URL.replace('%domain%', domain)).then((response) => {

    hide("loading");

    const $ = cheerio.load(response.data);
    let domainInfo = $('.whois_main_column .df-block').html();

    display({
      title: `Whois information for ${domain}`,
      icon: icon,
      getPreview: () => {
        return <Preview domain={domain} info={domainInfo} />
      },
      onSelect: (event) => {
        actions.open(WHOIS_LOOKUP_URL.replace('%domain%', domain));
      }
    });

  }).catch((error) => {
    hide("loading");
    display({
      title: `Error getting whois information for domain ${domain}`,
      icon: icon
    });
  });

}
module.exports = {
  fn: plugin,
  name: 'Whois Domain lookup',
  keyword: PLUGIN_KEYWORD,
  icon,
};