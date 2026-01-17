#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { generate, list, getTypes } = require('../src/generator');

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
  licenseme - generate LICENSE files. no cap.

  Usage:
    licenseme [license] [options]

  Licenses:
    mit         MIT License (default)
    apache      Apache License 2.0
    isc         ISC License
    bsd3        BSD 3-Clause License
    unlicense   The Unlicense

  Options:
    -n, --name    Author name (default: "Your Name")
    -y, --year    Year (default: current year)
    --stdout      Print to stdout instead of file
    -l, --list    List all available licenses
    -h, --help    Show this help

  Examples:
    licenseme mit
    licenseme apache -n "ACME Inc"
    licenseme isc --stdout

  Docs:    https://bruh.tools/licenseme
  Issues:  https://github.com/bruh-tools/licenseme/issues

  bruh.tools - no cap, fr fr
`);
}

function parseArgs(args) {
  const opts = { type: 'mit', name: 'Your Name', year: new Date().getFullYear(), stdout: false };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-h' || arg === '--help') {
      showHelp();
      process.exit(0);
    }
    if (arg === '-l' || arg === '--list') {
      console.log('\nAvailable licenses:\n');
      list().forEach(l => console.log(`  ${l.key.padEnd(12)} ${l.name}`));
      console.log('');
      process.exit(0);
    }
    if (arg === '-n' || arg === '--name') {
      opts.name = args[++i] || opts.name;
      continue;
    }
    if (arg === '-y' || arg === '--year') {
      opts.year = parseInt(args[++i]) || opts.year;
      continue;
    }
    if (arg === '--stdout') {
      opts.stdout = true;
      continue;
    }
    if (!arg.startsWith('-') && getTypes().includes(arg)) {
      opts.type = arg;
    }
  }
  
  return opts;
}

function main() {
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }
  
  const opts = parseArgs(args);
  const content = generate(opts.type, { name: opts.name, year: opts.year });
  
  if (!content) {
    console.error(`Unknown license: ${opts.type}`);
    console.error('Use --list to see available licenses');
    process.exit(1);
  }
  
  if (opts.stdout) {
    console.log(content);
  } else {
    const outPath = path.join(process.cwd(), 'LICENSE');
    fs.writeFileSync(outPath, content);
    console.log(`✓ Created LICENSE (${opts.type.toUpperCase()})`);
  }
}

main();
