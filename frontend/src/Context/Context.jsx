import { createContext, useState, useRef, useEffect } from "react";
import { marked } from "marked";
import { GoogleGenAI } from "@google/genai";
export const Context = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateNewChat = async () => {
  try {
    const response = await fetch(`${backendUrl}/conversation/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New Chat",
        messages: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting to backend:", error);
    return null;
  }
};

export const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [allowSending, setAllowSending] = useState(true);
  const [stopIcon, setStopIcon] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const stopReplyRef = useRef(false);

  const [conversation, setConversation] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [updateSidebar, setUpdateSidebar] = useState(true);
  const [updateSidebar2, setUpdateSidebar2] = useState(true);
  const createNewChat = async () => {
    stopReply();
    if (conversation.title !== "New Chat") {
      const newChat = await generateNewChat();
      setConversation(newChat);
      setActiveConversationId(newChat.sessionId);
    }
  };

  useEffect(() => {
    const getConvo = async () => {
      const response = await fetch(`${backendUrl}/conversation/initial`, {
        method: "GET",
      });
      const result = await response.json();
      {
        setConversation(result);

        setActiveConversationId(result.sessionId);
      }
    };
    getConvo();
  }, [updateSidebar2]);

  useEffect(() => {
    if (!activeConversationId) return;
    const getCurrentConversation = async () => {
      stopReplyRef.current = true;
      const response = await fetch(`${backendUrl}/conversation/active/${activeConversationId}`);
      const result = await response.json();
      if (result && result.sessionId !== conversation.sessionId) {
        setConversation(result);
      }
    };
    getCurrentConversation();
  }, [activeConversationId]);

  const getSuggestions = async () => {
    try {
      const response = await fetch(`${backendUrl}/suggestions/`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  const onSent = async (prompt, file) => {
    const userPrompt = prompt || input;

    setAllowSending(false);
    setLoading(true);
    stopReplyRef.current = false;
    setStopIcon(true);
    setShowResult(true);

    const userMessage = { type: "user", text: userPrompt };
    const botMessage = { type: "bot", text: "..." };

    setConversation((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), userMessage, botMessage],
    }));

    setInput("");

    const formData = new FormData();
    formData.append("message", userPrompt);
    if (file) formData.append("file", file);

    // const userPayload = {
    //   query: userPrompt,
    //   collection_name: "SLURM",
    //   k: 3,
    //   expand_with_model_knowledge: true,
    //   gemini_api_key: "AIzaSyCHrXPFGHX565uVzOVECqjsN6m77_VN9n0",
    // };

    // let botReply;
    // const apiUrl = import.meta.env.VITE_API_URL;
    // console.log(apiUrl);
    // try {
    //   const response = await fetch(`${apiUrl}/rag/answer`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(userPayload),
    //   });

    //   console.log("Response status:", response.status);

    //   if (response.ok) {
    //     const result = await response.json();
    //     console.log("Raw result object:", result);

    //     if (result && result.answer) {
    //       botReply = { response: result.answer };
    //     } else {
    //       console.error("Unexpected response structure:", result);
    //       botReply = {
    //         response: "Unexpected response format from RAG service",
    //       };
    //     }
    //   } else {
    //     console.error("Error:", response.statusText);
    //     botReply = { response: `Error: ${response.statusText}` };
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   botReply = { response: `Error: ${error.message}` };
    // }

    // const formattedResponse = marked(
    //   botReply?.response || "Something went wrong"
    // );

    // await sleep(1000);

    let botReply;
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        botReply = result;
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(conversation);
    const converted = conversation.messages.map((msg) => ({
      role: msg.type === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Add system prompt at the beginning to guide the model behavior
    converted.unshift({
      role: "user",
      parts: [
        {
          text: `You are Orbit, an AI-powered internal virtual assistant designed to support service engineers in managing system reliability, debugging distributed compute environments, and accelerating root cause analysis. Orbit streamlines internal workflows by offering technical guidance across common infrastructure issues, including system diagnostics, configuration analysis, and performance troubleshooting.

Orbit is not a customer-facing product. It is used by internal engineering teams working on HPE-managed compute clusters and high-availability environments.

🔧 Primary Responsibilities
Orbit supports common lifecycle and system maintenance scenarios, such as:

Build environment errors or compilation failures

Node-level issues: hangs, crashes, or reboots

Performance bottlenecks or resource contention

Network and interconnect faults

HA (High Availability) cluster stability

SLURM job scheduling failures or delays

Configuration file validation and troubleshooting

🧠 Capabilities

Orbit is built to:

Analyze and explain error messages, logs, and known fault patterns

Suggest CLI commands, config snippets, or script templates when helpful

Respond to broader system admin, devops, or Linux-level questions as needed

Maintain conversational context and history across sessions

Guide engineers with internal processes or expected remediation steps

🖥️ Interface Context

Chat Input: Engineers describe symptoms or ask for assistance

Suggestion Cards: Orbit recommends contextual follow-up prompts

Sidebar: Engineers manage session threads, rename or delete them

File Uploads: Log/config uploads supported in newer builds (if enabled)

🎯 Response Guidelines

Default to clear, concise, technically helpful replies

Prioritize internal terminology and engineering relevance

Offer command examples, config file fixes, or script patterns when applicable

If clarification is needed (e.g., unclear symptoms), ask for it directly

If a feature is not yet available (e.g., uploads), state so plainly

Do not mention backend architecture unless directly asked

Orbit’s primary focus remains on lifecycle management and engineering support, but it may assist with related infrastructure, scripting, system configuration, or diagnostic questions to better serve internal engineers.
---
Use this context to reply to the following user message:

`,
        },
      ],
    });

    // Add the final question as the last message
    converted.push({
      role: "user",
      parts: [{ text: prompt }],
    });
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: converted,
      });
      console.log(response);
      botReply = response.text;
    }

    await main();
    const formattedResponse = marked(botReply || "Something went wrong");
    console.log("Formatted response:", formattedResponse);
    console.log("Bot reply:", botReply);
    console.log("User message:", userMessage);
    console.log(conversation);

    await sleep(1000);

    let currentIndex = 0;

    const typeBotResponse = () => {
      setConversation((prev) => {
        const updatedMessages = [...prev.messages];
        const currentText = formattedResponse.slice(0, currentIndex);
        updatedMessages[updatedMessages.length - 1] = {
          type: "bot",
          text: marked(currentText),
        };
        return {
          ...prev,
          messages: updatedMessages,
        };
      });

      currentIndex++;

      if (currentIndex <= formattedResponse.length && !stopReplyRef.current) {
        setTimeout(typeBotResponse, 10);
      } else {
        saveToBackend();
        setLoading(false);
        setStopIcon(false);
        setAllowSending(true);
      }
    };

    typeBotResponse();

    async function saveToBackend() {
      const response = await fetch(`${backendUrl}/conversation/${activeConversationId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userMsg: userMessage,
          botMsg: { type: "bot", text: formattedResponse },
          prompt: userPrompt,
        }),
      });
      const result = await response.json();
      setUpdateSidebar(!updateSidebar);

      if (conversation.title === "New Chat") {
        setConversation((prev) => ({
          ...prev,
          title: userPrompt.slice(0, 20),
        }));
      }
    }

    setLoading(false);
  };

  const stopReply = () => {
    stopReplyRef.current = true;
    setLoading(false);
    setAllowSending(true);
    setStopIcon(false);

    setConversation((prev) => {
      const messages = [...prev.messages];
      if (messages.length && messages[messages.length - 1].type === "bot") {
        messages[messages.length - 1] = {
          type: "bot",
          text: messages[messages.length - 1].text,
        };
      }
      return {
        ...prev,
        messages,
      };
    });
  };

  return (
    <Context.Provider
      value={{
        conversation,
        setActiveConversationId,
        activeConversationId,
        onSent,
        input,
        setInput,
        loading,
        showResult,
        allowSending,
        stopReply,
        stopIcon,
        suggestions,
        createNewChat,
        updateSidebar,
        setUpdateSidebar,
        updateSidebar2,
        setUpdateSidebar2,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

// export default ContextProvider;
