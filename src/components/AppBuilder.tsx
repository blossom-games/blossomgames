import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { CodePreview } from "./CodePreview";
import { Id } from "../../convex/_generated/dataModel";

export function AppBuilder() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerationId, setCurrentGenerationId] = useState<Id<"generations"> | null>(null);
  
  const generateApp = useAction(api.ai.generateApp);
  const saveApp = useMutation(api.ai.saveApp);
  const generation = useQuery(
    api.ai.getGeneration,
    currentGenerationId ? { generationId: currentGenerationId } : "skip"
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your app");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateApp({ prompt });
      setCurrentGenerationId(result.generationId);
      toast.success("App generated successfully!");
    } catch (error) {
      toast.error("Failed to generate app. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generation?.result) return;

    try {
      await saveApp({
        title: generation.result.title,
        description: generation.result.description,
        htmlCode: generation.result.html,
        cssCode: generation.result.css,
        jsCode: generation.result.js,
        prompt: generation.prompt,
        isPublic: true,
        tags: [],
      });
      toast.success("App saved to gallery!");
    } catch (error) {
      toast.error("Failed to save app");
      console.error(error);
    }
  };

  const examplePrompts = [
    "A todo list app with drag and drop functionality",
    "A calculator with scientific functions and history",
    "A weather dashboard with animated icons",
    "A memory card game with different difficulty levels",
    "A drawing app with multiple brush tools and colors",
    "A music player with playlist management",
    "A expense tracker with charts and categories",
    "A pomodoro timer with customizable intervals"
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Describe Your App
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell our AI what kind of application you want to build. Be as detailed as possible for the best results.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              App Description
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the app you want to build... (e.g., 'A task management app with drag and drop, dark mode, and local storage')"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isGenerating}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Example prompts:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating App...
              </span>
            ) : (
              "Generate App"
            )}
          </button>
        </div>

        {generation && (
          <div className="mt-8">
            {generation.status === "pending" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800">Generating your app...</span>
                </div>
              </div>
            )}

            {generation.status === "failed" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  Failed to generate app: {generation.error}
                </p>
              </div>
            )}

            {generation.status === "completed" && generation.result && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {generation.result.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {generation.result.description}
                      </p>
                    </div>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save to Gallery
                    </button>
                  </div>
                  
                  <CodePreview
                    html={generation.result.html}
                    css={generation.result.css}
                    js={generation.result.js}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
