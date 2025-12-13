'use client'

import { useState } from 'react'
import Link from 'next/link'
import { WalletConnect } from '@/components/WalletConnect'
import { RemixRequest } from '@/types'

export default function RemixPage() {
    const [sourceIPId, setSourceIPId] = useState('')
    const [remixPrompt, setRemixPrompt] = useState('')
    const [style, setStyle] = useState<string>('creative')
    const [model, setModel] = useState<'openai' | 'anthropic' | 'gemini'>('openai')
    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleGenerate = async () => {
        if (!sourceIPId || !remixPrompt) {
            setError('Please provide both Source IP ID and Remix Prompt')
            return
        }

        setIsGenerating(true)
        setError('')
        setResult('')

        try {
            const response = await fetch('/api/remix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceIPId,
                    sourceMediaUrl: '', // Would be fetched from IP Asset
                    remixPrompt,
                    style,
                    model,
                } as RemixRequest),
            })

            const data = await response.json()

            if (data.success) {
                setResult(data.description || 'Remix generated successfully!')
            } else {
                setError(data.error || 'Failed to generate remix')
            }
        } catch (err) {
            setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setIsGenerating(false)
        }
    }

    const styles = [
        { value: 'creative', label: '🎨 Creative Transformation' },
        { value: 'anime', label: '🎎 Anime Style' },
        { value: 'cyberpunk', label: '🤖 Cyberpunk' },
        { value: 'watercolor', label: '🎨 Watercolor Painting' },
        { value: 'vintage', label: '📷 Vintage Film' },
        { value: '3d-render', label: '🎬 3D Render' },
    ]

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            ⛓️ ChainCapture
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/capture" className="text-gray-300 hover:text-white transition-colors font-semibold">
                                📷 Capture
                            </Link>
                            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors font-semibold">
                                📊 Dashboard
                            </Link>
                            <WalletConnect />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Page Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            🤖 AI Remix Studio
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Generate derivative content with automatic IP attribution & royalties
                        </p>
                    </div>

                    {/* ABV.dev Badge */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-4">
                        <div className="flex items-center gap-3 text-purple-300">
                            <span className="text-xl">⚡</span>
                            <p className="text-sm font-semibold">
                                Powered by ABV.dev - Automatic IP registration on Story Protocol
                            </p>
                        </div>
                    </div>

                    {/* Remix Form */}
                    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white">Generate Remix</h2>

                        <div className="space-y-4">
                            {/* Source IP ID */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Source IP Asset ID *
                                </label>
                                <input
                                    type="text"
                                    value={sourceIPId}
                                    onChange={(e) => setSourceIPId(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">The IP Asset ID you want to create a derivative from</p>
                            </div>

                            {/* Remix Prompt */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Remix Prompt *
                                </label>
                                <textarea
                                    value={remixPrompt}
                                    onChange={(e) => setRemixPrompt(e.target.value)}
                                    placeholder="Describe how you want to remix this content..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                />
                            </div>

                            {/* Style Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Style
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {styles.map(({ value, label }) => (
                                        <button
                                            key={value}
                                            onClick={() => setStyle(value)}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${style === value
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AI Model Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    AI Model
                                </label>
                                <div className="flex gap-3">
                                    {(['openai', 'anthropic', 'gemini'] as const).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setModel(m)}
                                            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${model === m
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                                }`}
                                        >
                                            {m === 'openai' ? '🤖 OpenAI' : m === 'anthropic' ? '🧠 Anthropic' : '✨ Gemini'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !sourceIPId || !remixPrompt}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isGenerating ? '⏳ Generating...' : '🚀 Generate Remix'}
                            </button>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Result Display */}
                        {result && (
                            <div className="bg-green-500/20 border border-green-500 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2">✅ Remix Generated!</h3>
                                <div className="text-gray-200 whitespace-pre-wrap">{result}</div>
                                <div className="mt-4 text-sm text-green-300">
                                    ABV.dev has automatically registered this as a derivative IP Asset on Story Protocol
                                </div>
                            </div>
                        )}
                    </div>

                    {/* How It Works */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">🔄 How ABV.dev AI Remix Works</h3>
                        <ol className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">1</span>
                                <span>Select a registered IP Asset as your source</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">2</span>
                                <span>Describe your remix with a prompt and choose a style</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">3</span>
                                <span>ABV.dev generates the content using your chosen AI model</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">4</span>
                                <span>Output is automatically registered as a derivative IP on Story Protocol</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">5</span>
                                <span>Original creator receives automatic royalty attribution</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </main>
        </div>
    )
}
