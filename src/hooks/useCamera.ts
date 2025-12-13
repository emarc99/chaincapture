'use client'

import { useState, useRef, useCallback } from 'react'
import { CapturedMedia, MediaType } from '@/types'
import { MEDIA_TYPES } from '@/utils/constants'

export function useCamera() {
    const [isCapturing, setIsCapturing] = useState(false)
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<string | null>(null)

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    /**
     * Request camera permission and start stream
     */
    const startCamera = useCallback(async (facingMode: 'user' | 'environment' = 'environment') => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode },
                audio: false,
            })

            setStream(mediaStream)
            setHasPermission(true)
            setError(null)

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }

            return mediaStream
        } catch (err) {
            console.error('Error accessing camera:', err)
            setHasPermission(false)
            setError('Failed to access camera. Please grant permission.')
            throw err
        }
    }, [])

    /**
     * Stop camera stream
     */
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
    }, [stream])

    /**
     * Capture a photo from the video stream
     */
    const capturePhoto = useCallback((): CapturedMedia | null => {
        if (!videoRef.current || !stream) {
            setError('Camera not ready')
            return null
        }

        try {
            const video = videoRef.current
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                throw new Error('Failed to get canvas context')
            }

            ctx.drawImage(video, 0, 0)

            return new Promise<CapturedMedia>((resolve) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        setError('Failed to capture photo')
                        resolve(null as any)
                        return
                    }

                    const url = URL.createObjectURL(blob)
                    const media: CapturedMedia = {
                        id: `photo-${Date.now()}`,
                        type: MEDIA_TYPES.IMAGE,
                        blob,
                        url,
                        timestamp: Date.now(),
                    }

                    resolve(media)
                }, 'image/jpeg', 0.95)
            })
        } catch (err) {
            console.error('Error capturing photo:', err)
            setError('Failed to capture photo')
            return null
        }
    }, [stream])

    /**
     * Start video recording
     */
    const startRecording = useCallback(() => {
        if (!stream) {
            setError('Camera not ready')
            return
        }

        try {
            chunksRef.current = []
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm',
            })

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data)
                }
            }

            mediaRecorder.start()
            mediaRecorderRef.current = mediaRecorder
            setIsCapturing(true)
            setError(null)
        } catch (err) {
            console.error('Error starting recording:', err)
            setError('Failed to start recording')
        }
    }, [stream])

    /**
     * Stop video recording and return captured media
     */
    const stopRecording = useCallback((): Promise<CapturedMedia | null> => {
        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current

            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                setError('No active recording')
                resolve(null)
                return
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' })
                const url = URL.createObjectURL(blob)

                const media: CapturedMedia = {
                    id: `video-${Date.now()}`,
                    type: MEDIA_TYPES.VIDEO,
                    blob,
                    url,
                    timestamp: Date.now(),
                }

                setIsCapturing(false)
                resolve(media)
            }

            mediaRecorder.stop()
        })
    }, [])

    /**
     * Clean up resources
     */
    const cleanup = useCallback(() => {
        stopCamera()
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
    }, [stopCamera])

    return {
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
    }
}
