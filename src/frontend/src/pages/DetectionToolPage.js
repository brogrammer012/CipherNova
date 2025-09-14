import React, { useState, useEffect } from 'react';
import { checkPhishing, whoisLookup ,checkUrl} from '../api';
import DomainRegistrarInfo from '../components/DomainRegistrarInfo';
import DomainImportantDates from '../components/DomainImportantDates';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Mail, 
  Link as LinkIcon, 
  MessageSquare, 
  ArrowRight, 
  Trophy, 
  Star,
  Users,
  Target,
  RefreshCw,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Ban,
  Flag
} from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/DetectionToolPage.css';

const DetectionToolPage = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("email");
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCrowdBlacklist, setShowCrowdBlacklist] = useState(false);
  const [currentStep, setCurrentStep] = useState("input"); // 'input', 'quiz', 'quiz-result', 'results'
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Function to update user XP in localStorage
  const updateUserXP = (xpToAdd) => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        user.xp = (user.xp || 0) + xpToAdd;
        user.analysesCompleted = (user.analysesCompleted || 0) + 1;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (e) {
      console.error("Failed to update user XP:", e);
    }
  };

  const generateQuiz = (content, type) => {
    const quizzes = {
      email: {
        question: "What looks suspicious about this email?",
        options: [
          {
            id: "a",
            text: "Urgent language demanding immediate action",
            correct: true,
          },
          { id: "b", text: "Professional email signature", correct: false },
          { id: "c", text: "Clear sender identification", correct: false },
          { id: "d", text: "Nothing seems suspicious", correct: false },
        ],
      },
      link: {
        question: "What makes this link potentially dangerous?",
        options: [
          { id: "a", text: "Uses HTTPS protocol", correct: false },
          {
            id: "b",
            text: "Domain name mimics legitimate sites",
            correct: true,
          },
          { id: "c", text: "Has a clear domain extension", correct: false },
          { id: "d", text: "Nothing seems dangerous", correct: false },
        ],
      },
      message: {
        question: "What red flags do you notice in this message?",
        options: [
          {
            id: "a",
            text: "Requests personal information urgently",
            correct: true,
          },
          { id: "b", text: "Uses proper grammar and spelling", correct: false },
          { id: "c", text: "Comes from a known contact", correct: false },
          { id: "d", text: "No red flags present", correct: false },
        ],
      },
    };
    return quizzes[type] || quizzes.email;
  };

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    setIsAnalyzing(true);
    // For domain, skip quiz and call whoisLookup
    if (inputType === "domain") {
      try {
        const response = await whoisLookup(inputValue);
        setAnalysisResult(response.data);
      } catch (error) {
        setAnalysisResult({
          riskLevel: "high risk",
          riskScore: 100,
          suspiciousElements: "WHOIS lookup failed",
          securityFlags: "Unable to analyze domain",
          whois: null,
        });
      }
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep("results");
      }, 2000);
      return;
    }

  if (inputType === "link") {
    try {
      const { data } = await checkUrl(inputValue.trim());
      setAnalysisResult(
        mapUrlResponseToAnalysisResult(data, inputValue.trim())
      );
    } catch (error) {
      setAnalysisResult({
        riskLevel: "high",
        riskScore: 75,
        flags: ["URL check failed", "Potential phishing attempt"],
        suggestions: ["Do not click the link", "Report to security team"],
        highlightedContent: inputValue,
        detectedType: "link",
      });
    }
  }

   const quiz = generateQuiz(inputValue, inputType);
setQuizData(quiz);

