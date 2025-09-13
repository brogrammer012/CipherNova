// Calculates risk score from WHOIS response fields
function calculateWhoisRisk(whois) {
    let score = 0;
    const now = new Date();

    // 1. domainStatus is NOT 'ok'
    if (whois.domainStatus && typeof whois.domainStatus === 'string' && whois.domainStatus.toLowerCase() !== 'ok') {
        score += 1;
    }

    // 2. updatedDate less than 30 days old (recently updated)
    if (whois.updatedDate) {
        const updated = new Date(whois.updatedDate);
        const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
        if (diffDays < 30) score += 1;
    }

    // 3. registryExpiryDate less than 6 months ahead (expiring soon)
    if (whois.registryExpiryDate) {
        const expiry = new Date(whois.registryExpiryDate);
        const diffMonths = (expiry - now) / (1000 * 60 * 60 * 24 * 30);
        if (diffMonths < 6) score += 1;
    }

    // 4. registrarRegistrationExpirationDate less than 6 months ahead (expiring soon)
    if (whois.registrarRegistrationExpirationDate) {
        const regExpiry = new Date(whois.registrarRegistrationExpirationDate);
        const diffMonths = (regExpiry - now) / (1000 * 60 * 60 * 24 * 30);
        if (diffMonths < 6) score += 1;
    }

    // Risk level
    let riskLevel = 'low risk';
    if (score >= 3) riskLevel = 'high risk';
    else if (score === 2) riskLevel = 'medium risk';

    return {
        score,
        riskLevel,
        message: `Domain WHOIS analysis: ${riskLevel}`
    };
}

export { calculateWhoisRisk };
