import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { CodePreview } from "./CodePreview";

export function AppGallery() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"my-apps" | "public">("public");
  
  const publicApps = useQuery(api.ai.getPublicApps);
  const userApps = useQuery(api.ai.getUserApps);
  const searchResults = useQuery(
    api.ai.searchApps,
    searchTerm.trim() ? { searchTerm, publicOnly: activeTab === "public" } : "skip"
  );

  const displayApps = searchTerm.trim() 
    ? searchResults || []
    : activeTab === "public" 
      ? publicApps || []
      : userApps || [];

  if (selectedApp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedApp(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            ← Back to Gallery
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedApp.title}
            </h2>
            <p className="text-gray-600 mb-4">{selectedApp.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedApp.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <CodePreview
            html={selectedApp.htmlCode}
            css={selectedApp.cssCode}
            js={selectedApp.jsCode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">App Gallery</h2>
        <p className="text-lg text-gray-600">
          Explore apps created by our AI or browse your own creations
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("public")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "public"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Public Apps
              </button>
              <button
                onClick={() => setActiveTab("my-apps")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "my-apps"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                My Apps
              </button>
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayApps.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedApp(app)}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {app.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {app.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {app.tags?.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {app.tags?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{app.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Created {new Date(app._creationTime).toLocaleDateString()}
                </div>
              </div>
              
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 10px; font-family: Arial, sans-serif; transform: scale(0.5); transform-origin: top left; width: 200%; height: 200%; }
                        ${app.cssCode}
                      </style>
                    </head>
                    <body>
                      ${app.htmlCode.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>|<\/body>[\s\S]*?<\/html>/gi, '')}
                      <script>${app.jsCode}</script>
                    </body>
                    </html>
                  `}
                  className="w-full h-full border-0 pointer-events-none"
                  title={`Preview of ${app.title}`}
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          ))}
        </div>

        {displayApps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No apps found" : "No apps yet"}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? "Try a different search term"
                : activeTab === "my-apps"
                  ? "Create your first app using the Builder"
                  : "Be the first to create and share an app!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
