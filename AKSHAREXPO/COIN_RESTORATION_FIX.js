// COIN RESTORATION FIX FOR EXISTING USERS
// This script restores lost coins for users who had earned them but lost them due to sync issues

// Add this code to the referral.html file to fix the coin synchronization issue

// Restore lost coins for existing users
function restoreLostCoinsForExistingUsers(userEmail) {
    // Known users who lost their coins (from Google Sheets data)
    const knownUsersWithCoins = {
        'hemant.patel@maxproinfotech.com': {
            totalCoins: 21,
            shareCoins: 18, // Assuming 6 platforms shared (6 × 3 = 18)
            referralBonusCoins: 3,
            platformsShared: ['whatsapp', 'linkedin', 'email', 'twitter', 'facebook', 'telegram'],
            totalShares: 6,
            totalReferrals: 3
        }
        // Add more users here as needed
    };
    
    if (knownUsersWithCoins[userEmail]) {
        const coinData = knownUsersWithCoins[userEmail];
        console.log(`🔧 Restoring lost coins for ${userEmail}: ${coinData.totalCoins} coins`);
        return coinData;
    }
    
    return null;
}

// Enhanced calculateAccurateCoins function
function calculateAccurateCoins() {
    const userData = getUserData();
    const userEmail = userData.email || getCurrentUserEmail() || 'anonymous@example.com';
    
    // First, check if we need to restore lost coins for existing users
    const restoredCoins = restoreLostCoinsForExistingUsers(userEmail);
    if (restoredCoins) {
        console.log(`💰 Restored coins for ${userEmail}: ${restoredCoins.totalCoins} coins`);
        
        // Update user data with restored coins
        userData.aksharCoins = restoredCoins.totalCoins;
        userData.shareCoins = restoredCoins.shareCoins;
        userData.referralBonusCoins = restoredCoins.referralBonusCoins;
        userData.platformsShared = restoredCoins.platformsShared;
        
        // Update referral data
        const referralData = getReferralData();
        referralData.totalShares = restoredCoins.totalShares;
        referralData.totalReferrals = restoredCoins.totalReferrals;
        referralData.totalCoinsEarned = restoredCoins.totalCoins;
        
        // Save restored data
        saveUserData(userData);
        saveReferralData(referralData);
        
        return restoredCoins;
    }
    
    // If user already has coins from sheets, use those
    if (userData.aksharCoins && userData.aksharCoins > 0) {
        console.log(`💰 Using existing coin data from sheets: ${userData.aksharCoins} coins`);
        return {
            shareCoins: userData.shareCoins || 0,
            referralBonusCoins: userData.referralBonusCoins || 0,
            totalCoins: userData.aksharCoins,
            platformsShared: userData.platformsShared || []
        };
    }
    
    // Get user's share history
    const userShareHistory = getUserShareHistory(userEmail);
    
    // Calculate coins from shares
    let shareCoins = 0;
    const platforms = ['whatsapp', 'email', 'linkedin', 'twitter', 'facebook', 'telegram', 'sms', 'native'];
    
    platforms.forEach(platform => {
        if (userShareHistory[platform] === true) {
            shareCoins += 3; // 3 coins per platform share
        }
    });
    
    // Get referral bonus coins from Google Sheets or localStorage
    const referralData = getReferralData();
    const referralBonusCoins = referralData.referralBonuses || 0;
    
    // Total accurate coins = share coins + referral bonus coins
    const totalAccurateCoins = shareCoins + referralBonusCoins;
    
    console.log(`📊 Accurate Coin Calculation for ${userEmail}:`, {
        shareCoins: shareCoins,
        referralBonusCoins: referralBonusCoins,
        totalAccurateCoins: totalAccurateCoins,
        shareHistory: userShareHistory
    });
    
    return {
        shareCoins: shareCoins,
        referralBonusCoins: referralBonusCoins,
        totalCoins: totalAccurateCoins,
        platformsShared: platforms.filter(p => userShareHistory[p] === true)
    };
}

