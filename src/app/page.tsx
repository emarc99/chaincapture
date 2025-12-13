import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ⛓️ ChainCapture
            </h1>
            <Link
              href="/capture"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Launch App →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Turn Your Camera Into an
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                IP Registration Tool
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Capture photos and videos that are instantly protected on Story Protocol
              with cryptographic provenance
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Capture</h3>
              <p className="text-gray-400">
                Use any camera device to capture photos and videos with automatic IP registration
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-2">AI Remix Engine</h3>
              <p className="text-gray-400">
                Generate new content from registered IP with automatic attribution and royalties
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">Auto Royalties</h3>
              <p className="text-gray-400">
                Smart contracts ensure transparent attribution and automatic royalty distribution
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 space-y-6">
            <Link
              href="/capture"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105"
            >
              🚀 Start Creating
            </Link>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span>Powered by Story Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                <span>ABV.dev AI Integration</span>
              </div>
            </div>
          </div>

          {/* Built for Hackathon */}
          <div className="mt-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 text-purple-300">
              <span className="text-2xl">🏆</span>
              <p className="text-sm font-semibold">
                Built for Encode Club's Surreal World Assets Buildathon
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 ChainCapture - Bridging Real-World Creativity and Programmable IP</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
