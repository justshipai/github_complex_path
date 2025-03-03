import { Info, ChevronDown, Rocket, Leaf, Download, Zap, Github, Blocks } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type ToastState = {
  show: boolean;
  message: string;
};

type CommitMessage = {
  title: string;
  description: string;
};

type RepoCreationState = {
  org: GitHubOrg | null;
  name: string;
};

type GitHubOrg = {
  id: string;
  name: string;
  avatar: string;
};

const mockOrgs: GitHubOrg[] = [
  { id: '1', name: 'Personal Account', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=64&h=64&fit=crop&crop=face' },
  { id: '2', name: 'Acme Corp', avatar: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=64&h=64&fit=crop' },
  { id: '3', name: 'Startup Inc', avatar: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=64&h=64&fit=crop' }
];

function App() {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [isGitHubAuthed, setIsGitHubAuthed] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<GitHubOrg | null>(null);
  const [repoCreation, setRepoCreation] = useState<RepoCreationState>({ org: null, name: '' });
  const [authState, setAuthState] = useState<'initial' | 'redirecting' | 'loading'>('initial');
  const [connectedRepo, setConnectedRepo] = useState<string | null>(null);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitMessage, setCommitMessage] = useState<CommitMessage>({ title: '', description: '' });
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });
  const [commitSuccess, setCommitSuccess] = useState(false);
  const [orgSuccess, setOrgSuccess] = useState(false);
  const [showCommitSuccessModal, setShowCommitSuccessModal] = useState(false);
  const [showGitHubStatusModal, setShowGitHubStatusModal] = useState(false);
  const [recentCommits] = useState([
    {
      hash: '3a1b2c4',
      message: 'feat: Update GitHub integration UI',
      date: '2 minutes ago'
    },
    {
      hash: '8d9e5f6',
      message: 'fix: Resolve authentication edge cases',
      date: '1 hour ago'
    },
    {
      hash: '7g6h5i4',
      message: 'chore: Update dependencies',
      date: '2 hours ago'
    }
  ]);

  const handleGitHubClick = () => {
    setShowExportMenu(false);
    setShowGitHubModal(true);
  };

  useEffect(() => {
    if (authState === 'redirecting') {
      // Simulate OAuth redirect
      setTimeout(() => {
        window.location.hash = '#github-callback';
        setAuthState('loading');
      }, 1500);
    }
  }, [authState]);

  useEffect(() => {
    if (window.location.hash === '#github-callback' && authState === 'loading') {
      // Simulate loading GitHub data
      setTimeout(() => {
        setIsGitHubAuthed(true);
        setAuthState('initial');
        window.location.hash = '';
      }, 2000);
    }
  }, [authState]);

  const handleGitHubAuth = () => {
    setAuthState('redirecting');
  };

  const handleOrgSelect = (org: GitHubOrg) => {
    setSelectedOrg(org);
    setRepoCreation({
      org,
      name: `${org.name.toLowerCase().replace(/\s+/g, '-')}-demo`
    });
  };

  const handleCreateRepo = () => {
    // Simulate repo creation
    const repoPath = `${repoCreation.org?.name}/${repoCreation.name}`.toLowerCase().replace(/\s+/g, '-');
    setToast({
      show: true,
      message: `Successfully created repository ${repoPath}`
    });
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
    setConnectedRepo(repoPath);
    setRepoCreation({ org: null, name: '' });
  };

  const handleContinue = () => {
    setOrgSuccess(false);
    setSelectedOrg(null);
  };

  const handleCommit = () => {
    // Simulate commit
    setTimeout(() => {
      setCommitSuccess(true);
      setShowCommitSuccessModal(true);
      setToast({
        show: true,
        message: 'Changes committed successfully to GitHub'
      });
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3000);
    }, 1000);
  };

  useEffect(() => {
    if (showCommitModal) {
      // Simulate LLM generating a commit message
      setTimeout(() => {
        setCommitMessage({
          title: 'feat: Update GitHub integration UI and add two-way sync support',
          description: '- Add connected repository state\n- Implement commit message editor\n- Update modal design for better UX\n- Add explanatory text for sync functionality'
        });
        if (descriptionRef.current) {
          descriptionRef.current.style.height = 'auto';
          descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
        }
      }, 500);
    }
  }, [showCommitModal]);

  return (
    <div className="w-full h-full">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-[52px] bg-[#18181b] border-b border-[#27272a]">
        <div className="flex items-center gap-2">
          <div className="text-white font-bold text-xl">bolt</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowGitHubStatusModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-white bg-[#27272a] hover:bg-[#3f3f46] rounded-md"
          >
            <div className="relative">
              <Github className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#18181b]" />
            </div>
            GitHub
          </button>
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-white bg-[#27272a] hover:bg-[#3f3f46] rounded-md"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Blocks className="w-4 h-4" />
              Integrations
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-48 py-1 bg-[#27272a] rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <button className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#3f3f46] w-full">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#3f3f46] w-full">
                  <Leaf className="w-4 h-4" />
                  Connect to Supabase
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#3f3f46] w-full">
                  <Zap className="w-4 h-4" />
                  Open in StackBlitz
                </button>
                <button 
                  className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#3f3f46] w-full"
                  onClick={handleGitHubClick}
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </button>
              </div>
            )}
            
            {showGitHubModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#18181b] rounded-lg w-[480px] shadow-xl">
                  <div className="p-6 border-b border-[#27272a]">
                    <h2 className="text-lg font-semibold text-white">
                      {connectedRepo ? 'Connected to GitHub' : 'Connect to GitHub'}
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    {!isGitHubAuthed && !connectedRepo ? (
                      <div className="text-center">
                        {authState === 'initial' && (
                          <>
                            <Github className="w-12 h-12 text-white mx-auto mb-4" />
                            <p className="text-sm text-[#fafafa] mb-6">
                              Connect your GitHub account and backup this codebase there to collaborate and edit your code.
                            </p>
                            <button
                              onClick={handleGitHubAuth}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 rounded-md mx-auto"
                            >
                              <Github className="w-4 h-4" />
                              Continue with GitHub
                            </button>
                          </>
                        )}
                        {authState === 'redirecting' && (
                          <>
                            <div className="animate-pulse">
                              <Github className="w-12 h-12 text-white mx-auto mb-4" />
                            </div>
                            <p className="text-sm text-[#fafafa]">
                              Redirecting to GitHub...
                            </p>
                          </>
                        )}
                        {authState === 'loading' && (
                          <>
                            <div className="animate-spin mb-4">
                              <div className="w-12 h-12 border-4 border-[#2ca6ff] border-t-transparent rounded-full" />
                            </div>
                            <p className="text-sm text-[#fafafa]">
                              Loading your GitHub account...
                            </p>
                          </>
                        )}
                      </div>
                    ) : connectedRepo ? (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <Github className="w-8 h-8 text-white" />
                          <div>
                            <p className="text-sm text-[#fafafa]">
                              This project is connected to{' '}
                              <a 
                                href={`https://github.com/${connectedRepo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2ca6ff] hover:underline font-medium"
                              >
                                {connectedRepo}
                              </a>
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-[#27272a] rounded-md p-4 mb-6">
                          <div className="flex gap-3">
                            <Info className="w-4 h-4 text-[#2ca6ff] flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-[#94a3b8] leading-relaxed">
                            Changes you make in Bolt will be automatically committed to GitHub. 
                            Similarly, any changes pushed to the GitHub repository will be 
                            reflected in your Bolt project, enabling seamless collaboration.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowCommitModal(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 rounded-md"
                        >
                          <Github className="w-4 h-4" />
                         Review and save latest changes
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-[#fafafa] mb-4">
                          Select an organization to create the repository in:
                        </p>
                        {!selectedOrg ? (
                          <div className="space-y-2">
                            {mockOrgs.map(org => (
                              <button
                                key={org.id}
                                onClick={() => handleOrgSelect(org)}
                                className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-[#27272a] transition-colors"
                              >
                                <img
                                  src={org.avatar}
                                  alt={org.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm text-white">{org.name}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-6 text-center">
                            <div className="mb-4">
                              <div className="flex items-center gap-3 mb-3">
                                <img
                                  src={selectedOrg.avatar}
                                  alt={selectedOrg.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm text-white">{selectedOrg.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[#71717a]">/</span>
                                <input
                                  type="text"
                                  value={repoCreation.name}
                                  onChange={(e) => setRepoCreation(prev => ({ ...prev, name: e.target.value }))}
                                  className="flex-1 bg-[#27272a] border border-[#3f3f46] rounded-md px-3 py-2 text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#2ca6ff]"
                                  placeholder="repository-name"
                                />
                              </div>
                              <p className="text-xs text-[#71717a] mt-2">
                                This will create a new private repository on GitHub
                              </p>
                            </div>
                            <button
                              onClick={handleCreateRepo}
                              disabled={!repoCreation.name.trim()}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 rounded-md mx-auto"
                            >
                              Create repository
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-[#27272a] flex justify-end">
                    {authState === 'initial' && (
                      <div className="flex-1 flex items-center">
                        <a href="#" className="text-xs text-[#71717a] hover:text-[#a1a1aa]">
                          New to GitHub? Learn more
                        </a>
                      </div>
                    )}
                    <button
                      onClick={() => setShowGitHubModal(false)}
                      disabled={authState !== 'initial'}
                      className="px-4 py-2 text-xs text-[#fafafa] hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 rounded-md">
            <Rocket className="w-4 h-4" />
            Deploy
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-52px)]">
        {/* Left Panel */}
        <div className="w-[400px] flex-shrink-0 border-r border-[var(--bolt-elements-borderColor)] flex flex-col">
          <div className="flex-1 p-4">
            <p className="text-[var(--bolt-elements-textPrimary)] mb-4 text-sm">
              I'm importing your StackBlitz project into Bolt. This may take a moment as I set everything up. Once it's ready, you'll be able to explore and interact with your code.
            </p>

            <div className="bg-[#18181b] rounded-lg border border-[#27272a] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a] text-sm">
                <span className="text-[var(--bolt-elements-textPrimary)]">Importing StackBlitz Project</span>
                <ChevronDown className="w-5 h-5 text-[var(--bolt-elements-textPrimary)]" />
              </div>
            
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 text-green-500">✓</div>
                  <span className="text-[var(--bolt-elements-textPrimary)]">Import sb1-mdwekb14</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 text-green-500">✓</div>
                  <span className="text-[var(--bolt-elements-textPrimary)]">Install dependencies</span>
                </div>
                
                <div className="bg-[#09090b] rounded p-2 font-mono text-sm text-[var(--bolt-elements-textPrimary)]">
                  npm install
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 text-blue-500">→</div>
                  <span className="text-blue-500">Start application</span>
                </div>
                
                <div className="bg-[#09090b] rounded p-2 font-mono text-sm text-[var(--bolt-elements-textPrimary)]">
                  npm run dev
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-[var(--bolt-elements-textPrimary)] text-sm">
              I've successfully imported your project. I'm ready to assist you with analyzing and improving your code.
            </p>
            
            <div className="mt-4 flex items-center gap-2">
              <button className="text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)] text-xs">
                Report Issue
              </button>
              <button className="text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)] text-xs">
                Undo
              </button>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-[var(--bolt-elements-borderColor)]">
            <div className="relative">
              <textarea
                placeholder="/ for prompts & commands (/component, /copy, /api) • Alt/Option for voice prompts"
                className="w-full h-[120px] min-h-[120px] max-h-[200px] bg-[var(--bolt-elements-background-depth-2)] border border-[var(--bolt-elements-borderColor)] rounded-lg px-4 py-3 text-sm text-[var(--bolt-elements-textPrimary)] placeholder-[var(--bolt-elements-textSecondary)] resize-none focus:outline-none focus:border-[#2ca6ff]"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button className="p-1 text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="p-1 text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--bolt-elements-borderColor)]">
            <button className="px-3 py-1 text-sm text-[var(--bolt-elements-textPrimary)] bg-[var(--bolt-elements-background-depth-2)] rounded-md">
              Code
            </button>
            <button className="px-3 py-1 text-sm text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)] rounded-md">
              Preview
            </button>
          </div>

          <div className="flex-1 bg-[var(--bolt-elements-background-depth-2)] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button className="p-1 text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className="text-sm text-[var(--bolt-elements-textSecondary)]">5173</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 8H12.5M12.5 8L9.5 5M12.5 8L9.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="p-1 text-[var(--bolt-elements-textSecondary)] hover:text-[var(--bolt-elements-textPrimary)]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H12V12H4V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="w-full h-full bg-[var(--bolt-elements-background)] rounded-lg border border-[var(--bolt-elements-borderColor)]">
              <div className="h-full flex items-center justify-center">
                <span className="text-sm text-[var(--bolt-elements-textSecondary)]">Preview will appear here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-[#27272a] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm">{toast.message}</p>
          </div>
        </div>
      )}
      
      {/* Commit Success Modal */}
      {showCommitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg w-[480px] shadow-xl">
            <div className="p-6 border-b border-[#27272a]">
              <h2 className="text-lg font-semibold text-white">Review Changes</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-2">Commit Message</label>
                  <input
                    type="text"
                    value={commitMessage.title}
                    onChange={(e) => setCommitMessage(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[#27272a] border border-[#3f3f46] rounded-md px-3 py-2 text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#2ca6ff]"
                    placeholder="Enter a descriptive title for your changes"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white mb-2">Description</label>
                  <textarea
                    ref={descriptionRef}
                    value={commitMessage.description}
                    onChange={(e) => setCommitMessage(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#27272a] border border-[#3f3f46] rounded-md px-3 py-2 text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#2ca6ff] min-h-[100px]"
                    placeholder="Describe your changes in detail"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-[#27272a] flex justify-end gap-2">
              <button
                onClick={() => setShowCommitModal(false)}
                className="px-4 py-2 text-sm text-[#fafafa] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCommitModal(false);
                  handleCommit();
                }}
                className="px-4 py-2 text-sm text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showCommitSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg w-[480px] shadow-xl">
            <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Changes saved</h2>
                  <p className="text-sm text-[#a1a1aa]">Successfully pushed to main branch</p>
                </div>
              </div>
              <button
                onClick={() => setShowCommitSuccessModal(false)}
                className="text-[#71717a] hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-[#27272a] rounded-md p-4">
                  <h3 className="text-sm font-medium text-white mb-4">Updated homepage layout and added login button</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#3f3f46] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3f3f46] flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#2ca6ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-white">What was saved</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[#3f3f46] rounded-md p-3">
                        <p className="text-2xl font-semibold text-white mb-1">4</p>
                        <p className="text-xs text-[#a1a1aa]">Files updated</p>
                      </div>
                      <div className="bg-[#3f3f46] rounded-md p-3">
                        <p className="text-2xl font-semibold text-white mb-1">1</p>
                        <p className="text-xs text-[#a1a1aa]">New file</p>
                      </div>
                      <div className="bg-[#3f3f46] rounded-md p-3">
                        <p className="text-2xl font-semibold text-white mb-1">0</p>
                        <p className="text-xs text-[#a1a1aa]">Files deleted</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/acme-corp/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-[#27272a] hover:bg-[#3f3f46] rounded-md"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                  <button
                    onClick={() => {
                      setShowCommitSuccessModal(false);
                      setShowGitHubStatusModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 rounded-md"
                  >
                    <ChevronDown className="w-4 h-4" />
                    View GitHub Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* GitHub Status Modal */}
      {showGitHubStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg w-[480px] shadow-xl">
            <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="w-6 h-6 text-[#2ca6ff]" />
                <h2 className="text-lg font-semibold text-white">GitHub Status</h2>
              </div>
              <button
                onClick={() => setShowGitHubStatusModal(false)}
                className="text-[#71717a] hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Connection Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-white">Connected to: <span className="font-medium">acme-corp/demo</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white">Linked to:</p>
                    <img
                      src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=32&h=32&fit=crop&crop=face"
                      alt="Profile"
                      className="w-5 h-5 rounded-full"
                    />
                    <p className="text-sm text-white font-medium">John Doe</p>
                  </div>
                </div>
              </div>
              
              {/* Branch & Sync Status */}
              <div className="bg-[#27272a] rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#a1a1aa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                      <path d="M15 6v8a2 2 0 0 1-2 2H9"/>
                      <path d="M9 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                    </svg>
                    <span className="text-sm text-white">Current branch: <span className="font-medium">main</span></span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#3f3f46] p-3 rounded-md">
                  <svg className="w-5 h-5 text-[#2ca6ff] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 12h18" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m15 16-4-4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p className="text-sm text-white mb-2">The main branch in your GitHub repo has new changes.</p>
                    <button className="text-xs text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 px-3 py-1.5 rounded">
                      Pull latest changes
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Changes */}
              <div>
                <h3 className="text-sm font-medium text-white mb-2">⚠️ You have unsaved changes</h3>
                <p className="text-xs text-[#a1a1aa] mb-4">These changes are in Bolt, but not yet saved to GitHub.</p>
                <div className="space-y-2 mb-4">
                  {['homepage.tsx', 'header.tsx', 'footer.tsx', 'App.css'].map((file) => (
                    <div key={file} className="flex items-center gap-2 text-sm text-[#a1a1aa]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {file}
                    </div>
                  ))}
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-[#2ca6ff] hover:bg-[#2ca6ff]/90 rounded-md">
                  <Github className="w-4 h-4" />
                  Update your GitHub repository
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="pt-4 border-t border-[#27272a]">
                <a
                  href="https://github.com/acme-corp/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-[#a1a1aa] hover:text-white transition-colors"
                >
                  <span>Open repository in GitHub</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m10 14 11-11" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <p className="text-xs text-[#71717a] mt-2">Last saved: 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;