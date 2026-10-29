export interface ScanResult {
  id: string;
  userId: string;
  userName: string;
  thumbnail: string;
  uploadTime: string;
  scanResult: string;
  confidence: number;
  status: 'approved' | 'rejected' | 'flagged' | 'pending' | 'scanning';
  reason: string;
  moderatorNotes: string;
}

export interface SafetySettings {
  enableAiScanning: boolean;
  enableFaceDetection: boolean;
  enableNsfwDetection: boolean;
  enableDuplicateDetection: boolean;
  enableWatermarkDetection: boolean;
  enableIdentityMatching: boolean;
  minimumConfidence: number;
  autoReject: boolean;
  manualReview: boolean;
  maxUploadSize: number;
  allowedImageTypes: string;
  blockedWords: string;
  blockedPromptList: string;
  negativePromptSettings: string;
}
