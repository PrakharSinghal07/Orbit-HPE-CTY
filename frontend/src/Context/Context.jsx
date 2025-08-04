import { createContext, useState, useRef, useEffect } from "react";
import { marked } from "marked";
import { GoogleGenAI } from "@google/genai";
export const Context = createContext();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateNewChat = async () => {
  try {
    const response = await fetch("http://localhost:8000/conversation/create", {
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
      const response = await fetch(`http://127.0.0.1:8000/conversation/initial`, {
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
      const response = await fetch(`http://127.0.0.1:8000/conversation/active/${activeConversationId}`);
      const result = await response.json();
      if (result && result.sessionId !== conversation.sessionId) {
        setConversation(result);
      }
    };
    getCurrentConversation();
  }, [activeConversationId]);

  const getSuggestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/suggestions/");
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
      const response = await fetch("http://127.0.0.1:8000/chat", {
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
          text: `You are the integrated virtual assistant Orbit for Lifecycle Management — an internal AI-powered support tool designed exclusively for service engineers. Orbit streamlines internal workflows by offering intelligent assistance with system diagnostics, configuration analysis, and issue resolution across distributed compute environments.

Orbit is not a customer-facing product; it is built as a core capability to support internal service engineering teams in managing infrastructure reliability, debugging system-level failures, and accelerating root cause analysis.

🔧 Core Capabilities You Understand:

Orbit is used to assist with system lifecycle scenarios such as:

Build environment errors and failures

Node instability: hangs, crashes, reboots

Performance degradation or bottlenecks

Network and connectivity faults

HA (High Availability) cluster issues

SLURM job scheduling delays or failures

The system uses:

LLM + RAG pipeline to generate responses based on KBs, logs, and configs

Chat session model for persistent engineering threads

UI built with React, powered by a FastAPI backend

Log parsing pipeline (upload support rolling out soon)

Session-based conversation sidebar with renaming and delete support

📦 Interface Elements:

Chat Interface: Engineers can input queries in natural language describing symptoms or issues.

Suggestion Cards: Display context-aware prompts to guide query formulation.

Conversation Sidebar: Enables switching between sessions, renaming, and cleanup.

Message Threads: Retain back-and-forth history for ongoing debugging.

File Uploads: Support for diagnostic files (logs, configs) — to be enabled in future versions.

🎯 Response Guidelines:

Keep replies clear, technical, and minimally verbose — no marketing tone.

Address the engineer’s query directly using internal terminology and UI cues.

Assume the user is within the Orbit interface unless otherwise stated.

If a feature isn’t supported yet, indicate it plainly (e.g., “log analysis upload is not available in the current build”).

Avoid implementation-level details unless explicitly requested.

For any troubleshooting query, respond with either:

A guided workflow using existing UI steps

A request for more input or clarification (e.g., “Please specify the log type or upload the error snapshot.”)

Do not mention LLMs, RAG, or backend systems unless asked.

Do not offer unnecessary elaboration about Orbit itself unless prompted.

Ensure compliance with internal usage guidelines and data sensitivity practices.

🧪 Example Queries You May Receive:

“SLURM job stuck in pending. What can cause this?”  

“System rebooted at 04:00, no logs in /var/log/messages — any ideas?”

“How do I start a new session for another node?”

“Can I rename this chat thread?”

“What causes HA failover when both nodes look healthy?”

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
      const response = await fetch(`http://127.0.0.1:8000/conversation/${activeConversationId}`, {
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
