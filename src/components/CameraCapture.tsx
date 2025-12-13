'use client'

import { useEffect } from 'react'
import { useCamera } from '@/hooks/useCamera'

interface CameraCaptureProps {
    onPhotoCapture?: (media: any) => void
    onVideoCapture?: (media: any) => void
}

export function CameraCapture({ onPhotoCapture, onVideoCapture }: CameraCaptureProps) {
    const {
        videoRef,
        stream,
        isCapturing,
        hasPermission,
        error,
        startCamera,
        stopCamera,
        capturePhoto,
        startRecording,
        stopRecording,
        cleanup,
    } = useCamera()

    useEffect(() => {
        return () => cleanup()
    }, [cleanup])

    const handleCapturePhoto = async () => {
        const media = await capturePhoto()
        if (media && onPhotoCapture) {
            onPhotoCapture(media)
        }
    }

    const handleStartRecording = () => {
        startRecording()
    }

    const handleStopRecording = async () => {
        const media = await stopRecording()
        if (media && onVideoCapture) {
            onVideoCapture(media)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Camera View */}
                <div className="relative aspect-video bg-black">
                    {stream ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900">
                            <div className="text-center space-y-4">
                                <svg
                                    className="w-24 h-24 mx-auto text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <p className="text-xl font-semibold">Camera Not Active</p>
                                {hasPermission === false && (
                                    <p className="text-red-400 text-sm">Camera permission denied</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recording Indicator */}
                    {isCapturing && (
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-full">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                            <span className="text-white font-semibold">REC</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        {!stream ? (
                            <>
                                <button
                                    onClick={() => startCamera('environment')}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    📷 Start Camera (Back)
                                </button>
                                <button
                                    onClick={() => startCamera('user')}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    🤳 Start Camera (Front)
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleCapturePhoto}
                                    disabled={isCapturing}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    📸 Capture Photo
                                </button>

                                {!isCapturing ? (
                                    <button
                                        onClick={handleStartRecording}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                    >
                                        🎥 Start Recording
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStopRecording}
                                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-pulse"
                                    >
                                        ⏹️ Stop Recording
                                    </button>
                                )}

                                <button
                                    onClick={stopCamera}
                                    disabled={isCapturing}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ⏸️ Stop Camera
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
