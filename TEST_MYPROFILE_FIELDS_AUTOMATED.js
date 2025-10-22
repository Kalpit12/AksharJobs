/**
 * Automated Test Script for MyProfile Page Field Verification
 * 
 * This script tests that all registration form fields are displayed on the MyProfile page
 * Run this in the browser console on the MyProfile page
 */

console.log('🧪 Starting MyProfile Fields Test...');

// Test Configuration
const TEST_CONFIG = {
  expectedSections: 8,
  expectedFields: 57,
  sections: [
    'personal',
    'demographics', 
    'residency',
    'locations',
    'professional',
    'memberships',
    'additional',
    'skills'
  ]
};

// Test Results
const testResults = {
  sections: {},
  fields: {},
  errors: [],
  summary: {}
};

/**
 * Test 1: Verify All Sections Are Present
 */
function testSections() {
  console.log('\n📋 Test 1: Verifying Sections...');
  
  TEST_CONFIG.sections.forEach(section => {
    const sectionElement = document.querySelector(`[data-section="${section}"]`);
    const hasEditButton = sectionElement ? sectionElement.querySelector('button') !== null : false;
    
    testResults.sections[section] = {
      exists: !!sectionElement,
      hasEditButton,
      status: sectionElement ? 'PASS' : 'FAIL'
    };
    
    if (sectionElement) {
      console.log(`✅ Section "${section}" found`);
    } else {
      console.error(`❌ Section "${section}" missing`);
      testResults.errors.push(`Missing section: ${section}`);
    }
  });
}

/**
 * Test 2: Count All Form Fields
 */
function testFieldCount() {
  console.log('\n📝 Test 2: Counting Form Fields...');
  
  const allInputs = document.querySelectorAll('input, textarea, select');
  const fieldCount = allInputs.length;
  
  testResults.fields = {
    count: fieldCount,
    expected: TEST_CONFIG.expectedFields,
    status: fieldCount >= TEST_CONFIG.expectedFields ? 'PASS' : 'FAIL'
  };
  
  console.log(`📊 Total fields found: ${fieldCount}`);
  console.log(`📊 Expected fields: ${TEST_CONFIG.expectedFields}`);
  
  if (fieldCount >= TEST_CONFIG.expectedFields) {
    console.log('✅ Field count test PASSED');
  } else {
    console.error(`❌ Field count test FAILED - Expected ${TEST_CONFIG.expectedFields}, got ${fieldCount}`);
    testResults.errors.push(`Field count mismatch: Expected ${TEST_CONFIG.expectedFields}, got ${fieldCount}`);
  }
}

/**
 * Test 3: Verify Specific Field Types
 */
