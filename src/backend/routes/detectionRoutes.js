import express from 'express';
import { detectPhishingSignals } from '../utils/detectPhishingSignals.js';

const router = express.Router();

// Email checking endpoint - handles { email: "address@domain.com" }
router.post('/checkEmail', (req, res) => {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
        return res.status(400).json({
            riskLevel: 'error',
            riskScore: 0,
            flags: ['Email is required and must be a string.'],
            suggestions: [],
            highlightedContent: '',
            detectedType: 'email'
        });
    }

    try {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                riskLevel: 'high',
                riskScore: 100,
                flags: ['Invalid email format'],
                suggestions: ['Verify the email address format'],
                highlightedContent: email,
                detectedType: 'email'
            });
        }

        // Extract domain from email
        const domain = email.split('@')[1];
        
        // Check for suspicious email patterns
        const suspiciousPatterns = {
            temporaryDomains: /\b(10minutemail|tempmail|guerrillamail|mailinator|temp-mail|throwaway|disposable)\b/gi,
            typosquatting: /\b(gmial|yahooo|hotmial|outlookk|gmai|gmali|yahoo0|0utlook|g00gle)\b/gi,
            suspiciousTlds: /\.(tk|ml|ga|cf|pw|top|click|download|zip|review)$/gi,
            numbersInDomain: /\d{3,}/g,
            longSubdomains: /[a-z0-9-]{20,}\./gi
        };

        const emailFlags = [];
        let riskScore = 0;

        // Check for temporary email services
        if (suspiciousPatterns.temporaryDomains.test(domain)) {
            emailFlags.push('Uses temporary/disposable email service');
            riskScore += 40;
        }

        // Check for typosquatting
        if (suspiciousPatterns.typosquatting.test(domain)) {
            emailFlags.push('Domain appears to mimic legitimate email providers');
            riskScore += 50;
        }

        // Check for suspicious TLDs
        if (suspiciousPatterns.suspiciousTlds.test(domain)) {
            emailFlags.push('Uses suspicious top-level domain');
            riskScore += 30;
        }

        // Check for excessive numbers in domain
        if (suspiciousPatterns.numbersInDomain.test(domain)) {
            emailFlags.push('Domain contains suspicious number patterns');
            riskScore += 20;
        }

        // Check for long subdomains (common in phishing)
        if (suspiciousPatterns.longSubdomains.test(domain)) {
            emailFlags.push('Domain has suspiciously long subdomains');
            riskScore += 25;
        }

        // Check domain age and reputation (simplified check)
        const commonLegitDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'live.com', 'msn.com', 'aol.com'];
        const isCommonDomain = commonLegitDomains.includes(domain.toLowerCase());
        
        if (!isCommonDomain && domain.length < 5) {
            emailFlags.push('Very short domain name');
            riskScore += 15;
        }

        // Cap the risk score at 100
        riskScore = Math.min(riskScore, 100);

        // Determine risk level
        let riskLevel = 'low';
        if (riskScore >= 70) riskLevel = 'high';
        else if (riskScore >= 40) riskLevel = 'medium';

        // Generate suggestions
        let suggestions = [];
        if (riskLevel === 'high') {
            suggestions = [
                'Do not trust this email address',
                'Verify sender through alternative means',
                'Mark as spam if received in inbox',
                'Do not provide personal information',
                'Report to security team'
            ];
        } else if (riskLevel === 'medium') {
            suggestions = [
                'Exercise caution with this email',
                'Verify sender identity before responding',
                'Be wary of any requests for information',
                'Check for other suspicious indicators'
            ];
        } else {
            suggestions = [
                'Email appears legitimate',
                'Still verify identity for sensitive requests',
                'Trust your instincts if something feels off'
            ];
        }

        // Highlight suspicious elements
        let highlightedContent = email;
        Object.values(suspiciousPatterns).forEach(pattern => {
            highlightedContent = highlightedContent.replace(pattern, '<mark>$&</mark>');
        });

        res.json({
            riskLevel,
            riskScore,
            flags: emailFlags,
            suggestions,
            highlightedContent,
            detectedType: 'email',
            emailAnalysis: {
                domain: domain,
                isTemporaryEmail: suspiciousPatterns.temporaryDomains.test(domain),
                isTyposquatting: suspiciousPatterns.typosquatting.test(domain),
                hasSuspiciousTld: suspiciousPatterns.suspiciousTlds.test(domain),
                isCommonProvider: isCommonDomain,
                domainLength: domain.length,
                hasNumbersInDomain: suspiciousPatterns.numbersInDomain.test(domain),
                hasLongSubdomains: suspiciousPatterns.longSubdomains.test(domain)
            }
        });

    } catch (error) {
        console.error('Error analyzing email:', error);
        res.status(500).json({
            riskLevel: 'error',
            riskScore: 0,
            flags: ['Failed to analyze email'],
            suggestions: ['Please try again or contact support'],
            highlightedContent: email,
            detectedType: 'email'
        });
    }
});