// IMPORTANT: do NOT overwrite link results here
if (inputType !== "link") {
  try {
    const response = await checkPhishing(inputValue);
    setAnalysisResult(response.data);
  } catch (error) {
    setAnalysisResult({
      riskLevel: "high",
      riskScore: 75,
      flags: ["Suspicious patterns detected", "Potential phishing attempt"],
      suggestions: ["Do not click any links", "Report to security team"],
      highlightedContent: inputValue,
      detectedType: inputType,
    });
  }
}
    // Award XP for successful analysis
    const analysisXP = 30;
    updateUserXP(analysisXP);
    setToastMessage(`Analysis complete! +${analysisXP} XP`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setIsAnalyzing(false);
      setCurrentStep("quiz");
    }, 2000);
  };

  const handleQuizSubmit = () => {
    if (!selectedAnswer || !quizData) return;

    // Check if answer is correct
    const selectedOption = quizData.options.find(
      (option) => option.id === selectedAnswer
    );
    const isCorrect = selectedOption?.correct || false;

    // Set quiz result
    setQuizResult({
      isCorrect,
      selectedOption,
      correctOption: quizData.options.find((option) => option.correct),
    });

    // Only award XP for correct answers
    if (isCorrect) {
      const xpGained = 50;
      updateUserXP(xpGained);
      setToastMessage(`Correct! +${xpGained} XP`);
    } else {
      setToastMessage("Try again next time!");
    }

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      setCurrentStep("quiz-result");
    }, 2000);
  };

  const handleAnalyzeAnother = () => {
    setInputValue("");
    setAnalysisResult(null);
    setQuizData(null);
    setSelectedAnswer(null);
    setQuizResult(null);
    setCurrentStep("input");
  };

  const handleContinueToResults = () => {
    setCurrentStep("results");
  };

  const handleNewAnalysis = () => {
    handleAnalyzeAnother();
  };

  const handleReportToCommunity = () => {
    // Award XP for community reporting
    const xpGained = 100;
    updateUserXP(xpGained);

    // Add report to community data in localStorage
    const newReport = {
      id: Date.now(),
      type:
        inputType === "link"
          ? "Link"
          : inputType === "email"
          ? "Email"
          : "Phone",
      content: inputValue,
      domain:
        inputType === "link"
          ? new URL(inputValue).hostname
          : inputType === "email"
          ? inputValue.split("@")[1]
          : "N/A",
      riskLevel: analysisResult?.riskLevel || "high",
      reports: 1,
      dateReported: new Date().toLocaleDateString(),
      upvotes: 0,
    };

    // Get existing community reports from localStorage
    const existingReports = JSON.parse(
      localStorage.getItem("communityReports") || "[]"
    );
    const updatedReports = [newReport, ...existingReports];
    localStorage.setItem("communityReports", JSON.stringify(updatedReports));

    setToastMessage(`Reported to community! +${xpGained} XP`);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      // Redirect to community page
      navigate("/community");
    }, 2000);
  };

   // --- URL -> UI mapper with layer-by-layer feedback + scoring ---
