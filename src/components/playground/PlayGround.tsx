import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Settings, FileText, X, Menu, Copy, RotateCcw, Check, BetweenVerticalStart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modelsList, completeChat } from '@/utils/hf';
import { Slider, Dropdown, ThinkingAnimation } from './Components';
import { Modal } from '@/components/ui';

const MAX_SYSTEM_CHARS = 2000;

const FacePlayground = () => {
    const [temperature, setTemperature] = useState(0.5);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [saveProjectModal, setSaveProjectModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [topP, setTopP] = useState(0.5);
    const [selectedModel, setSelectedModel] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "user",
            content: "hey how are you doing"
        },
        {
            role: "assistant",
            thinking: "<think>\nThinking about response...\n</think>",
            content: "im just a large language model and how can I help you today"
        },
    ]);
    const [userMessage, setUserMessage] = useState("");
    const [models, setModels] = useState([] as any);
    const [systemPrompt, setSystemPrompt] = useState("");
    const [projects, setProjects] = useState([
        { name: "Default", value: "Default" },
    ]);
    const [selectedProject, setSelectedProject] = useState("Default");
    const [isProcessing, setIsProcessing] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Responsive drawer state
    const [activeDrawer, setActiveDrawer] = useState<'none' | 'system' | 'settings'>('none');

    // Add a state for success notification
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    // Add states for editing and original content
    const [isEditing, setIsEditing] = useState(false);
    const [originalSystemPrompt, setOriginalSystemPrompt] = useState("");

    // Add state for clear confirmation modal
    const [showClearModal, setShowClearModal] = useState(false);

    // Add a new state to track the save notification message
    const [saveNotificationMessage, setSaveNotificationMessage] = useState("System prompt saved successfully");

    // Toggle drawer function
    const toggleDrawer = (drawer: 'system' | 'settings') => {
        setActiveDrawer(prev => prev === drawer ? 'none' : drawer);
    };

    // Close drawer function
    const closeDrawer = () => {
        setActiveDrawer('none');
    };

    // LocalStorage keys
    const LS_PREFIX = 'face_playground_';
    const LS_PROJECTS_KEY = `${LS_PREFIX}projects`;

    // Load projects from localStorage
    useEffect(() => {
        // Load saved projects
        const savedProjects = localStorage.getItem(LS_PROJECTS_KEY);

        if (savedProjects) {
            const projectsData = JSON.parse(savedProjects);
            
            // Extract custom projects (non-Default)
            const customProjects = projectsData.map(project => ({
                name: project.name,
                value: project.name
            }));
            
            // Always include Default project
            const updatedProjects = [
                ...customProjects,
                { name: "Default", value: "Default" }
            ];
            
            setProjects(updatedProjects);

            // Select the latest saved project (last one in the array)
            if (projectsData.length > 0) {
                const latestProject = projectsData[projectsData.length - 1];
                setSelectedProject(latestProject.name);
                setMessages(latestProject.messages || []);
                setSystemPrompt(latestProject.systemPrompt || "");
                setOriginalSystemPrompt(latestProject.systemPrompt || "");
            } else {
                // If no saved projects, use Default project
                setSelectedProject("Default");
            }
        } else {
            // Use Default project if none exists
            setProjects([{ name: "Default", value: "Default" }]);
            setSelectedProject("Default");
        }

        // Load models
        const ml = modelsList.map(model => {
            return {
                name: model.id,
                model: model.id,
                selected: false,
                provider: model.provider,
            };
        });
        setModels(ml);
        setSelectedModel(ml[0]?.model || "");
    }, []);

    // Save project to localStorage
    const saveProjectToLocalStorage = (projectName) => {
        // Handle Default project specially
        if (projectName === "Default") {
            // For Default project, we don't actually store it in the projects list
            // We just need to update the local state
            return;
        }
        
        const savedProjects = localStorage.getItem(LS_PROJECTS_KEY);
        let projectsData = savedProjects ? JSON.parse(savedProjects) : [];

        // Check if project already exists
        const existingProjectIndex = projectsData.findIndex(p => p.name === projectName);

        if (existingProjectIndex >= 0) {
            // Update existing project
            projectsData[existingProjectIndex] = {
                name: projectName,
                messages,
                systemPrompt,
                timestamp: new Date().toISOString()
            };
        } else {
            // Add new project
            projectsData.push({
                name: projectName,
                messages,
                systemPrompt,
                timestamp: new Date().toISOString()
            });
        }

        localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(projectsData));

        // Update projects in state
        const updatedProjects = projectsData.map(project => ({
            name: project.name,
            value: project.name
        }));
        
        // Always include Default project
        if (!updatedProjects.some(p => p.name === "Default")) {
            updatedProjects.push({ name: "Default", value: "Default" });
        }
        
        setProjects(updatedProjects);
    };

    const handleTemplateChange = (e) => {
        const selected = e.target.value;
        if (selected === "Default") {
            setMessages([]);
            setSelectedProject("Default");
            setSystemPrompt("");
            setOriginalSystemPrompt("");
            return;
        }
        setSelectedProject(selected);
        // Load this project's messages and system prompt
        const savedProjects = localStorage.getItem(LS_PROJECTS_KEY);
        if (savedProjects) {
            const projectsData = JSON.parse(savedProjects);
            const selectedProjectData = projectsData.find(p => p.name === selected);

            if (selectedProjectData) {
                setMessages(selectedProjectData.messages || []);
                setSystemPrompt(selectedProjectData.systemPrompt || "");
                setOriginalSystemPrompt(selectedProjectData.systemPrompt || "");
            }
        }
    };

    const handleSystemPromptChange = (e) => {
        const input = e.target.value;
        if (input.length <= MAX_SYSTEM_CHARS) {
            setSystemPrompt(input);
        }
    };

    // Calculate character count percentage
    const charCountPercentage = (systemPrompt.length / MAX_SYSTEM_CHARS) * 100;
    const isNearLimit = charCountPercentage > 80;
    const isAtLimit = systemPrompt.length === MAX_SYSTEM_CHARS;

    const handleEditPrompt = () => {
        setIsEditing(true);
        setOriginalSystemPrompt(systemPrompt);
    };

    const handleCancelEdit = () => {
        setSystemPrompt(originalSystemPrompt);
        setIsEditing(false);
    };

    const handleClearSystemPrompt = () => {
        // Show our custom modal instead of the default confirm
        setShowClearModal(true);
    };

    // Add function to confirm clearing
    const confirmClearSystemPrompt = () => {
        setSystemPrompt("");
        if (selectedProject !== "Default") {
            setIsEditing(true);
        }
        setShowClearModal(false);
    };

    const handleSaveProject = () => {
        // Determine if this is a new save or an update
        const isUpdate = originalSystemPrompt !== "" && originalSystemPrompt !== systemPrompt;
        
        // Set appropriate notification message
        setSaveNotificationMessage(isUpdate 
            ? "System prompt updated successfully" 
            : "System prompt saved successfully");
        
        if (selectedProject === "Default") {
            // For Default project, we don't need to save to storage
            // Just show confirmation
            setShowSaveConfirmation(true);
            // Hide after 2 seconds
            setTimeout(() => {
                setShowSaveConfirmation(false);
            }, 2000);
        } else {
            // Save to existing project
            saveProjectToLocalStorage(selectedProject);
            setIsEditing(false);
        }
        setOriginalSystemPrompt(systemPrompt);
    };

    const handleSaveNewProject = () => {
        if (newProjectName.trim() === '') return;

        saveProjectToLocalStorage(newProjectName);
        setSelectedProject(newProjectName);
        setSaveProjectModal(false);
    };

    const handleRunMessage = async () => {
        if (userMessage.trim().length === 0) {
            setInputError(true);
            // Focus on the textarea
            textareaRef.current?.focus();
            // Clear the error after 2 seconds
            setTimeout(() => setInputError(false), 2000);
            return;
        }

        const newMessages = [
            ...messages,
            {
                role: "user",
                content: userMessage
            }
        ];

        setMessages(newMessages);
        setUserMessage("");
        setIsProcessing(true);

        let payloadMessage = newMessages.map((message) => ({
            role: String(message.role).toLowerCase(),
            content: message.content
        }));
        if (systemPrompt && systemPrompt.length > 0) {
            payloadMessage = [
                {
                    role: "system",
                    content: systemPrompt.trim()
                },
                ...payloadMessage
            ]
        }

        try {
            let result = await completeChat(
                selectedModel,
                payloadMessage,
                null,
                {
                    temperature,
                    max_tokens: maxTokens,
                    top_p: topP,
                }
            )
            if (result.length > 0) {
                setMessages([
                    ...newMessages,
                    ...result
                ])
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            alert("Error fetching response. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClearMessages = () => {
        setMessages([]);
        // Note: We don't clear in localStorage, only when user clicks save
    };

    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-scroll when messages change or when processing state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    // Close drawer on larger screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setActiveDrawer('none');
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Function to copy message content to clipboard
    const copyToClipboard = (text: string, messageIndex: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedMessageId(messageIndex);
            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setCopiedMessageId(null);
            }, 2000);
        });
    };

    // Function to rerun an AI response with the same prompt
    const rerunMessage = (userMessageIndex: number) => {
        if (isProcessing) return;

        // Get the user message that prompted this response
        const userMessage = messages[userMessageIndex];
        
        if (userMessage && userMessage.role === "user") {
            // Create new messages array up to and including this user message
            const newMessages = messages.slice(0, userMessageIndex + 1);
            
            setMessages(newMessages);
            setIsProcessing(true);

            let payloadMessage = newMessages.map((message) => ({
                role: String(message.role).toLowerCase(),
                content: message.content
            }));
            
            if (systemPrompt && systemPrompt.length > 0) {
                payloadMessage = [
                    {
                        role: "system",
                        content: systemPrompt.trim()
                    },
                    ...payloadMessage
                ]
            }

            completeChat(
                selectedModel,
                payloadMessage,
                null,
                {
                    temperature,
                    max_tokens: maxTokens,
                    top_p: topP,
                }
            )
            .then(result => {
                if (result.length > 0) {
                    setMessages([
                        ...newMessages,
                        ...result
                    ]);
                }
            })
            .catch(error => {
                console.error("Error fetching response:", error);
                alert("Error fetching response. Please try again.");
            })
            .finally(() => {
                setIsProcessing(false);
            });
        }
    };

    useEffect(() => {
        // Prevent body scrolling when this component mounts
        document.body.style.overflow = 'hidden';
        
        return () => {
            // Restore body scrolling when component unmounts
            document.body.style.overflow = '';
        };
    }, []);

    // Add this new function to clear the input text
    const handleClearInput = () => {
        setUserMessage("");
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-50" style={{ top: "110px", bottom: 0, left: 0, right: 0 }}>
            {/* Mobile header - visible only on smaller screens */}
            <div className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-20">
                <div className="text-primary font-medium">AI Playground</div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => toggleDrawer('system')}
                        className={`p-2 rounded-full ${activeDrawer === 'system' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:text-primary hover:bg-slate-50'}`}
                    >
                        <BetweenVerticalStart size={20} />
                    </button>
                    <button 
                        onClick={() => toggleDrawer('settings')}
                        className={`p-2 rounded-full ${activeDrawer === 'settings' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:text-primary hover:bg-slate-50'}`}
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Main content - Fill remaining height */}
            <div className="flex flex-1 overflow-hidden rounded-lg mx-4 mb-4 bg-white border border-slate-100 relative">
                {/* Mobile drawer overlay */}
                <AnimatePresence>
                    {activeDrawer !== 'none' && (
                        <motion.div 
                            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeDrawer}
                        />
                    )}
                </AnimatePresence>

                {/* System sidebar - hidden on mobile unless active */}
                <AnimatePresence>
                    {(activeDrawer === 'system' || window.innerWidth >= 1024) && (
                        <motion.div 
                            className={`${activeDrawer === 'system' ? 'fixed left-0 top-0 bottom-0 z-40 w-[85%] max-w-[320px]' : 'hidden lg:block w-64'} border-r border-slate-100 overflow-y-auto bg-slate-50 h-full`}
                            initial={activeDrawer === 'system' ? { x: -320 } : false}
                            animate={activeDrawer === 'system' ? { x: 0 } : {}}
                            exit={activeDrawer === 'system' ? { x: -320 } : {}}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            <div className="sticky top-0 bg-slate-50 px-5 py-4 border-b border-slate-100 z-10">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold mb-3 text-primary uppercase tracking-wide flex items-center">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                                        System
                                    </div>
                                    {activeDrawer === 'system' && (
                                        <button onClick={closeDrawer} className="p-1 text-slate-400 hover:text-slate-700">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* Project selector */}
                                <div className="flex items-center mb-4">
                                    <div className="flex-grow">
                                        {projects.filter(p => p.name !== "Default").length === 0 ? (
                                            <div className="flex items-center bg-primary-light text-primary px-4 py-3 rounded-lg text-sm font-medium">
                                                <span className="mr-2">Project:</span>
                                                <span className="font-semibold">Default</span>
                                            </div>
                                        ) : (
                                            <Dropdown
                                                value={selectedProject}
                                                onChange={handleTemplateChange}
                                                options={projects}
                                                placeholder="Select a project"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-slate-50">
                                <div className="mb-4 text-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-slate-700">System Prompt</label>
                                        <span className={`text-xs font-medium ${
                                            isAtLimit ? 'text-error' : 
                                            isNearLimit ? 'text-warning' : 
                                            'text-slate-500'
                                        }`}>
                                            {systemPrompt.length}/{MAX_SYSTEM_CHARS}
                                        </span>
                                    </div>
                                    <div className="relative mb-1">
                                        <textarea
                                            value={systemPrompt}
                                            onChange={handleSystemPromptChange}
                                            className={`w-full h-80 border ${
                                                isAtLimit ? 'border-error focus:ring-error' : 
                                                isNearLimit ? 'border-warning focus:ring-warning' : 
                                                'border-slate-200 focus:ring-primary'
                                            } rounded-md p-3 text-slate-800 focus:outline-none focus:ring-2 focus:border-transparent font-mono text-sm resize-none shadow-inner bg-white`}
                                            placeholder="Enter system prompt here..."
                                            maxLength={MAX_SYSTEM_CHARS}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden rounded-b">
                                            <div 
                                                className={`h-full ${
                                                    isAtLimit ? 'bg-error' : 
                                                    isNearLimit ? 'bg-warning' : 
                                                    'bg-primary'
                                                } transition-all duration-300`} 
                                                style={{width: `${charCountPercentage}%`}}
                                            />
                                        </div>
                                    </div>
                                    {isNearLimit && !isAtLimit && (
                                        <p className="text-xs text-warning mt-1">
                                            Approaching character limit
                                        </p>
                                    )}
                                    {isAtLimit && (
                                        <p className="text-xs text-error mt-1">
                                            Character limit reached
                                        </p>
                                    )}
                                    <div className="mt-3 relative">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleClearSystemPrompt}
                                                className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-primary hover:border-primary rounded-lg transition-colors bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-30 flex items-center justify-center"
                                                disabled={systemPrompt.length === 0}
                                            >
                                                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Clear
                                            </button>
                                            
                                            {selectedProject !== "Default" && isEditing && (
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-error hover:border-error rounded-lg transition-colors bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-30 flex items-center justify-center"
                                                >
                                                    <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel
                                                </button>
                                            )}
                                            
                                            {selectedProject !== "Default" && !isEditing && systemPrompt !== originalSystemPrompt && (
                                                <button
                                                    onClick={handleEditPrompt}
                                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-primary hover:border-primary rounded-lg transition-colors bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-30 flex items-center justify-center"
                                                >
                                                    <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={handleSaveProject}
                                                className="flex-grow px-4 py-2 border border-slate-200 text-slate-600 hover:text-primary hover:border-primary rounded-lg transition-colors bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-30 flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                                </svg>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {showSaveConfirmation && (
                                    <div className="fixed bottom-5 inset-x-0 flex justify-center items-center z-50">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="inline-flex items-center bg-primary-light border border-primary/20 text-primary px-5 py-2 rounded-full text-sm font-medium shadow-sm"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="whitespace-nowrap">{saveNotificationMessage}</span>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat container */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white border-x border-slate-100">
                    {/* Messages area - scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 pb-2 space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-6`}>
                                <div className="text-xs font-semibold mb-2 uppercase tracking-wide text-slate-500 flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${message.role === "assistant" ? "bg-primary" : "bg-slate-400"}`}></span>
                                    {message.role}
                                </div>
                                <div className="relative flex">
                                    {message.role === "user" ? (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3 flex-shrink-0">
                                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3 flex-shrink-0">
                                            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 12h16.5M12 3.75v16.5M4.501 5.25l15 13.5M19.499 5.25l-15 13.5" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                                        message.role === "user" 
                                        ? "bg-blue-50 text-slate-700 border border-blue-100 group relative" 
                                        : "bg-slate-50 text-slate-700 border border-slate-200 group relative"
                                    }`}>
                                        {message.role === "assistant" && message.thinking && (
                                            <div className="p-3 mb-3 font-mono text-sm bg-white border border-slate-200 rounded-xl text-slate-600 overflow-x-auto shadow-inner">
                                                {message.thinking}
                                            </div>
                                        )}
                                        <div className={`whitespace-pre-wrap ${message.role === "user" ? "" : ""}`}>
                                            {message.content}
                                        </div>
                                        
                                        {/* Action buttons for AI responses */}
                                        {message.role === "assistant" && (
                                            <div className="flex gap-1.5 mt-3 justify-end">
                                                <button 
                                                    onClick={() => copyToClipboard(message.content, index)}
                                                    className="py-1 px-2 bg-white rounded-md text-slate-600 hover:text-primary border border-slate-200 shadow-sm text-xs font-medium flex items-center"
                                                    title="Copy to clipboard"
                                                >
                                                    {copiedMessageId === index ? (
                                                        <>
                                                            <Check size={14} className="text-green-500 mr-1" />
                                                            <span className="text-green-500">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={14} className="mr-1" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                                
                                                {/* Find the user message that prompted this response and only show regenerate for the latest AI message */}
                                                {index > 0 && 
                                                 messages[index-1].role === "user" && 
                                                 index === messages.reduce((lastIndex, msg, i) => 
                                                    msg.role === "assistant" ? i : lastIndex, -1) && (
                                                    <button 
                                                        onClick={() => rerunMessage(index-1)}
                                                        className="py-1 px-2 bg-white rounded-md text-slate-600 hover:text-primary border border-slate-200 shadow-sm text-xs font-medium flex items-center"
                                                        title="Regenerate response"
                                                        disabled={isProcessing}
                                                    >
                                                        <RotateCcw size={14} className={`mr-1 ${isProcessing ? "opacity-50" : ""}`} />
                                                        <span>Regenerate</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3 flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 12h16.5M12 3.75v16.5M4.501 5.25l15 13.5M19.499 5.25l-15 13.5" />
                                    </svg>
                                </div>
                                <div className="max-w-[80%] rounded-2xl p-4 bg-slate-50 border border-slate-200">
                                    <ThinkingAnimation />
                                </div>
                            </div>
                        )}
                        {messages.length === 0 && !isProcessing && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-slate-400 text-center bg-slate-50 p-8 rounded-lg shadow-inner">
                                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <p className="mb-2 text-xl font-semibold text-primary">No messages yet</p>
                                    <p className="text-sm">Start a conversation below</p>
                                </div>
                            </div>
                        )}
                        {/* Invisible element to scroll to */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* User input area - fixed at bottom */}
                    <div className="border-t border-slate-100 p-5 bg-white">
                        <div className="flex">
                            <textarea
                                ref={textareaRef}
                                value={userMessage}
                                onChange={(e) => {
                                    setUserMessage(e.target.value);
                                    if (e.target.value.trim() !== '') {
                                        setInputError(false);
                                    }
                                }}
                                className={`flex-1 border ${inputError ? 'border-error ring-1 ring-error' : 'border-slate-200'} rounded-lg p-3 mr-2 text-slate-800 focus:outline-none focus:ring-2 ${inputError ? 'focus:ring-error' : 'focus:ring-primary'} focus:border-transparent resize-none shadow-inner transition-all duration-200`}
                                placeholder={inputError ? "Please enter a message" : "Enter your message here..."}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleRunMessage();
                                    }
                                }}
                                rows={3}
                                disabled={isProcessing}
                            />
                        </div>
                        {inputError && (
                            <div className="mt-1 text-error text-xs font-medium animate-bounce">
                                Please enter a message before running
                            </div>
                        )}
                        <div className="flex justify-end mt-3 items-center">
                            <span className="text-xs text-slate-500 mr-auto italic hidden sm:inline-block">Press Shift+Enter for new line</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleClearInput}
                                    className="px-4 py-2 sm:px-5 sm:py-2.5 min-w-[80px] sm:min-w-[90px] border border-slate-200 text-slate-600 hover:text-primary hover:border-primary rounded-lg transition-colors bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 focus:ring-opacity-30 flex items-center justify-center"
                                    disabled={isProcessing || userMessage.trim() === ""}
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={handleRunMessage}
                                    className={`px-4 py-2 sm:px-5 sm:py-2.5 min-w-[80px] sm:min-w-[90px] ${userMessage.trim() === "" ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white hover:shadow-md'} rounded-lg transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 flex items-center justify-center relative group`}
                                    disabled={userMessage.trim() === "" || isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                                            <span className="sm:inline">Processing...</span>
                                        </>
                                    ) : "Run"}
                                    
                                    {userMessage.trim() === "" && !isProcessing && (
                                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                            Enter a message first
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings sidebar - hidden on mobile unless active */}
                <AnimatePresence>
                    {(activeDrawer === 'settings' || window.innerWidth >= 1024) && (
                        <motion.div 
                            className={`${activeDrawer === 'settings' ? 'fixed right-0 top-0 bottom-0 z-40 w-[85%] max-w-[320px]' : 'hidden lg:block w-80'} border-l border-slate-100 overflow-y-auto bg-slate-50 h-full`}
                            initial={activeDrawer === 'settings' ? { x: 320 } : false}
                            animate={activeDrawer === 'settings' ? { x: 0 } : {}}
                            exit={activeDrawer === 'settings' ? { x: 320 } : {}}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            <div className="sticky top-0 bg-slate-50 px-5 py-4 border-b border-slate-100 z-10">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-primary uppercase tracking-wide flex items-center">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                                        Settings
                                    </div>
                                    {activeDrawer === 'settings' && (
                                        <button onClick={closeDrawer} className="p-1 text-slate-400 hover:text-slate-700">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 space-y-8 bg-slate-50">
                                {/* Models section */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-slate-800">Models</h3>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">{models.length}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <Dropdown
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            options={models.map(model => ({
                                                name: model.model,
                                                value: model.model
                                            }))}
                                            placeholder="Select a model"
                                        />
                                    </div>
                                </div>

                                {/* Temperature slider */}
                                <div>
                                    <h3 className="font-medium mb-3 text-slate-800">Temperature</h3>
                                    <Slider
                                        value={temperature}
                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        displayValue={temperature.toFixed(1)}
                                    />
                                    <p className="text-xs text-primary-hover mt-2">Higher values produce more creative outputs</p>
                                </div>

                                {/* Max Tokens slider */}
                                <div>
                                    <h3 className="font-medium mb-3 text-slate-800">Max Tokens</h3>
                                    <div className="flex items-center">
                                        <Slider
                                            displayValue={maxTokens}
                                            value={maxTokens}
                                            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                            min={1}
                                            max={10000}
                                            step={1}
                                            className="flex-1"
                                        />
                                    </div>
                                    <p className="text-xs text-primary-hover mt-2">Maximum length of generated text</p>
                                </div>

                                {/* Top-P slider */}
                                <div>
                                    <h3 className="font-medium mb-3 text-slate-800">Top-P</h3>
                                    <Slider
                                        value={topP}
                                        onChange={(e) => setTopP(parseFloat(e.target.value))}
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        displayValue={topP.toFixed(1)}
                                    />
                                    <p className="text-xs text-primary-hover mt-2">Controls diversity via nucleus sampling</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Save Project Modal */}
            <Modal
                show={saveProjectModal}
                onClose={() => setSaveProjectModal(false)}
                title="Save Project"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">Enter a name for your project:</p>
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full border border-slate-200 rounded-md p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                        placeholder="Project Name"
                        autoFocus
                    />
                    <div className="flex justify-end pt-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSaveProjectModal(false)}
                                className="px-5 py-2.5 min-w-[90px] border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent shadow-sm hover:shadow"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNewProject}
                                className="px-5 py-2.5 min-w-[90px] bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 hover:shadow-md"
                                disabled={newProjectName.trim() === ''}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Clear Confirmation Modal */}
            <Modal
                show={showClearModal}
                onClose={() => setShowClearModal(false)}
                title="Clear System Prompt"
            >
                <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-4 flex items-start">
                        <div className="mr-3 mt-0.5">
                            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-amber-800 text-sm">Are you sure you want to clear the system prompt? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end pt-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowClearModal(false)}
                                className="px-5 py-2.5 min-w-[90px] border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent shadow-sm hover:shadow"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClearSystemPrompt}
                                className="px-5 py-2.5 min-w-[90px] bg-error hover:bg-error/90 text-white rounded-lg transition-colors shadow focus:outline-none focus:ring-2 focus:ring-error focus:ring-opacity-50 hover:shadow-md"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FacePlayground;