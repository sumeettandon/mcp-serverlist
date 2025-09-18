const fs = require('fs');
const path = require('path');

const resultsPath = path.join(process.cwd(), 'axe-results.json');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const violations = results.violations;

if (violations.length > 0) {
  console.error('\nAccessibility violations found:');
  violations.forEach((violation) => {
    console.error(`\nRule: ${violation.id} (${violation.impact} impact)`);
    console.error(`Description: ${violation.help}`);
    console.error(`WCAG: ${violation.tags.filter(t => t.startsWith('wcag')).join(', ')}`);
    console.error('\nAffected elements:');
    violation.nodes.forEach((node) => {
      console.error(`- ${node.html}`);
      console.error(`  Fix: ${node.failureSummary}`);
    });
  });
  process.exit(1);
} else {
  console.log('No accessibility violations found!');
  process.exit(0);
}