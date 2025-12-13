import { NextRequest, NextResponse } from 'next/server'
import { PinataSDK } from 'pinata-web3'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const metadataString = formData.get('metadata') as string

        if (!file || !metadataString) {
            return NextResponse.json(
                { success: false, error: 'Missing file or metadata' },
                { status: 400 }
            )
        }

        const metadata = JSON.parse(metadataString)

        // Check for Pinata JWT
        if (!process.env.PINATA_JWT) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Pinata JWT not configured. Please add PINATA_JWT to .env.local',
                },
                { status: 500 }
            )
        }

        // Initialize Pinata client
        const pinata = new PinataSDK({
            pinataJwt: process.env.PINATA_JWT,
        })

        console.log('📤 Uploading to Pinata IPFS...')
        console.log('  File:', file.name, `(${file.size} bytes)`)
        console.log('  Metadata:', metadata.title)

        // Upload media file
        const mediaUpload = await pinata.upload.file(file)
        const mediaUri = `ipfs://${mediaUpload.IpfsHash}`
        console.log('✅ Media uploaded:', mediaUri)

        // Upload metadata
        const metadataUpload = await pinata.upload.json(metadata)
        const metadataUri = `ipfs://${metadataUpload.IpfsHash}`
        console.log('✅ Metadata uploaded:', metadataUri)

        return NextResponse.json({
            success: true,
            mediaUri,
            metadataUri,
        })
    } catch (error) {
        console.error('❌ IPFS upload error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to upload to IPFS',
            },
            { status: 500 }
        )
    }
}
