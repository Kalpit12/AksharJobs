// Quick JWT Token Fix - Run this in browser console
// This will clear all invalid JWT tokens and force a fresh login

console.log('🔧 Fixing JWT Token Issues...');

// Clear all authentication tokens
const keysToRemove = [
    'token', 'refreshToken', 'role', 'userId', 'email', 
    'firstName', 'lastName', 'profileComplete', 'authToken'
];

let clearedCount = 0;
keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
        console.log(`Clearing: ${key}`);
        localStorage.removeItem(key);
        clearedCount++;
    }
});

// Clear session storage too
sessionStorage.clear();

console.log(`✅ Cleared ${clearedCount} token(s)`);
console.log('🔄 Now refresh the page or go to login to get new tokens');

// Optionally redirect to login
if (confirm('Redirect to login page?')) {
    window.location.href = '/login';
}