function testFieldTypes() {
  console.log('\n🔍 Test 3: Verifying Field Types...');
  
  const fieldTypes = {
    text: document.querySelectorAll('input[type="text"]').length,
    email: document.querySelectorAll('input[type="email"]').length,
    date: document.querySelectorAll('input[type="date"]').length,
    textarea: document.querySelectorAll('textarea').length,
    select: document.querySelectorAll('select').length
  };
  
  console.log('📊 Field type breakdown:');
  Object.entries(fieldTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  testResults.fields.types = fieldTypes;
}

/**
 * Test 4: Verify Navigation Buttons
 */
function testNavigation() {
  console.log('\n🧭 Test 4: Verifying Navigation...');
  
  const sidebar = document.querySelector('.sidebar-container');
  const navButtons = sidebar ? sidebar.querySelectorAll('button') : [];
  
  console.log(`📊 Navigation buttons found: ${navButtons.length}`);
  
  testResults.navigation = {
    sidebarExists: !!sidebar,
    buttonCount: navButtons.length,
    status: sidebar && navButtons.length >= 5 ? 'PASS' : 'FAIL'
  };
  
  if (sidebar && navButtons.length >= 5) {
    console.log('✅ Navigation test PASSED');
  } else {
    console.error('❌ Navigation test FAILED');
    testResults.errors.push('Navigation buttons missing or insufficient');
  }
}

/**
 * Test 5: Test Edit Functionality
 */
function testEditButtons() {
  console.log('\n✏️ Test 5: Verifying Edit Buttons...');
  
  const editButtons = document.querySelectorAll('button');
  let editButtonCount = 0;
  
  editButtons.forEach(button => {
    const text = button.textContent.toLowerCase();
    if (text.includes('edit') || text.includes('save') || text.includes('cancel')) {
      editButtonCount++;
    }
  });
  
  console.log(`📊 Edit-related buttons found: ${editButtonCount}`);
  
  testResults.editButtons = {
    count: editButtonCount,
    status: editButtonCount >= 10 ? 'PASS' : 'FAIL'
  };
  
  if (editButtonCount >= 10) {
    console.log('✅ Edit buttons test PASSED');
  } else {
    console.error('❌ Edit buttons test FAILED');
    testResults.errors.push('Insufficient edit buttons found');
  }
}

/**
 * Test 6: Verify Field Labels
 */
function testFieldLabels() {
  console.log('\n🏷️ Test 6: Verifying Field Labels...');
  
  const labels = document.querySelectorAll('label');
  const labelTexts = Array.from(labels).map(label => label.textContent.trim());
  
  console.log(`📊 Labels found: ${labels.length}`);
  
  // Check for specific important labels
  const importantLabels = [
    'Full Name', 'Email', 'Phone', 'Location', 'Date of Birth', 'Gender',
    'Nationality', 'Current City', 'Professional Title', 'Skills'
  ];
  
  const foundLabels = importantLabels.filter(label => 
    labelTexts.some(text => text.includes(label))
  );
  
  console.log(`📊 Important labels found: ${foundLabels.length}/${importantLabels.length}`);
  foundLabels.forEach(label => console.log(`  ✅ ${label}`));
  
  testResults.labels = {
    total: labels.length,
    important: foundLabels.length,
    expected: importantLabels.length,
    status: foundLabels.length >= 8 ? 'PASS' : 'FAIL'
  };
}

/**
 * Test 7: Verify Data Loading
 */
function testDataLoading() {
  console.log('\n📡 Test 7: Verifying Data Loading...');
  
  // Check if profile data is loaded by looking for non-empty fields
  const textInputs = document.querySelectorAll('input[type="text"]:not([value=""]), textarea:not(:empty)');
  const filledFields = textInputs.length;
  
  console.log(`📊 Fields with data: ${filledFields}`);
  
  testResults.dataLoading = {
    filledFields,
    status: filledFields > 0 ? 'PASS' : 'WARNING'
  };
  
  if (filledFields > 0) {
    console.log('✅ Data loading test PASSED - Some fields contain data');
  } else {
    console.warn('⚠️ Data loading test WARNING - No fields contain data');
  }
}

/**
 * Test 8: Verify Responsive Design
 */
function testResponsiveDesign() {
  console.log('\n📱 Test 8: Verifying Responsive Design...');
  
  const mainContent = document.querySelector('.main-content');
  const sidebar = document.querySelector('.sidebar-container');
  
  const hasMainContent = !!mainContent;
  const hasSidebar = !!sidebar;
  const hasGrid = !!document.querySelector('[style*="grid"]');
  
  console.log(`📊 Responsive elements:`);
  console.log(`  Main content: ${hasMainContent ? '✅' : '❌'}`);
  console.log(`  Sidebar: ${hasSidebar ? '✅' : '❌'}`);
  console.log(`  Grid layout: ${hasGrid ? '✅' : '❌'}`);
  
  testResults.responsive = {
    mainContent: hasMainContent,
    sidebar: hasSidebar,
    grid: hasGrid,
    status: hasMainContent && hasSidebar && hasGrid ? 'PASS' : 'FAIL'
  };
}

/**
 * Generate Test Summary
 */
function generateSummary() {
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  
  const totalTests = 8;
  const passedTests = Object.values(testResults).filter(result => 
    result.status === 'PASS'
  ).length;
  
  const failedTests = testResults.errors.length;
  
  testResults.summary = {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    success: failedTests === 0
  };
  
  console.log(`📈 Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ ERRORS FOUND:');
    testResults.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  if (testResults.summary.success) {
    console.log('\n🎉 ALL TESTS PASSED! MyProfile page is working correctly.');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED. Please check the errors above.');
  }
  
  return testResults;
}

/**
 * Run All Tests
 */
function runAllTests() {
  console.log('🚀 Starting MyProfile Fields Test Suite...');
  console.log(`🎯 Testing ${TEST_CONFIG.expectedSections} sections and ${TEST_CONFIG.expectedFields} fields`);
  
  testSections();
  testFieldCount();
  testFieldTypes();
  testNavigation();
  testEditButtons();
  testFieldLabels();
  testDataLoading();
  testResponsiveDesign();
  
  const results = generateSummary();
  
  // Store results globally for debugging
  window.myProfileTestResults = results;
  
  console.log('\n💾 Test results stored in window.myProfileTestResults');
  
  return results;
}

/**
 * Quick Field Check Function
 */
function quickCheck() {
  console.log('⚡ Quick MyProfile Check...');
  
  const sections = document.querySelectorAll('[data-section]');
  const fields = document.querySelectorAll('input, textarea, select');
  const editButtons = document.querySelectorAll('button');
  
  console.log(`📊 Sections: ${sections.length}/8`);
  console.log(`📊 Fields: ${fields.length}/57`);
  console.log(`📊 Buttons: ${editButtons.length}`);
  
  if (sections.length >= 8 && fields.length >= 50) {
    console.log('✅ Quick check PASSED');
    return true;
  } else {
    console.log('❌ Quick check FAILED');
    return false;
  }
}

// Auto-run tests if this script is loaded
console.log('🔧 MyProfile Test Suite Loaded');
console.log('📝 Available functions:');
console.log('  - runAllTests() - Run complete test suite');
console.log('  - quickCheck() - Run quick field check');
console.log('  - window.myProfileTestResults - View last test results');

// Run quick check automatically
setTimeout(() => {
  console.log('\n🔄 Auto-running quick check...');
  quickCheck();
}, 1000);

// Export functions for manual testing
window.runMyProfileTests = runAllTests;
window.quickMyProfileCheck = quickCheck;
