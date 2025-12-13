'use client'

import { useState } from 'react'
import { CapturedMedia, IPMetadata } from '@/types'
import { MEDIA_TYPES } from '@/utils/constants'

interface MediaPreviewProps {
    media: CapturedMedia
    onSubmit?: (media: CapturedMedia, metadata: IPMetadata) => void
    onCancel?: () => void
}

export function MediaPreview({ media, onSubmit, onCancel }: MediaPreviewProps) {
    const [metadata, setMetadata] = useState<Partial<IPMetadata>>({
        title: '',
        description: '',
        tags: [],
        captureDate: new Date().toISOString(),
    })
    const [tagInput, setTagInput] = useState('')

    const handleAddTag = () => {
        if (tagInput.trim() && (!metadata.tags || metadata.tags.length < 5)) {
            setMetadata(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()],
            }))
            setTagInput('')
        }
    }

    const handleRemoveTag = (index: number) => {
        setMetadata(prev => ({
            ...prev,
            tags: prev.tags?.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = () => {
        if (!metadata.title || !metadata.description) {
            alert('Please fill in title and description')
            return
        }

        const completeMetadata: IPMetadata = {
            title: metadata.title,
            description: metadata.description,
            ipType: media.type,
            creators: [], // Will be filled with wallet address
            captureDate: metadata.captureDate || new Date().toISOString(),
            tags: metadata.tags,
        }

        onSubmit?.(media, completeMetadata)
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Media Preview */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Preview</h3>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                        {media.type === MEDIA_TYPES.IMAGE ? (
                            <img
                                src={media.url}
                                alt="Captured"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <video
                                src={media.url}
                                controls
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                        <p>Type: {media.type === MEDIA_TYPES.IMAGE ? '📷 Photo' : '🎥 Video'}</p>
                        <p>Captured: {new Date(media.timestamp).toLocaleString()}</p>
                    </div>
                </div>

                {/* Metadata Form */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">IP Metadata</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={metadata.title || ''}
                                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Give your creation a title"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={metadata.description || ''}
                                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your creation"
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Tags (max 5)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    placeholder="Add tags..."
                                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    onClick={handleAddTag}
                                    disabled={!tagInput.trim() || (metadata.tags?.length || 0) >= 5}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Add
                                </button>
                            </div>
                            {metadata.tags && metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {metadata.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => handleRemoveTag(index)}
                                                className="hover:text-white transition-colors"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            🚀 Register as IP
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