// Email content checking endpoint - handles { message: "email content..." }
router.post('/checkEmailContent', (req, res) => {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
        return res.status(400).json({
            riskLevel: 'error',
            riskScore: 0,
            flags: ['Email content is required and must be a string.'],
            suggestions: [],
            highlightedContent: '',
            detectedType: 'email'
        });
    }

    try {
        // Detect phishing signals in email content
        const signals = detectPhishingSignals(message);
        
        // Additional email-specific checks
        const emailPatterns = {
            urgentWords: /\b(urgent|immediate|asap|expire|suspend|verify now|act now|limited time)\b/gi,
            suspiciousLinks: /https?:\/\/[^\s]+/gi,
            personalInfoRequests: /\b(password|ssn|social security|credit card|bank account|pin)\b/gi,
            poorGrammar: /\b(recieve|loose|there account|you're account|wont|cant)\b/gi,
            genericGreetings: /\b(dear customer|dear user|dear sir\/madam)\b/gi
        };

        // Check for email-specific red flags
        const emailFlags = [];
        
        if (emailPatterns.urgentWords.test(message)) {
            emailFlags.push('Contains urgent/threatening language');
        }
        
        const links = message.match(emailPatterns.suspiciousLinks);
        if (links && links.length > 0) {
            emailFlags.push(`Contains ${links.length} external link(s)`);
        }
        
        if (emailPatterns.personalInfoRequests.test(message)) {
            emailFlags.push('Requests personal/financial information');
        }
        
        if (emailPatterns.poorGrammar.test(message)) {
            emailFlags.push('Contains grammar/spelling errors');
        }
        
        if (emailPatterns.genericGreetings.test(message)) {
            emailFlags.push('Uses generic greeting (possible mass email)');
        }

        // Combine general phishing signals with email-specific flags
        const allFlags = [...signals, ...emailFlags];

        // Calculate risk score (0-100)
        let riskScore = Math.min(allFlags.length * 15, 100);
        
        // Determine risk level
        let riskLevel = 'low';
        if (riskScore >= 75) riskLevel = 'high';
        else if (riskScore >= 45) riskLevel = 'medium';

        // Generate suggestions based on risk level
        let suggestions = [];
        if (riskLevel === 'high') {
            suggestions = [
                'Do not click any links in this email',
                'Delete this email immediately',
                'Mark as spam/phishing',
                'Report to your IT security team',
                'Do not provide any personal information'
            ];
        } else if (riskLevel === 'medium') {
            suggestions = [
                'Exercise caution with this email',
                'Verify sender through official channels',
                'Do not click suspicious links',
                'Be wary of any information requests'
            ];
        } else {
            suggestions = [
                'Email appears relatively safe',
                'Still verify sender if requesting information',
                'Trust your instincts if something feels off'
            ];
        }

        // Highlight suspicious elements in content
        let highlightedContent = message;
        
        // Highlight urgent words
        highlightedContent = highlightedContent.replace(
            emailPatterns.urgentWords, 
            '<mark class="urgent">$&</mark>'
        );
        
        // Highlight links
        highlightedContent = highlightedContent.replace(
            emailPatterns.suspiciousLinks, 
            '<mark class="link">$&</mark>'
        );
        
        // Highlight personal info requests
        highlightedContent = highlightedContent.replace(
            emailPatterns.personalInfoRequests, 
            '<mark class="personal-info">$&</mark>'
        );

        res.json({
            riskLevel,
            riskScore,
            flags: allFlags,
            suggestions,
            highlightedContent,
            detectedType: 'email',
            emailAnalysis: {
                linksFound: links || [],
                urgentLanguage: emailPatterns.urgentWords.test(message),
                requestsPersonalInfo: emailPatterns.personalInfoRequests.test(message),
                hasGrammarErrors: emailPatterns.poorGrammar.test(message),
                usesGenericGreeting: emailPatterns.genericGreetings.test(message)
            }
        });

    } catch (error) {
        console.error('Error analyzing email:', error);
        res.status(500).json({
            riskLevel: 'error',
            riskScore: 0,
            flags: ['Failed to analyze email content'],
            suggestions: ['Please try again or contact support'],
            highlightedContent: message,
            detectedType: 'email'
        });
    }
});

