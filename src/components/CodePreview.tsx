import { useState } from "react";

interface CodePreviewProps {
  html: string;
  css: string;
  js: string;
}

export function CodePreview({ html, css, js }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "html" | "css" | "js">("preview");

  const createPreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated App</title>
        <style>${css}</style>
      </head>
      <body>
        ${html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>|<\/body>[\s\S]*?<\/html>/gi, '')}
        <script>${js}</script>
      </body>
      </html>
    `;
  };

  const downloadApp = () => {
    const content = createPreviewContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const tabs = [
    { id: "preview", label: "Preview", icon: "👁️" },
    { id: "html", label: "HTML", icon: "🏗️" },
    { id: "css", label: "CSS", icon: "🎨" },
    { id: "js", label: "JavaScript", icon: "⚡" },
  ] as const;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {activeTab !== "preview" && (
            <button
              onClick={() => copyToClipboard(
                activeTab === "html" ? html : activeTab === "css" ? css : js,
                activeTab
              )}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Copy
            </button>
          )}
          <button
            onClick={downloadApp}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      <div className="h-96">
        {activeTab === "preview" && (
          <iframe
            srcDoc={createPreviewContent()}
            className="w-full h-full border-0"
            title="App Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {activeTab === "html" && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm bg-gray-900 text-gray-100 h-full overflow-auto">
              <code>{html}</code>
            </pre>
          </div>
        )}

        {activeTab === "css" && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm bg-gray-900 text-gray-100 h-full overflow-auto">
              <code>{css}</code>
            </pre>
          </div>
        )}

        {activeTab === "js" && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm bg-gray-900 text-gray-100 h-full overflow-auto">
              <code>{js}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