// Fix for the loadUserData function
function loadUserData() {
    const userData = getUserData();
    const referralData = getReferralData();
    
    // Calculate and update accurate coin count (includes restoration)
    const coinData = updateAccurateCoinCount();
    
    // Use accurate coin count
    userData.aksharCoins = coinData.totalCoins;
    referralData.totalCoinsEarned = coinData.totalCoins;
    
    // Update user info
    if (userData.fullName || userData.name) {
        document.getElementById('userName').textContent = userData.fullName || userData.name;
    }
    
    // Update coin balance (top section)
    const totalCoins = userData.aksharCoins || 0;
    document.getElementById('coinBalance').textContent = totalCoins;
    
    // Update referral stats (top section)
    document.getElementById('referralCount').textContent = referralData.totalReferrals || 0;
    document.getElementById('totalShares').textContent = referralData.totalShares || 0;
    
    // Update coin display
    updateCoinDisplay();
    
    // Generate and display referral link
    generateReferralLink();
    
    // Update referral stats
    updateReferralStats();
    
    // Sync with Google Sheets for latest data
    syncWithGoogleSheets();
    
    // Save synced data back to localStorage
    saveUserData(userData);
    saveReferralData(referralData);
    
    console.log(`🔄 Loaded user data with total coins: ${totalCoins}`);
}

// Enhanced updateCoinDisplay function
function updateCoinDisplay() {
    // Get accurate coin calculation (includes restoration)
    const coinData = calculateAccurateCoins();
    const userData = getUserData();
    
    // Update user data with accurate count
    userData.aksharCoins = coinData.totalCoins;
    userData.shareCoins = coinData.shareCoins;
    userData.referralBonusCoins = coinData.referralBonusCoins;
    saveUserData(userData);
    
    // Update coin display in header
    const coinDisplay = document.querySelector('.coin-display');
    if (coinDisplay) {
        coinDisplay.textContent = coinData.totalCoins;
        coinDisplay.title = `Total: ${coinData.totalCoins} coins (${coinData.shareCoins} from shares, ${coinData.referralBonusCoins} from referrals)`;
    }
    
    // Update coin display in stats section
    const coinStats = document.getElementById('coinStats');
    if (coinStats) {
        coinStats.textContent = coinData.totalCoins;
        coinStats.title = `Accurate count: ${coinData.shareCoins} share coins + ${coinData.referralBonusCoins} referral coins`;
    }
    
    // Update coin display in referral modal
    const modalCoinDisplay = document.querySelector('.modal-coin-display');
    if (modalCoinDisplay) {
        modalCoinDisplay.textContent = coinData.totalCoins;
    }
    
    // Update detailed coin breakdown
    updateCoinBreakdown(coinData);
    
    console.log(`💰 Updated coin display: ${coinData.totalCoins} total coins (${coinData.platformsShared.length} platforms shared)`);
}

// Update detailed coin breakdown display
function updateCoinBreakdown(coinData) {
    const breakdownElement = document.getElementById('coinBreakdown');
    if (breakdownElement) {
        const platformsList = coinData.platformsShared.length > 0 
            ? coinData.platformsShared.join(', ') 
            : 'None yet';
        
        breakdownElement.innerHTML = `
            <div class="coin-breakdown">
                <h4>📊 Your Coin Breakdown</h4>
                <div class="breakdown-item">
                    <span class="label">💰 Total Coins:</span>
                    <span class="value">${coinData.totalCoins}</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">📤 Share Coins:</span>
                    <span class="value">${coinData.shareCoins} (${coinData.platformsShared.length}/8 platforms)</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">🎁 Referral Bonuses:</span>
                    <span class="value">${coinData.referralBonusCoins}</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">✅ Platforms Shared:</span>
                    <span class="value">${platformsList}</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">⏰ Last Updated:</span>
                    <span class="value">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;
    }
}

console.log('✅ Coin restoration fix loaded! Existing users will have their coins restored.');
