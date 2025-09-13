import React, { useState } from 'react';
import { checkPhishing, whoisLookup } from '../api';
import DomainRegistrarInfo from '../components/DomainRegistrarInfo';
import DomainImportantDates from '../components/DomainImportantDates';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Mail, 
  Link as LinkIcon, 
  MessageSquare, 
  ArrowRight, 
  RefreshCw,
  Users,
  Award,
  Zap,
  Trash2,
  Ban,
  Flag,
  Star,
  Trophy,
  Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/DetectionToolPage.css';

const DetectionToolPage = () => {
  const [inputType, setInputType] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCrowdBlacklist, setShowCrowdBlacklist] = useState(false);
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'quiz', 'quiz-result', 'results'
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Function to update user XP in localStorage
  const updateUserXP = (xpToAdd) => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.xp = (user.xp || 0) + xpToAdd;
        user.analysesCompleted = (user.analysesCompleted || 0) + 1;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to update user XP:', e);
    }
  };

  const generateQuiz = (content, type) => {
    const quizzes = {
      email: {
        question: "What looks suspicious about this email?",
        options: [
          { id: 'a', text: 'Urgent language demanding immediate action', correct: true },
          { id: 'b', text: 'Professional email signature', correct: false },
          { id: 'c', text: 'Clear sender identification', correct: false },
          { id: 'd', text: 'Nothing seems suspicious', correct: false }
        ]
      },
      link: {
        question: "What makes this link potentially dangerous?",
        options: [
          { id: 'a', text: 'Uses HTTPS protocol', correct: false },
          { id: 'b', text: 'Domain name mimics legitimate sites', correct: true },
          { id: 'c', text: 'Has a clear domain extension', correct: false },
          { id: 'd', text: 'Nothing seems dangerous', correct: false }
        ]
      },
      message: {
        question: "What red flags do you notice in this message?",
        options: [
          { id: 'a', text: 'Requests personal information urgently', correct: true },
          { id: 'b', text: 'Uses proper grammar and spelling', correct: false },
          { id: 'c', text: 'Comes from a known contact', correct: false },
          { id: 'd', text: 'No red flags present', correct: false }
        ]
      }
    };
    return quizzes[type] || quizzes.email;
  };

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    setIsAnalyzing(true);
    // For domain, skip quiz and call whoisLookup
    if (inputType === 'domain') {
      try {
        const response = await whoisLookup(inputValue);
        setAnalysisResult(response.data);
      } catch (error) {
        setAnalysisResult({
          riskLevel: 'high risk',
          riskScore: 100,
          suspiciousElements: 'WHOIS lookup failed',
          securityFlags: 'Unable to analyze domain',
          whois: null
        });
      }
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep('results');
      }, 2000);
      return;
    }
    // Non-domain: normal flow
    // Generate quiz first
    const quiz = generateQuiz(inputValue, inputType);
    setQuizData(quiz);
    try {
      const response = await checkPhishing(inputValue);
      setAnalysisResult(response.data);
    } catch (error) {
      setAnalysisResult({
        riskLevel: 'high',
        riskScore: 75,
        flags: ['Suspicious patterns detected', 'Potential phishing attempt'],
        suggestions: ['Do not click any links', 'Report to security team'],
        highlightedContent: inputValue,
        detectedType: inputType
      });
    }
    // Award XP for successful analysis
    const analysisXP = 30;
    updateUserXP(analysisXP);
    setToastMessage(`Analysis complete! +${analysisXP} XP`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setIsAnalyzing(false);
      setCurrentStep('quiz');
    }, 2000);
  };

  const handleQuizSubmit = () => {
    if (!selectedAnswer || !quizData) return;
    
    // Check if answer is correct
    const selectedOption = quizData.options.find(option => option.id === selectedAnswer);
    const isCorrect = selectedOption?.correct || false;
    
    // Set quiz result
    setQuizResult({
      isCorrect,
      selectedOption,
      correctOption: quizData.options.find(option => option.correct)
    });
    
    // Award XP based on correctness
    const xpGained = isCorrect ? 50 : 25;
    setToastMessage(`${isCorrect ? 'Correct!' : 'Good try!'} +${xpGained} XP`);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
      setCurrentStep('quiz-result');
    }, 2000);
  };

  const handleAnalyzeAnother = () => {
    setInputValue('');
    setAnalysisResult(null);
    setQuizData(null);
    setSelectedAnswer(null);
    setQuizResult(null);
    setCurrentStep('input');
  };

  const handleContinueToResults = () => {
    setCurrentStep('results');
  };

  const handleNewAnalysis = () => {
    handleAnalyzeAnother();
  };

  const handleReportToCommunity = () => {
    // Award XP for community reporting
    const xpGained = 100;
    setToastMessage(`Reported to community! +${xpGained} XP`);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const getAnalyzeButtonText = () => {
    switch (inputType) {
      case 'email': return 'Analyze Email';
      case 'link': return 'Analyze Link';
      case 'message': return 'Analyze Message';
      default: return 'Analyze Content';
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'email': return 'Paste email content here...';
      case 'link': return 'Paste link here...';
      case 'message': return 'Paste message here...';
      default: return 'Paste content to analyze...';
    }
  };

  const getRiskColor = (level, score) => {
    // If score is 75 or above, treat as high risk
    if (typeof score === 'number') {
      if (score >= 75) return '#ff4444'; // High risk
      if (score >= 50) return '#ffaa00'; // Medium risk
      return '#00ff7f'; // Low risk
    }
    switch (level?.toLowerCase()) {
      case 'high':
      case 'high risk': return '#ff4444';
      case 'medium':
      case 'medium risk': return '#ffaa00';
      case 'low':
      case 'low risk': return '#00ff7f';
      default: return '#888888';
    }
  }

  // Helper to map score to risk level string
  const getRiskLevel = (score) => {
  if (score >= 75 && score <= 100) return 'High Risk';
  if (score >= 50 && score < 75) return 'Medium Risk';
  if (score >= 0 && score < 50) return 'Low Risk';
  return 'Unknown';
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle size={24} />;
      case 'medium': return <Clock size={24} />;
      case 'low': return <CheckCircle size={24} />;
      default: return <Shield size={24} />;
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
                animationDuration: `${4 + Math.random() * 4}s`
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
              <p>Upload suspicious emails, links, or messages for AI-powered threat detection</p>
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
          {currentStep === 'input' && (
            <div className="input-section">
              <div className="input-card">
                <div className="content-type-selector">
                  <div className="selector-label">Content Type</div>
                  <div className="selector-buttons">
                    <button 
                      className={`type-btn ${inputType === 'email' ? 'active' : ''}`}
                      onClick={() => setInputType('email')}
                    >
                      <Mail size={20} />
                      <span>Email</span>
                    </button>
                    <button 
                      className={`type-btn ${inputType === 'link' ? 'active' : ''}`}
                      onClick={() => setInputType('link')}
                    >
                      <LinkIcon size={20} />
                      <span>Link</span>
                    </button>
                    <button 
                      className={`type-btn ${inputType === 'message' ? 'active' : ''}`}
                      onClick={() => setInputType('message')}
                    >
                      <MessageSquare size={20} />
                      <span>Message</span>
                    </button>
                    <button 
                      className={`type-btn ${inputType === 'domain' ? 'active' : ''}`}
                      onClick={() => setInputType('domain')}
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
                    placeholder={inputType === 'domain' ? 'Enter domain name (e.g. example.com)' : getPlaceholder()}
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
          {currentStep === 'quiz-result' && quizResult && quizData && (
            <div className="quiz-result-section">
              <div className="quiz-result-card">
                <div className="result-header">
                  <div className={`result-icon ${quizResult.isCorrect ? 'correct' : 'incorrect'}`}>
                    {quizResult.isCorrect ? <CheckCircle size={32} /> : <XCircle size={32} />}
                  </div>
                  <div className="result-content">
                    <h2 className={`result-title ${quizResult.isCorrect ? 'correct' : 'incorrect'}`}>
                      {quizResult.isCorrect ? 'Correct Answer!' : 'Not Quite Right'}
                    </h2>
                    <p className="result-subtitle">
                      {quizResult.isCorrect 
                        ? 'Great job! You identified the security threat correctly.'
                        : 'Good attempt! Let\'s learn from this together.'
                      }
                    </p>
                  </div>
                </div>

                <div className="answer-breakdown">
                  <div className="your-answer">
                    <h3>Your Answer:</h3>
                    <div className={`answer-option ${quizResult.isCorrect ? 'correct' : 'incorrect'}`}>
                      <span className="option-letter">{quizResult.selectedOption.id.toUpperCase()}</span>
                      <span className="option-text">{quizResult.selectedOption.text}</span>
                    </div>
                  </div>

                  {!quizResult.isCorrect && (
                    <div className="correct-answer">
                      <h3>Correct Answer:</h3>
                      <div className="answer-option correct">
                        <span className="option-letter">{quizResult.correctOption.id.toUpperCase()}</span>
                        <span className="option-text">{quizResult.correctOption.text}</span>
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
                        {inputType === 'email' && 'Always be cautious of emails with urgent language, suspicious links, or requests for personal information.'}
                        {inputType === 'link' && 'Check URLs carefully for misspellings, suspicious domains, or redirects to unfamiliar sites.'}
                        {inputType === 'message' && 'Be wary of messages requesting personal information, especially those creating a sense of urgency.'}
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
          {currentStep === 'quiz' && quizData && (
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
                      className={`quiz-option ${selectedAnswer === option.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAnswer(option.id)}
                    >
                      <div className="option-indicator">
                        <span className="option-letter">{option.id.toUpperCase()}</span>
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
          {currentStep === 'results' && analysisResult && (
            <div className="results-section">
              <div className="results-container">
                <div className="results-header">
                  <div className="analysis-summary">
                    <div className="content-preview">
                      <h3>Analysis Complete</h3>
                      <p className="analyzed-content">
                        {inputValue.substring(0, 100)}{inputValue.length > 100 ? '...' : ''}
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
                        <h2 className="risk-level" style={{ color: getRiskColor(analysisResult.riskLevel, analysisResult.riskScore) }}>
                          {getRiskLevel(analysisResult.riskScore).toUpperCase()}
                        </h2>
                        <div className="risk-score-display">
                          <span className="score-number">{(() => {
                            // Map riskScore for domain type
                            if (inputType === 'domain') {
                              switch (analysisResult.riskScore) {
                                case 0: return 0;
                                case 1: return 25;
                                case 2: return 50;
                                case 3: return 75;
                                case 4: return 100;
                                default: return analysisResult.riskScore;
                              }
                            }
                            return analysisResult.riskScore;
                          })()}</span>
                          <span className="score-total">/100</span>
                        </div>
                      </div>
                    </div>
                        <div className="risk-bar">
                          <div 
                            className="risk-fill" 
                            style={{ 
                              width: `${(() => {
                                if (inputType === 'domain') {
                                  switch (analysisResult.riskScore) {
                                    case 0: return 0;
                                    case 1: return 25;
                                    case 2: return 50;
                                    case 3: return 75;
                                    case 4: return 100;
                                    default: return analysisResult.riskScore;
                                  }
                                }
                                return analysisResult.riskScore;
                              })()}%`,
                              backgroundColor: getRiskColor(analysisResult.riskLevel, analysisResult.riskScore)
                            }}
                          ></div>
                        </div>
                  </div>

                  {/* Domain WHOIS Results */}
                  {inputType === 'domain' && analysisResult.whois && (
                    <div className="domain-results-grid">
                      <div className="risk-score-card">
                        <DomainRegistrarInfo whois={{
                          ...analysisResult.whois,
                          domainStatus: analysisResult.whois.domainStatus && analysisResult.whois.domainStatus.toLowerCase().startsWith('ok') ? 'ok' : 'unknown'
                        }} />
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
                      {inputType === 'domain'
                        ? (() => {
                            const score = analysisResult.riskScore;
                            if (score === 0) return <span>None</span>;
                            // If suspiciousElements is a string, split by ';' or display as is
                            if (analysisResult.suspiciousElements) {
                              if (Array.isArray(analysisResult.suspiciousElements)) {
                                return (
                                  <ul>
                                    {analysisResult.suspiciousElements.map((el, idx) => <li key={idx}>{el}</li>)}
                                  </ul>
                                );
                              } else {
                                // Try splitting by common delimiters
                                const items = analysisResult.suspiciousElements.split(/;|\.|\n/).map(s => s.trim()).filter(Boolean);
                                return (
                                  <ul>
                                    {items.map((el, idx) => <li key={idx}>{el}</li>)}
                                  </ul>
                                );
                              }
                            }
                            return <span>Potential issues detected</span>;
                          })()
                        : <div dangerouslySetInnerHTML={{ __html: analysisResult.highlightedContent || inputValue }} />
                      }
                    </div>
                  </div>

                  {/* Security Flags */}
                  {inputType === 'domain' && analysisResult.securityFlags && (
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
                  {inputType !== 'domain' && Array.isArray(analysisResult.flags) && analysisResult.flags.length > 0 && (
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
