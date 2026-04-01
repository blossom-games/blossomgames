import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { AppBuilder } from "./components/AppBuilder";
import { AppGallery } from "./components/AppGallery";
import { useState } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState<"builder" | "gallery">("builder");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI App Builder
            </h1>
            <Authenticated>
              <nav className="flex gap-4">
                <button
                  onClick={() => setCurrentView("builder")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "builder"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Builder
                </button>
                <button
                  onClick={() => setCurrentView("gallery")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "gallery"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Gallery
                </button>
              </nav>
            </Authenticated>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">
        <Content currentView={currentView} />
      </main>
      
      <Toaster />
    </div>
  );
}

function Content({ currentView }: { currentView: "builder" | "gallery" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Build Apps with AI
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Generate complex HTML, CSS, and JavaScript applications instantly using advanced AI
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Generate apps in seconds</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-900">Beautiful Design</h3>
                <p className="text-sm text-gray-600">Modern, responsive layouts</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-gray-900">Production Ready</h3>
                <p className="text-sm text-gray-600">Clean, optimized code</p>
              </div>
            </div>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        {currentView === "builder" ? <AppBuilder /> : <AppGallery />}
      </Authenticated>
    </div>
  );
}
