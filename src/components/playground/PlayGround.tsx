import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { modelsList, completeChat } from '@/utils/hf';
import { Slider } from './Components';
import { Modal } from '@/components/ui';

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

    // LocalStorage keys
    const LS_PREFIX = 'face_playground_';
    const LS_PROJECTS_KEY = `${LS_PREFIX}projects`;

    // Load projects from localStorage
    useEffect(() => {
        // Load saved projects
        const savedProjects = localStorage.getItem(LS_PROJECTS_KEY);

        if (savedProjects) {
            const projectsData = JSON.parse(savedProjects);
            setProjects(
                [...projectsData.map(project => ({
                    name: project.name,
                    value: project.name
                })), { name: "Default", value: "Default" }]);

            // Select the latest saved project (last one in the array)
            if (projectsData.length > 0) {
                const latestProject = projectsData[projectsData.length - 1];
                setSelectedProject(latestProject.name);
                setMessages(latestProject.messages || []);
                setSystemPrompt(latestProject.systemPrompt || "");
            } else {
                // If no saved projects, use Default project
                setSelectedProject("Default");
            }
        } else if (projects.length === 0) {
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
        setProjects([...projectsData.map(project => ({
            name: project.name,
            value: project.name
        })), { name: "Default", value: "Default" }]);
    };

    const handleTemplateChange = (e) => {
        const selected = e.target.value;
        if (selected === "Default") {
            setMessages([]);
            setSelectedProject("Default");
            setSystemPrompt("");
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
            }
        }
    };

    const handleSaveProject = () => {
        if (selectedProject === "Default") {
            // Ask for a name if default project
            setNewProjectName(`Project${projects.length + 1}`);
            setSaveProjectModal(true);
        } else {
            // Save to existing project
            saveProjectToLocalStorage(selectedProject);
        }
    };

    const handleSaveNewProject = () => {
        if (newProjectName.trim() === '') return;

        saveProjectToLocalStorage(newProjectName);
        setSelectedProject(newProjectName);
        setSaveProjectModal(false);
    };

    const handleRunMessage = async () => {
        if (userMessage.trim().length === 0) return;

        const newMessages = [
            ...messages,
            {
                role: "user",
                content: userMessage
            }
        ];

        setMessages([
            ...newMessages,
            {
                role: "assistant",
                thinking: "<think>\nGenerating response...\n</think>",
                content: "..."
            }
        ]);
        setUserMessage("");

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
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages.pop(); // Remove the last assistant message
                return updatedMessages;
            });
            alert("Error fetching response. Please try again.");
        }
    };

    const handleClearMessages = () => {
        if (confirm("Are you sure you want to clear all messages?")) {
            setMessages([]);
            // Note: We don't clear in localStorage, only when user clicks save
        }
    };

    return (
        <div className="flex flex-col h-screen" style={{ marginTop: "110px" }}>
            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* System sidebar */}
                <div className="w-64 border-r p-4 overflow-y-auto">
                    <div className="text-sm font-medium mb-2 text-gray-900">SYSTEM</div>

                    {/* Template dropdown and save button */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative flex-1 mr-2">
                            <select
                                value={selectedProject}
                                onChange={handleTemplateChange}
                                className="w-full border rounded p-2 pr-8 focus:outline-none focus:ring-1 appearance-none text-gray-900"
                            >
                                {projects.map((template, index) => (
                                    <option key={index} value={template.value}>{template.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-2 top-3 pointer-events-none text-gray-500" />
                        </div>
                        <button
                            onClick={handleSaveProject}
                            className="px-3 py-2 border rounded text-sm text-gray-900"
                        >
                            Save
                        </button>
                    </div>

                    <div className="mb-4 text-sm">
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="w-full h-80 border rounded p-2 text-gray-900"
                            placeholder="Enter system prompt here..."
                        />
                    </div>
                </div>

                {/* Chat container */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto p-4 pb-2">
                        {messages.map((message, index) => (
                            <div key={index} className="mb-4">
                                <div className="text-sm font-medium mb-2 text-gray-900">{message.role}</div>
                                {message.role === "assistant" && message.thinking && (
                                    <div className="p-3 rounded-md mb-2 font-mono text-sm border text-gray-500">
                                        {message.thinking}
                                    </div>
                                )}
                                <div className="text-gray-500">
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* User input area */}
                    <div className="border-t p-4 mt-auto">
                        <div className="flex">
                            <textarea
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                className="flex-1 border rounded p-2 mr-2 text-gray-900"
                                placeholder="Enter your message here..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleRunMessage();
                                    }
                                }}
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end mt-2" style={{ marginBottom: "120px" }}>
                            <button
                                onClick={handleClearMessages}
                                className="px-4 py-2 border rounded mr-2 text-gray-900"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleRunMessage}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                disabled={userMessage.trim() === ""}
                            >
                                Run
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings sidebar */}
                <div className="w-80 border-l p-6 overflow-y-auto">
                    {/* Settings content (unchanged) */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">Models</h3>
                            <span className="text-xs px-2 py-1 rounded border text-gray-500">125</span>
                        </div>
                        <div className="space-y-3">
                            <div className="relative">
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="border rounded p-2 pr-8 focus:outline-none focus:ring-1 appearance-none w-full text-gray-900"
                                >
                                    {models.map((model, index) => (
                                        <option key={index} value={model.model}>{model.model}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-2 top-3 pointer-events-none text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-medium mb-4 text-gray-900">Temperature</h3>
                        <Slider
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            min={0}
                            max={1}
                            step={0.01}
                            displayValue={temperature.toFixed(1)}
                        />
                    </div>

                    <div className="mb-8">
                        <h3 className="font-medium mb-4 text-gray-900">Max Tokens</h3>
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
                    </div>

                    <div className="mb-8">
                        <h3 className="font-medium mb-4 text-gray-900">Top-P</h3>
                        <Slider
                            value={topP}
                            onChange={(e) => setTopP(parseFloat(e.target.value))}
                            min={0}
                            max={1}
                            step={0.01}
                            displayValue={topP.toFixed(1)}
                        />
                    </div>
                </div>
            </div>

            {/* Save Project Modal */}
            <Modal
                show={saveProjectModal}
                onClose={() => setSaveProjectModal(false)}
                title="Save Project"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">Enter a name for your project:</p>
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full border rounded p-2 text-gray-900"
                        placeholder="Project Name"
                        autoFocus
                    />
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={() => setSaveProjectModal(false)}
                            className="px-4 py-2 border rounded mr-2 text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveNewProject}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={newProjectName.trim() === ''}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FacePlayground;