// --- URL -> UI mapper with layer-by-layer feedback + scoring + plain-English feedback ---
const mapUrlResponseToAnalysisResult = (raw, originalUrl) => {
  // Normalize short-circuit BLOCK shape
  const norm = (() => {
    if (raw?.webrisk || raw?.lookalike || raw?.tldNote) return raw;
    if (raw?.result === 'BLOCK') {
      return { result: 'BLOCK', webrisk: { result: 'BLOCK', types: raw.types || [] } };
    }
    return { result: raw?.result || 'ALLOW', webrisk: { result: raw?.result || 'ALLOW', types: [] } };
  })();

  // ---------- Build layers ----------
  const l1Passed = norm.webrisk?.result === 'ALLOW';
  const layer1 = {
    name: 'Layer 1: Google Web Risk',
    status: l1Passed ? 'PASS' : 'FAIL',
    detail: l1Passed
      ? 'No threats reported by Google.'
      : `Google reports risk (${(norm.webrisk?.types || []).join(', ') || 'unknown type'}).`,
  };

  let layer2;
  if (norm.lookalike?.result) {
    const la = norm.lookalike;
    const isClean = la.result === 'CLEAN';
    const isLikely = la.result === 'LIKELY_LOOKALIKE';
    layer2 = {
      name: 'Layer 2: Lookalike',
      status: isClean ? 'PASS' : isLikely ? 'REVIEW' : la.result.toUpperCase(),
      detail: isClean
        ? `The site name looks normal (core "${la.core}", eTLD+1 "${la.etld1}").`
        : `The site name looks similar to common brands (core "${la.core}", eTLD+1 "${la.etld1}").`,
    };
  } else {
    layer2 = { name: 'Layer 2: Lookalike', status: 'SKIPPED', detail: 'Could not check for lookalikes.' };
  }

  let layer3;
  if (norm.tldNote) {
    const tn = norm.tldNote;
    layer3 = {
      name: 'Layer 3: Suspicious TLD',
      status: tn.flagged ? 'FLAGGED' : 'PASS',
      detail: tn.flagged
        ? `This domain ending (.${tn.publicSuffix || tn.tld || 'unknown'}) is often abused.`
        : `Domain ending looks normal (.${tn.publicSuffix || tn.tld || 'unknown'}).`,
    };
  } else {
    layer3 = { name: 'Layer 3: Suspicious TLD', status: 'SKIPPED', detail: 'Could not read the domain ending.' };
  }

  const layers = [layer1, layer2, layer3];

  // ---------- Derive flags for your existing flags section ----------
  const flags = [];
  if (!l1Passed && norm.webrisk?.types?.length) flags.push(`Google Web Risk hit: ${norm.webrisk.types.join(', ')}`);
  if (norm.lookalike?.result && norm.lookalike.result !== 'CLEAN') {
    const la = norm.lookalike;
    const matches = Array.isArray(la.matches) ? la.matches.map(m => `${m.term} (dist ${m.dist})`).join(', ') : 'n/a';
    flags.push(`Possible brand impersonation (matches: ${matches}).`);
  }
  if (norm.tldNote?.flagged) flags.push(`Risky domain ending: .${norm.tldNote.publicSuffix || norm.tldNote.tld}`);

  // ---------- Score based on layers (0..100) ----------
  // Rule: Malware (BLOCK) => 100 immediately.
  // Otherwise: lookalike contributes, suspicious TLD contributes, cap at 100.
  let score = 0;

  if (norm.webrisk?.result === 'BLOCK') {
    score = 100;
  } else {
    if (norm.lookalike?.result === 'LIKELY_LOOKALIKE') {
      score += 60;
      const dists = (norm.lookalike.matches || []).map(m => m.dist);
      if (dists.some(d => d <= 1)) score += 20; else if (dists.some(d => d === 2)) score += 10;
    }
    if (norm.tldNote?.flagged) score += 25;
  }

  score = Math.max(0, Math.min(100, score));
  const riskLevel = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';

  // ---------- URL preview ----------
  const preview = (() => {
    try {
      const u = new URL(originalUrl);
      return `<p><strong>URL:</strong> <a href="${u.href}" target="_blank" rel="noopener noreferrer">${u.href}</a><br/><strong>Host:</strong> ${u.hostname}</p>`;
    } catch {
      return `<p><strong>URL:</strong> ${originalUrl}</p>`;
    }
  })();

  // ---------- Plain-English feedback for users ----------
  const userFeedback = [];
  if (norm.webrisk?.result === 'BLOCK') {
    userFeedback.push('Google says this site is dangerous (malware or phishing).');
  } else {
    userFeedback.push('Google did not mark this site as dangerous.');
  }

  if (norm.lookalike?.result === 'LIKELY_LOOKALIKE') {
    userFeedback.push('The name of this site looks like it is imitating a trusted brand.');
  } else if (norm.lookalike?.result === 'CLEAN') {
    userFeedback.push('The site name looks normal and not like a copy of a known brand.');
  }

  if (norm.tldNote?.flagged) {
    userFeedback.push('This domain ending is often abused by scammers.');
  } else if (norm.tldNote) {
    userFeedback.push('The domain ending looks normal.');
  }

  // A single friendly verdict sentence
  const verdictText =
    norm.result === 'BLOCK'
      ? 'Unsafe — do not open this link.'
      : norm.result === 'REVIEW'
      ? 'Looks suspicious — double-check before using.'
      : 'No known problems found — proceed carefully.';

  return {
    // drives your existing UI
    riskLevel,
    riskScore: score,
    flags,
    suggestions: [
      ...(score === 100 ? ['Do not visit this link'] : []),
      ...(norm.result === 'REVIEW' ? ['Verify the site by typing the address yourself'] : []),
    ],
    highlightedContent: preview,
    detectedType: 'link',

    // extra feedback
    verdict: norm.result,       // ALLOW | REVIEW | BLOCK
    verdictText,                // friendly sentence
    layers,                     // technical list (still useful)
    userFeedback,               // plain-English bullet points

    // keep email-only fields undefined
    domainInfo: undefined,
    emailAnalysis: undefined,
  };
};



  const getAnalyzeButtonText = () => {
    switch (inputType) {
      case "email":
        return "Analyze Email";
      case "link":
        return "Analyze Link";
      case "message":
        return "Analyze Message";
      default:
        return "Analyze Content";
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case "email":
        return "Paste email content here...";
      case "link":
        return "Paste link here...";
      case "message":
        return "Paste message here...";
      default:
        return "Paste content to analyze...";
    }
  };

  const getRiskColor = (level, score) => {
    // If score is 75 or above, treat as high risk
    if (typeof score === "number") {
      if (score >= 75) return "#ff4444"; // High risk
      if (score >= 50) return "#ffaa00"; // Medium risk
      return "#00ff7f"; // Low risk
    }
    switch (level?.toLowerCase()) {
      case "high":
      case "high risk":
        return "#ff4444";
      case "medium":
      case "medium risk":
        return "#ffaa00";
      case "low":
      case "low risk":
        return "#00ff7f";
      default:
        return "#888888";
    }
  };

  // Helper to map score to risk level string
  const getRiskLevel = (score) => {
    if (score >= 75 && score <= 100) return "High Risk";
    if (score >= 50 && score < 75) return "Medium Risk";
    if (score >= 0 && score < 50) return "Low Risk";
    return "Unknown";
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "high":
        return <AlertTriangle size={24} />;
      case "medium":
        return <Clock size={24} />;
      case "low":
        return <CheckCircle size={24} />;
      default:
        return <Shield size={24} />;
    }
  };

  return (
    <div className="detection-tool-page">
      <Navbar />

      {/* Background Elements */}
      <div className="page-background">
        <div className="cyber-grid"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="tool-main">
        <div className="tool-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-icon">
              <Shield size={40} />
            </div>
            <div className="header-content">
              <h1>Analyze Suspicious Content</h1>
              <p>
                Upload suspicious emails, links, or messages for threat
                detection
              </p>
            </div>
            <div className="community-section">
              <Link to="/community" className="community-reports-btn">
                <Users size={20} />
                <span>Community Reports</span>
                <div className="report-count">23</div>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          {currentStep === "input" && (
            <div className="input-section">
              <div className="input-card">
                <div className="content-type-selector">
                  <div className="selector-label">Content Type</div>
                  <div className="selector-buttons">
                    <button
                      className={`type-btn ${
                        inputType === "email" ? "active" : ""
                      }`}
                      onClick={() => setInputType("email")}
                    >
                      <Mail size={20} />
                      <span>Email</span>
                    </button>
                    <button
                      className={`type-btn ${
                        inputType === "link" ? "active" : ""
                      }`}
                      onClick={() => setInputType("link")}
                    >
                      <LinkIcon size={20} />
                      <span>Link</span>
                    </button>
                    <button
                      className={`type-btn ${
                        inputType === "message" ? "active" : ""
                      }`}
                      onClick={() => setInputType("message")}
                    >
                      <MessageSquare size={20} />
                      <span>Message</span>
                    </button>
                    <button
                      className={`type-btn ${
                        inputType === "domain" ? "active" : ""
                      }`}
                      onClick={() => setInputType("domain")}
                    >
                      <Star size={20} />
                      <span>Domain</span>
                    </button>
                  </div>
                </div>

                <div className="input-area">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      inputType === "domain"
                        ? "Enter domain name (e.g. example.com)"
                        : getPlaceholder()
                    }
                    className="content-input"
                    rows={8}
                  />
                </div>

                <div className="analyze-section">
                  <button
                    className="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={!inputValue.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="spinning" size={20} />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Target size={20} />
                        <span>{getAnalyzeButtonText()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Result Section */}
          {currentStep === "quiz-result" && quizResult && quizData && (
            <div className="quiz-result-section">
              <div className="quiz-result-card">
                <div className="result-header">
                  <div
                    className={`result-icon ${
                      quizResult.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    {quizResult.isCorrect ? (
                      <CheckCircle size={32} />
                    ) : (
                      <XCircle size={32} />
                    )}
                  </div>
                  <div className="result-content">
                    <h2
                      className={`result-title ${
                        quizResult.isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      {quizResult.isCorrect
                        ? "Correct Answer!"
                        : "Not Quite Right"}
                    </h2>
                    <p className="result-subtitle">
                      {quizResult.isCorrect
                        ? "Great job! You identified the security threat correctly."
                        : "Good attempt! Let's learn from this together."}
                    </p>
                  </div>
                </div>

                <div className="answer-breakdown">
                  <div className="your-answer">
                    <h3>Your Answer:</h3>
                    <div
                      className={`answer-option ${
                        quizResult.isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      <span className="option-letter">
                        {quizResult.selectedOption.id.toUpperCase()}
                      </span>
                      <span className="option-text">
                        {quizResult.selectedOption.text}
                      </span>
                    </div>
                  </div>

                  {!quizResult.isCorrect && (
                    <div className="correct-answer">
                      <h3>Correct Answer:</h3>
                      <div className="answer-option correct">
                        <span className="option-letter">
                          {quizResult.correctOption.id.toUpperCase()}
                        </span>
                        <span className="option-text">
                          {quizResult.correctOption.text}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="learning-tip">
                    <div className="tip-icon">
                      <Eye size={20} />
                    </div>
                    <div className="tip-content">
                      <h4>Security Tip:</h4>
                      <p>
                        {inputType === "email" &&
                          "Always be cautious of emails with urgent language, suspicious links, or requests for personal information."}
                        {inputType === "link" &&
                          "Check URLs carefully for misspellings, suspicious domains, or redirects to unfamiliar sites."}
                        {inputType === "message" &&
                          "Be wary of messages requesting personal information, especially those creating a sense of urgency."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="continue-section">
                  <button
                    className="continue-btn"
                    onClick={handleContinueToResults}
                  >
                    <span>View System Analysis</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {currentStep === "quiz" && quizData && (
            <div className="quiz-section">
              <div className="quiz-card">
                <div className="quiz-header">
                  <Eye className="quiz-icon" size={24} />
                  <h2>{quizData.question}</h2>
                </div>

                <div className="quiz-options">
                  {quizData.options.map((option) => (
                    <button
                      key={option.id}
                      className={`quiz-option ${
                        selectedAnswer === option.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAnswer(option.id)}
                    >
                      <div className="option-indicator">
                        <span className="option-letter">
                          {option.id.toUpperCase()}
                        </span>
                      </div>
                      <span className="option-text">{option.text}</span>
                    </button>
                  ))}
                </div>

                <div className="quiz-actions">
                  <button
                    className="submit-quiz-btn"
                    onClick={handleQuizSubmit}
                    disabled={!selectedAnswer}
                  >
                    <span>Submit Answer</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {currentStep === "results" && analysisResult && (
            <div className="results-section">
              <div className="results-container">
                <div className="results-header">
                  <div className="analysis-summary">
                    <div className="content-preview">
                      <h3>Analysis Complete</h3>
                      <p className="analyzed-content">
                        {inputValue.substring(0, 100)}
                        {inputValue.length > 100 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="results-content">
                  {/* Risk Score Card */}
                  <div className="risk-score-card">
                    <div className="risk-header">
                      <div className="risk-icon">
                        {getRiskIcon(analysisResult.riskLevel)}
                      </div>
                      <div className="risk-details">
                        <h2
                          className="risk-level"
                          style={{
                            color: getRiskColor(
                              analysisResult.riskLevel,
                              analysisResult.riskScore
                            ),
                          }}
                        >
                          {getRiskLevel(analysisResult.riskScore).toUpperCase()}
                        </h2>
                        <div className="risk-score-display">
                          <span className="score-number">
                            {(() => {
                              // Map riskScore for domain type
                              if (inputType === "domain") {
                                switch (analysisResult.riskScore) {
                                  case 0:
                                    return 0;
                                  case 1:
                                    return 25;
                                  case 2:
                                    return 50;
                                  case 3:
                                    return 75;
                                  case 4:
                                    return 100;
                                  default:
                                    return analysisResult.riskScore;
                                }
                              }
                              return analysisResult.riskScore;
                            })()}
                          </span>
                          <span className="score-total">/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="risk-bar">
                      <div
                        className="risk-fill"
                        style={{
                          width: `${(() => {
                            if (inputType === "domain") {
                              switch (analysisResult.riskScore) {
                                case 0:
                                  return 0;
                                case 1:
                                  return 25;
                                case 2:
                                  return 50;
                                case 3:
                                  return 75;
                                case 4:
                                  return 100;
                                default:
                                  return analysisResult.riskScore;
                              }
                            }
                            return analysisResult.riskScore;
                          })()}%`,
                          backgroundColor: getRiskColor(
                            analysisResult.riskLevel,
                            analysisResult.riskScore
                          ),
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* Layer-by-layer checks (links only) */}
                  {analysisResult?.detectedType === "link" &&
                    Array.isArray(analysisResult.layers) && (
                      <div className="layer-results" style={{ marginTop: 16 }}>
                        <h3>Layer Checks</h3>
                        <div
                          className="layer-list"
                          style={{ display: "grid", gap: 12 }}
                        >
                          {analysisResult.layers.map((layer, idx) => (
                            <div
                              key={idx}
                              className={`layer-item status-${(
                                layer.status || ""
                              ).toLowerCase()}`}
                              style={{
                                padding: "12px 14px",
                                borderRadius: 10,
                                background: "#1d2129",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: 6,
                                }}
                              >
                                <strong>{layer.name}</strong>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    letterSpacing: "0.02em",
                                    textTransform: "uppercase",
                                    opacity: 0.9,
                                  }}
                                >
                                  {layer.status}
                                </span>
                              </div>
                              <div style={{ opacity: 0.9 }}>{layer.detail}</div>
                            </div>
                          ))}
                        </div>

                        <div
                          className="final-verdict"
                          style={{
                            marginTop: 16,
                            padding: "10px 14px",
                            borderRadius: 10,
                            background: "#11151b",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <strong>Final Verdict:</strong>{" "}
                          {analysisResult.verdict}
                        </div>
                      </div>
                    )}
                  {/* Plain English feedback (links only) */}
                  {analysisResult?.detectedType === "link" &&
                    Array.isArray(analysisResult.userFeedback) && (
                      <div className="user-feedback" style={{ marginTop: 20 }}>
                        <h3>What this means</h3>
                        <ul style={{ marginTop: 8 }}>
                          {analysisResult.userFeedback.map((line, idx) => (
                            <li key={idx} style={{ marginBottom: 6 }}>
                              {line}
                            </li>
                          ))}
                        </ul>
                        <div
                          style={{
                            marginTop: 10,
                            padding: "10px 12px",
                            borderRadius: 10,
                            background: "#0f141a",
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontWeight: 600,
                          }}
                        >
                          {analysisResult.verdictText}
                        </div>
                      </div>
                    )}

                  {/* Domain WHOIS Results */}
                  {inputType === "domain" && analysisResult.whois && (
                    <div className="domain-results-grid">
                      <div className="risk-score-card">
                        <DomainRegistrarInfo
                          whois={{
                            ...analysisResult.whois,
                            domainStatus:
                              analysisResult.whois.domainStatus &&
                              analysisResult.whois.domainStatus
                                .toLowerCase()
                                .startsWith("ok")
                                ? "ok"
                                : "unknown",
                          }}
                        />
                      </div>
                      <div className="risk-score-card">
                        <DomainImportantDates whois={analysisResult.whois} />
                      </div>
                    </div>
                  )}

                  {/* Suspicious Elements Detected */}
                  <div className="content-analysis">
                    <h3>Suspicious Elements Detected</h3>
                    <div className="highlighted-content">
                      {inputType === "domain" ? (
                        (() => {
                          const score = analysisResult.riskScore;
                          if (score === 0) return <span>None</span>;
                          // If suspiciousElements is a string, split by ';' or display as is
                          if (analysisResult.suspiciousElements) {
                            if (
                              Array.isArray(analysisResult.suspiciousElements)
                            ) {
                              return (
                                <ul>
                                  {analysisResult.suspiciousElements.map(
                                    (el, idx) => (
                                      <li key={idx}>{el}</li>
                                    )
                                  )}
                                </ul>
                              );
                            } else {
                              // Try splitting by common delimiters
                              const items = analysisResult.suspiciousElements
                                .split(/;|\.|\n/)
                                .map((s) => s.trim())
                                .filter(Boolean);
                              return (
                                <ul>
                                  {items.map((el, idx) => (
                                    <li key={idx}>{el}</li>
                                  ))}
                                </ul>
                              );
                            }
                          }
                          return <span>Potential issues detected</span>;
                        })()
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              analysisResult.highlightedContent || inputValue,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Security Flags */}
                  {inputType === "domain" && analysisResult.securityFlags && (
                    <div className="flags-section">
                      <h3>Security Flags</h3>
                      <div className="flags-list">
                        <div className="flag-item">
                          <AlertTriangle size={16} />
                          <span>{analysisResult.securityFlags}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {inputType !== "domain" &&
                    Array.isArray(analysisResult.flags) &&
                    analysisResult.flags.length > 0 && (
                      <div className="flags-section">
                        <h3>Security Flags</h3>
                        <div className="flags-list">
                          {analysisResult.flags.map((flag, index) => (
                            <div key={index} className="flag-item">
                              <AlertTriangle size={16} />
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Recommended Actions */}
                  <div className="action-recommendations">
                    <h3>Recommended Actions</h3>
                    <div className="recommendations-grid">
                      <div className="recommendation-item delete-recommendation">
                        <Trash2 size={20} />
                        <span>Delete this content immediately</span>
                      </div>
                      <div className="recommendation-item block-recommendation">
                        <Ban size={20} />
                        <span>Block the sender's address</span>
                      </div>
                      <div className="recommendation-item report-recommendation">
                        <Flag size={20} />
                        <span>Report to your IT security team</span>
                      </div>
                    </div>
                  </div>

                  {/* Community Reporting */}
                  <div className="community-reporting">
                    <button
                      className="community-report-btn"
                      onClick={handleReportToCommunity}
                    >
                      <Users size={20} />
                      <span>Report to Community</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <Trophy size={20} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionToolPage;