// WHOIS lookup endpoint (referenced in frontend)
router.get('/whois/:domain', async (req, res) => {
    const { domain } = req.params;
    
    if (!domain) {
        return res.status(400).json({
            error: 'Domain is required',
            riskLevel: 'high',
            riskScore: 100,
            suspiciousElements: 'No domain provided',
            securityFlags: 'Invalid request'
        });
    }

    try {
        // Import whois here to avoid dependency issues if not installed
        const whois = await import('whois-json');
        const whoisData = await whois.default(domain);
        
        // Analyze domain for suspicious patterns
        const suspiciousElements = [];
        const securityFlags = [];
        let riskScore = 0;

        // Check domain age
        if (whoisData.creationDate) {
            const creationDate = new Date(whoisData.creationDate);
            const now = new Date();
            const ageInDays = (now - creationDate) / (1000 * 60 * 60 * 24);
            
            if (ageInDays < 30) {
                suspiciousElements.push('Domain is very new (less than 30 days old)');
                riskScore += 3;
            } else if (ageInDays < 90) {
                suspiciousElements.push('Domain is relatively new (less than 90 days old)');
                riskScore += 2;
            }
        }

        // Check for privacy protection
        if (whoisData.registrantName && whoisData.registrantName.toLowerCase().includes('privacy')) {
            suspiciousElements.push('Domain uses privacy protection service');
            riskScore += 1;
        }

        // Check for suspicious TLDs
        const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.pw', '.top', '.click', '.download'];
        const domainTld = domain.substring(domain.lastIndexOf('.'));
        if (suspiciousTlds.includes(domainTld)) {
            suspiciousElements.push(`Uses suspicious TLD: ${domainTld}`);
            riskScore += 2;
        }

        // Determine overall risk level
        let riskLevel = 'low';
        if (riskScore >= 4) riskLevel = 'high';
        else if (riskScore >= 2) riskLevel = 'medium';

        res.json({
            whois: whoisData,
            riskLevel,
            riskScore,
            suspiciousElements: suspiciousElements.length > 0 ? suspiciousElements.join('; ') : 'None detected',
            securityFlags: securityFlags.length > 0 ? securityFlags.join('; ') : 'No security issues found',
            domainAnalysis: {
                domainAge: whoisData.creationDate ? Math.floor((new Date() - new Date(whoisData.creationDate)) / (1000 * 60 * 60 * 24)) : null,
                hasPrivacyProtection: whoisData.registrantName && whoisData.registrantName.toLowerCase().includes('privacy'),
                tld: domainTld,
                registrar: whoisData.registrarName || 'Unknown'
            }
        });

    } catch (error) {
        console.error('WHOIS lookup failed:', error);
        res.status(500).json({
            error: 'WHOIS lookup failed',
            riskLevel: 'high',
            riskScore: 4,
            suspiciousElements: 'WHOIS lookup failed - unable to verify domain',
            securityFlags: 'Could not retrieve domain information',
            whois: null
        });
    }
});

