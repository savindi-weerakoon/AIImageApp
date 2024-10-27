export type Mask = {
    id: string
    name: string
    uri?: string
    type?: string
}

export type User = {
    id: string;
    name: string;
    email: string;
    token: string;
};

export type AuthContextType = {
    user: User | null;
    signIn: (userData: User) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
};

export type SaveImageDetailsHook = {
    saveImageDetails: (downloadUrl: string) => Promise<void>
    isSaving: boolean
    error: string | null
}

export type UseImageUploadHook = {
    isUploading: boolean;
    progress: number;
    uploadImage: (imageUrl: string, saveImageDetails: (url: string) => Promise<void>) => Promise<void>;
};  

type ImageData = {
    id: string;
    uid: string;
    email: string;
    imageUrl: string;
    uploadedAt: string;
  };
  
export type UseFetchImagesHook = {
    images: ImageData[];
    isLoading: boolean;
    error: string | null;
    fetchImages: (uid?: string) => Promise<void>;
};