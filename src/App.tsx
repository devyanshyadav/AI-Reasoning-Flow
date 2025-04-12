import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Share2, Clipboard, Info } from "lucide-react";
import { runAgentStep } from "../src/util/run-agent";

interface StepResponse {
  step: string;
  content: string;
}

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<StepResponse[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("geminiApiKey") || ""
  );
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("geminiApiKey", apiKey);
    }
  }, [apiKey]);

  const runAgent = async () => {
    if (!userInput.trim()) return;

    setIsProcessing(true);
    setSteps([]);
    setCurrentStepIndex(-1);
    setError(null);

    try {
      let allMessages: any[] = [];
      let stepIndex = 0;
      let stepResponse = await runAgentStep(userInput, allMessages, setError);

      while (stepResponse) {
        setSteps((prevSteps) => [...prevSteps, stepResponse!]);
        setCurrentStepIndex(stepIndex);
        allMessages.push({
          role: "model",
          parts: [{ text: JSON.stringify(stepResponse) }],
        });
        if (stepResponse.step === "final_result") {
          break;
        }
        stepResponse = await runAgentStep(userInput, allMessages, setError);
        stepIndex++;
      }
    } catch (err) {
      console.error("Error running agent:", err);
      setError(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const StepCard = ({ step, index }: { step: StepResponse; index: number }) => {
    const isActive = index === currentStepIndex && isProcessing;

    return (
      <div
        className={`flex flex-col relative transition-all duration-500 ${
          isActive ? "scale-100 opacity-100" : "scale-95 opacity-75"
        }`}
      >
        <button
          onClick={() => handleCopy(step.content, index)}
          className="absolute bottom-1 right-1 hover:text-blue-500 transition-colors"
          title="Copy content"
        >
          {copiedIndex === index ? (
            <span className="text-xs font-semibold text-green-500">
              Copied!
            </span>
          ) : (
            <Clipboard size={16} />
          )}
        </button>
        <p className="whitespace-pre-wrap p-3">{step.content}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto h-full">
        <div className="grid grid-cols-2 h-screen *:px-6 divide-slate-300 divide-x">
          <div className="flex flex-col justify-center w-full">
            <header className="mt-8 text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <img src="logo.svg" alt="Logo" className="w-20" />
                <h1 className="text-3xl font-bold text-indigo-900">
                  AI Reasoning Flow
                </h1>
              </div>
              <p className="text-gray-600">
                Visualize the step-by-step thinking process of an AI agent
              </p>
            </header>
            <br />
            <div className="bgGradient p-2 rounded-md">
              <div className="border bg-white rounded-md border-slate-300 overflow-hidden transition-all duration-300">
                <div className="p-4 md:p-6">
                  <div className="relative">
                    <input
                      type="text"
                      onKeyDown={(e) => e.key === "Enter" && runAgent()}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter your question..."
                      className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={runAgent}
                      disabled={isProcessing || !userInput.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-lg disabled:opacity-50 transition-all hover:bg-indigo-700"
                    >
                      {isProcessing ? (
                        <Sparkles size={20} />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <Share2 size={14} />
                      API Settings
                    </button>
                  </div>

                  {showSettings && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg animate-fadeIn">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gemini API Key
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key..."
                        className="w-full p-2 rounded border border-gray-300 text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Your API key is stored locally and never sent to our
                        servers.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <br />
            <div className="bg-gray-100 p-4 rounded-lg inline-flex items-center text-sm text-gray-700">
              <Info size={18} className="text-indigo-600 mr-2" />
              Try asking: "What are the implications of quantum computing for
              cryptography?"
            </div>
          </div>

          {steps.length === 0 && !isProcessing ? (
            <div className="bg-white rounded-xl flex flex-col items-center justify-center p-8 text-center">
              <img src="/gemini.png" alt="Logo" className="w-20 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Ready to Explore
              </h2>
              <p className="text-gray-600 mb-6">
                Enter a question above to see the AI's step-by-step reasoning
                process.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-md p-6 flex flex-col justify-center overflow-hidden">
              <div className="bg-white border-b border-slate-300 grid grid-cols-5 *:p-2">
                {[1, 2, 3, 4, 5].map((e, i) => (
                  <div
                    onClick={() => setCurrentStepIndex(i)}
                    className="text-center cursor-pointer rounded-t-lg"
                    key={i}
                    style={{
                      backgroundColor: currentStepIndex === i ? "#4f39f6" : "",
                      color: currentStepIndex === i ? "white" : "",
                    }}
                  >
                    Step {e}
                  </div>
                ))}
              </div>
              <br />
              {isProcessing && steps.length === 0 && (
                <div className="flex-grow grid place-items-center overflow-y-auto pr-2 pb-4 custom-scrollbar">
                  <span className="loader"></span>
                </div>
              )}
              <div className="flex-grow overflow-y-auto pr-2 pb-4 custom-scrollbar">
                {steps.map((step, index) => {
                  const isOpen = index === currentStepIndex;
                  return (
                    <div
                      key={index}
                      className="mb-2 border border-slate-300 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-start border-b border-slate-300 items-center bg-indigo-50 hover:bg-indigo-100 text-left font-medium *:p-3 relative text-indigo-700"
                        onClick={() => setCurrentStepIndex(index)}
                      >
                        <span className="bg-indigo-500 text-white">
                          {index + 1}
                        </span>
                        <h2 className="capitalize">
                          {step.step.replace(/_/g, " ")}
                        </h2>
                        <span className="absolute right-2">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      <div
                        className={`bg-white transition-all overflow-hidden text-gray-800 ${
                          isOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <StepCard step={step} index={index} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="w-full p-1.5 *:opacity-80 bg-indigo-600 text-white grid place-items-center text-center text-xs">
        <span>
          Made with ❤️ by{" "}
          <a
            href="https://devyanshyadav.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Devyansh Developer
          </a>
        </span>
      </footer>
    </div>
  );
}
