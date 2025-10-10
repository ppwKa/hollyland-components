export interface SourceItem {
    media: string;
    src: string;
    src2x?: string;
}

export interface LazyPictureProps {
    defaultSrc: string;
    sources: SourceItem[];
    isWelcome?: boolean;
}