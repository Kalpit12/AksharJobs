// RESTORE HEMANT PATEL'S COINS - RUN THIS IN BROWSER CONSOLE
// This script will restore Hemant Patel's lost 21 coins

console.log('🔧 Starting coin restoration for Hemant Patel...');

// Function to restore coins for specific user
function restoreUserCoins(email, coinData) {
    // Get current user data
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referralData = JSON.parse(localStorage.getItem('aksharReferralData') || '{}');
    
    // Check if this is the right user
    if (userData.email === email) {
        console.log(`✅ Found user ${email}, restoring coins...`);
        
        // Restore coin data
        userData.aksharCoins = coinData.totalCoins;
        userData.shareCoins = coinData.shareCoins;
        userData.referralBonusCoins = coinData.referralBonusCoins;
        userData.platformsShared = coinData.platformsShared;
        
        // Update referral data
        referralData.totalCoinsEarned = coinData.totalCoins;
        referralData.totalShares = coinData.totalShares;
        referralData.totalReferrals = coinData.totalReferrals;
        
        // Save to localStorage
        localStorage.setItem('aksharUserData', JSON.stringify(userData));
        localStorage.setItem('aksharReferralData', JSON.stringify(referralData));
        
        console.log(`🎉 Successfully restored ${coinData.totalCoins} coins for ${email}!`);
        console.log('📊 Coin breakdown:', coinData);
        
        // Refresh the page to see updated coins
        console.log('🔄 Refreshing page to show restored coins...');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
        return true;
    } else {
        console.log(`❌ Current user is ${userData.email || 'anonymous'}, not ${email}`);
        return false;
    }
}

// Hemant Patel's coin data (from Google Sheets)
const hemantCoinData = {
    totalCoins: 21,
    shareCoins: 18, // 6 platforms × 3 coins each
    referralBonusCoins: 3,
    platformsShared: ['whatsapp', 'linkedin', 'email', 'twitter', 'facebook', 'telegram'],
    totalShares: 6,
    totalReferrals: 3
};

// Restore coins
const success = restoreUserCoins('hemant.patel@maxproinfotech.com', hemantCoinData);

if (!success) {
    console.log('💡 To restore coins:');
    console.log('1. Make sure you are logged in as hemant.patel@maxproinfotech.com');
    console.log('2. Run this script again');
    console.log('3. Or manually set coins by running:');
    console.log(`
        const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
        userData.aksharCoins = 21;
        userData.shareCoins = 18;
        userData.referralBonusCoins = 3;
        userData.platformsShared = ['whatsapp', 'linkedin', 'email', 'twitter', 'facebook', 'telegram'];
        localStorage.setItem('aksharUserData', JSON.stringify(userData));
        window.location.reload();
    `);
}

console.log('✅ Coin restoration script completed!');
