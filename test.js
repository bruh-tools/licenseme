const { generate, list, getTypes } = require('./src/generator');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// Tests
test('generate mit returns string', () => {
  const result = generate('mit');
  assert(typeof result === 'string', 'should be string');
  assert(result.includes('MIT License'), 'should contain MIT License');
});

test('generate apache returns string', () => {
  const result = generate('apache');
  assert(typeof result === 'string', 'should be string');
  assert(result.includes('Apache License'), 'should contain Apache License');
});

test('generate isc returns string', () => {
  const result = generate('isc');
  assert(typeof result === 'string', 'should be string');
  assert(result.includes('ISC License'), 'should contain ISC License');
});

test('generate with name replaces placeholder', () => {
  const result = generate('mit', { name: 'Test Author' });
  assert(result.includes('Test Author'), 'should contain author name');
});

test('generate with year replaces placeholder', () => {
  const result = generate('mit', { year: 2020 });
  assert(result.includes('2020'), 'should contain year');
});

test('generate invalid returns null', () => {
  const result = generate('invalid');
  assert(result === null, 'should return null for invalid');
});

test('list returns array', () => {
  const result = list();
  assert(Array.isArray(result), 'should be array');
  assert(result.length === 5, 'should have 5 licenses');
});

test('list items have key and name', () => {
  const result = list();
  result.forEach(item => {
    assert(item.key, 'should have key');
    assert(item.name, 'should have name');
  });
});

test('getTypes returns array of strings', () => {
  const result = getTypes();
  assert(Array.isArray(result), 'should be array');
  assert(result.includes('mit'), 'should include mit');
  assert(result.includes('apache'), 'should include apache');
});

test('default year is current year', () => {
  const result = generate('mit');
  const currentYear = new Date().getFullYear().toString();
  assert(result.includes(currentYear), 'should contain current year');
});

// Summary
console.log(`\n${passed}/${passed + failed} tests passed`);
process.exit(failed > 0 ? 1 : 0);
