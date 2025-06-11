// Base URLS
export const BASE_PROD = "https://example.com/";
export const BASE_STAGING = "https://example-staging.com/";
export const BASE_LOCAL = "http://localhost:8000/";
// Pre trained URLS
export const SENTIMENT_ANALYSIS = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/sentiment-analysis`;
export const FACE_DETECTION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/face-detection`;
export const TEXT_MODERATION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/text-moderation`;
export const IMAGE_SIMILARITY = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/image-similarity`;
export const IMAGE_SEARCH_SIMILARITY = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/image-similarity/v2/search`;
export const DEMOGRAPHIC_RECOGNITION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/demographic-recognition`;
export const PII_EXTRACTOR = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/pii-extraction`;
export const EMOTION_RECOGNITION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/emotion-recognition`;
export const POSE_DETECTION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/pose-detection`;
export const PEOPLE_VEHICLE_DETECTION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/people-and-vehicle-detection`;
export const AADHAR_OCR = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/aadhar-data-extraction`;
export const PAN_OCR = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/pan-data-extraction`;
export const VOTER_OCR = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/voter-data-extraction`;
export const IMAGE_BACKGROUND_REMOVAL = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/remove-background`;
export const SIGNATURE_DETECTION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/signature-detection`;
export const WOUND_SEGMENTATION = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/wound-segmentation`;
// export const TABLE_EXTRACTOR = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/table-extractor`;
export const TABLE_EXTRACTOR = `${process.env.NEXT_PUBLIC_API_PRETRAINED_SERVER}/extract-table`;
