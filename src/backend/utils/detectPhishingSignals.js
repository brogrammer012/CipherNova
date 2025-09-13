// Utility function to check for phishing signals
function detectPhishingSignals(message) {
    const signals = [];
    // Urgent language
    const urgentPatterns = [
        /act now/i,
        /urgent/i,
        /immediately/i,
        /your account will be closed/i,
        /limited time/i,
        /final notice/i
    ];
    urgentPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Urgent language detected');
    });

    // Suspicious links
    const suspiciousLinkPatterns = [
        /https?:\/\/(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|buff\.ly|shorturl\.at)\/[\w\d]+/i,
        /https?:\/\/[^\s]+\.[^\s]+\.[^\s]+/i // double dot domain
    ];
    suspiciousLinkPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Suspicious link detected');
    });

    // Personal info requests
    const personalInfoPatterns = [
        /password/i,
        /id number/i,
        /social security/i,
        /bank account/i,
        /credit card/i,
        /pin/i
    ];
    personalInfoPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Personal info request detected');
    });

    // Too-good-to-be-true offers
    const offerPatterns = [
        /free money/i,
        /you have won/i,
        /prize/i,
        /claim now/i,
        /guaranteed/i,
        /risk[- ]?free/i
    ];
    offerPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Too-good-to-be-true offer detected');
    });

    return signals;
}

export { detectPhishingSignals };