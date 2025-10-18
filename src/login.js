#!/usr/bin/env node

const puppeteer = require('puppeteer');

function parseArguments(argv) {
  const args = argv.slice(2);
  const result = {
    url: undefined,
    username: undefined,
    password: undefined,
    usernameSelector: '#username',
    passwordSelector: '#password',
    submitSelector: 'button[type="submit"]',
    waitForNavigation: true,
    headless: 'new',
    screenshot: undefined,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      switch (key) {
        case 'url':
        case 'username':
        case 'password':
        case 'username-selector':
        case 'password-selector':
        case 'submit-selector':
        case 'screenshot':
          if (!next || next.startsWith('--')) {
            throw new Error(`Missing value for --${key}`);
          }
          i += 1;
          switch (key) {
            case 'url':
              result.url = next;
              break;
            case 'username':
              result.username = next;
              break;
            case 'password':
              result.password = next;
              break;
            case 'username-selector':
              result.usernameSelector = next;
              break;
            case 'password-selector':
              result.passwordSelector = next;
              break;
            case 'submit-selector':
              result.submitSelector = next;
              break;
            case 'screenshot':
              result.screenshot = next;
              break;
            default:
              break;
          }
          break;
        case 'no-wait':
          result.waitForNavigation = false;
          break;
        case 'headful':
          result.headless = false;
          break;
        default:
          throw new Error(`Unknown argument: ${arg}`);
      }
    } else {
      throw new Error(`Unexpected argument format: ${arg}`);
    }
  }

  if (!result.url) {
    throw new Error('Missing required argument: --url');
  }
  if (!result.username) {
    throw new Error('Missing required argument: --username');
  }
  if (!result.password) {
    throw new Error('Missing required argument: --password');
  }

  return result;
}

async function loginWithPuppeteer(options) {
  const {
    url,
    username,
    password,
    usernameSelector,
    passwordSelector,
    submitSelector,
    waitForNavigation,
    headless,
    screenshot,
  } = options;

  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector(usernameSelector, { timeout: 10000 });
    await page.type(usernameSelector, username, { delay: 50 });

    await page.waitForSelector(passwordSelector, { timeout: 10000 });
    await page.type(passwordSelector, password, { delay: 50 });

    await Promise.all([
      page.click(submitSelector),
      waitForNavigation ? page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}) : null,
    ].filter(Boolean));

    if (screenshot) {
      await page.screenshot({ path: screenshot, fullPage: true });
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  try {
    const options = parseArguments(process.argv);
    await loginWithPuppeteer(options);
    console.log('Inicio de sesión completado.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArguments,
  loginWithPuppeteer,
};