router.post('/checkPhishing', (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({
            riskLevel: 'error',
            riskScore: 0,
            flags: ['Message is required and must be a string.'],
            suggestions: [],
            highlightedContent: '',
            detectedType: 'unknown'
        });
    }

    try {
        // Enhanced phishing patterns
        const phishingPatterns = {
            urgencyWords: /\b(urgent|immediate|asap|act now|hurry|expire|expires|expiring|suspend|suspended|verify now|limited time|deadline|final notice|last chance|time sensitive)\b/gi,
            winPrizes: /\b(congratulations|winner|won|win|prize|lottery|jackpot|lucky|selected|chosen|reward|free money|cash prize|million|inheritance|beneficiary)\b/gi,
            threatLanguage: /\b(suspend|suspended|terminate|terminated|frozen|blocked|deactivate|deactivated|close|closed|restrict|restricted|penalty|legal action)\b/gi,
            moneyRequests: /\b(transfer|wire|payment|fee|tax|processing|handling|shipping|administration|verification fee|advance fee|deposit)\b/gi,
            personalInfoRequests: /\b(password|pin|ssn|social security|credit card|bank account|routing number|cvv|security code|mother's maiden name|date of birth)\b/gi,
            fakeAuthority: /\b(irs|fbi|police|government|bank|microsoft|apple|google|amazon|paypal|tax office|immigration|customs)\b/gi,
            poorGrammar: /\b(recieve|loose|there account|you're account|wont|cant|payed|seperate|definately|occured|embarass)\b/gi,
            genericGreetings: /\b(dear customer|dear user|dear sir\/madam|dear beneficiary|dear friend|dear winner|valued customer)\b/gi,
            suspiciousLinks: /https?:\/\/[^\s]+/gi,
            phoneNumbers: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
            emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            clickBait: /\b(click here|click now|download now|install now|update now|verify account|confirm identity|claim now|get started)\b/gi,
            scarcity: /\b(only|limited|exclusive|special offer|one time|expires today|24 hours|while supplies last|act fast)\b/gi,
            tooGoodToBeTrue: /\b(free|100% free|no cost|guaranteed|risk free|easy money|work from home|make money fast|get rich)\b/gi
        };

        // Get general phishing signals
        const generalSignals = detectPhishingSignals(message);
        
        // Check for specific phishing patterns
        const detectedFlags = [];
        let riskScore = 0;

        // Check urgency language
        const urgencyMatches = message.match(phishingPatterns.urgencyWords);
        if (urgencyMatches) {
            detectedFlags.push(`Contains urgent language: "${urgencyMatches.slice(0, 3).join(', ')}"`);
            riskScore += urgencyMatches.length * 15;
        }

        // Check for win/prize language
        const winMatches = message.match(phishingPatterns.winPrizes);
        if (winMatches) {
            detectedFlags.push(`Contains prize/winning language: "${winMatches.slice(0, 3).join(', ')}"`);
            riskScore += winMatches.length * 20;
        }

        // Check for threat language
        const threatMatches = message.match(phishingPatterns.threatLanguage);
        if (threatMatches) {
            detectedFlags.push(`Contains threatening language: "${threatMatches.slice(0, 3).join(', ')}"`);
            riskScore += threatMatches.length * 18;
        }

        // Check for money requests
        const moneyMatches = message.match(phishingPatterns.moneyRequests);
        if (moneyMatches) {
            detectedFlags.push(`Requests money/payment: "${moneyMatches.slice(0, 3).join(', ')}"`);
            riskScore += moneyMatches.length * 25;
        }

        // Check for personal info requests
        const personalInfoMatches = message.match(phishingPatterns.personalInfoRequests);
        if (personalInfoMatches) {
            detectedFlags.push(`Requests personal information: "${personalInfoMatches.slice(0, 3).join(', ')}"`);
            riskScore += personalInfoMatches.length * 30;
        }

        // Check for fake authority impersonation
        const authorityMatches = message.match(phishingPatterns.fakeAuthority);
        if (authorityMatches) {
            detectedFlags.push(`Claims to be from authority: "${authorityMatches.slice(0, 3).join(', ')}"`);
            riskScore += authorityMatches.length * 22;
        }

        // Check for poor grammar
        const grammarMatches = message.match(phishingPatterns.poorGrammar);
        if (grammarMatches) {
            detectedFlags.push(`Contains spelling/grammar errors: "${grammarMatches.slice(0, 3).join(', ')}"`);
            riskScore += grammarMatches.length * 10;
        }

        // Check for generic greetings
        const greetingMatches = message.match(phishingPatterns.genericGreetings);
        if (greetingMatches) {
            detectedFlags.push(`Uses generic greeting: "${greetingMatches.slice(0, 2).join(', ')}"`);
            riskScore += greetingMatches.length * 12;
        }

        // Check for suspicious links
        const linkMatches = message.match(phishingPatterns.suspiciousLinks);
        if (linkMatches) {
            detectedFlags.push(`Contains ${linkMatches.length} external link(s)`);
            riskScore += linkMatches.length * 15;
        }

        // Check for click bait language
        const clickBaitMatches = message.match(phishingPatterns.clickBait);
        if (clickBaitMatches) {
            detectedFlags.push(`Contains action-demanding language: "${clickBaitMatches.slice(0, 3).join(', ')}"`);
            riskScore += clickBaitMatches.length * 16;
        }

        // Check for scarcity tactics
        const scarcityMatches = message.match(phishingPatterns.scarcity);
        if (scarcityMatches) {
            detectedFlags.push(`Uses scarcity tactics: "${scarcityMatches.slice(0, 3).join(', ')}"`);
            riskScore += scarcityMatches.length * 14;
        }

        // Check for too-good-to-be-true offers
        const tooGoodMatches = message.match(phishingPatterns.tooGoodToBeTrue);
        if (tooGoodMatches) {
            detectedFlags.push(`Contains too-good-to-be-true offers: "${tooGoodMatches.slice(0, 3).join(', ')}"`);
            riskScore += tooGoodMatches.length * 18;
        }

        // Combine all flags
        const allFlags = [...generalSignals, ...detectedFlags];

        // Cap risk score at 100
        riskScore = Math.min(riskScore, 100);

        // Determine risk level
        let riskLevel = 'low';
        if (riskScore >= 75) riskLevel = 'high';
        else if (riskScore >= 40) riskLevel = 'medium';

        // Detect content type
        let detectedType = 'message';
        if (message.includes('@') && (message.includes('Subject:') || message.includes('From:'))) {
            detectedType = 'email';
        } else if (message.startsWith('http') || message.includes('www.')) {
            detectedType = 'link';
        }

        // Generate suggestions based on risk level and detected patterns
        let suggestions = [];
        if (riskLevel === 'high') {
            suggestions = [
                'Do not interact with this content',
                'Delete immediately',
                'Do not click any links',
                'Do not provide any personal information',
                'Report to your IT security team',
                'Mark as spam/phishing if received via email'
            ];
        } else if (riskLevel === 'medium') {
            suggestions = [
                'Exercise extreme caution',
                'Verify sender through official channels',
                'Do not provide personal information',
                'Be suspicious of any urgent requests',
                'Consider reporting if suspicious'
            ];
        } else {
            suggestions = [
                'Content appears relatively safe',
                'Still verify sender if requesting information',
                'Trust your instincts if something feels off',
                'Be cautious of unsolicited messages'
            ];
        }

        // Highlight suspicious elements in content
        let highlightedContent = message;
        
        // Highlight different types of suspicious content with different classes
        Object.entries(phishingPatterns).forEach(([type, pattern]) => {
            highlightedContent = highlightedContent.replace(pattern, `<mark class="${type}">$&</mark>`);
        });

        res.json({
            riskLevel,
            riskScore,
            flags: allFlags,
            suggestions,
            highlightedContent,
            detectedType,
            messageAnalysis: {
                hasUrgencyLanguage: urgencyMatches ? urgencyMatches.length > 0 : false,
                hasPrizeLanguage: winMatches ? winMatches.length > 0 : false,
                hasThreatLanguage: threatMatches ? threatMatches.length > 0 : false,
                requestsMoney: moneyMatches ? moneyMatches.length > 0 : false,
                requestsPersonalInfo: personalInfoMatches ? personalInfoMatches.length > 0 : false,
                impersonatesAuthority: authorityMatches ? authorityMatches.length > 0 : false,
                hasGrammarErrors: grammarMatches ? grammarMatches.length > 0 : false,
                usesGenericGreeting: greetingMatches ? greetingMatches.length > 0 : false,
                containsLinks: linkMatches ? linkMatches.length : 0,
                usesClickBait: clickBaitMatches ? clickBaitMatches.length > 0 : false,
                usesScarcityTactics: scarcityMatches ? scarcityMatches.length > 0 : false,
                hasTooGoodOffers: tooGoodMatches ? tooGoodMatches.length > 0 : false
            }
        });

    } catch (error) {
        console.error('Error analyzing message:', error);
        res.status(500).json({
            riskLevel: 'error',
            riskScore: 0,
            flags: ['Failed to analyze message content'],
            suggestions: ['Please try again or contact support'],
            highlightedContent: message,
            detectedType: 'unknown'
        });
    }
});

export default router;
