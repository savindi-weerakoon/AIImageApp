import { useState, useCallback } from 'react'
import { auth, firestore } from '@/scripts/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { SaveImageDetailsHook } from '@/types/composables.type'

export function useSaveImageDetails(): SaveImageDetailsHook {
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const saveImageDetails = useCallback(async (downloadUrl: string) => {
        setIsSaving(true)
        setError(null)

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated')
            }

            const userDetails = {
                uid: user.uid,
                email: user.email,
                imageUrl: downloadUrl,
                uploadedAt: new Date().toISOString(),
            };

            await addDoc(collection(firestore, 'uploads'), userDetails)
            console.log('Image details saved to Firestore:', userDetails)
            alert('Image details saved successfully!')
        } catch (err: any) {
            console.error('Error saving details to Firestore:', err)
            setError(err.message);
            alert('Failed to save image details.')
        } finally {
            setIsSaving(false)
        }
    }, [])

    return { saveImageDetails, isSaving, error }
}
