import { ScanResult, SafetySettings } from './types';

export const mockScanResults: ScanResult[] = [
  { id: '1', userId: 'u1', userName: 'Alice Johnson', thumbnail: '', uploadTime: '2026-07-15T09:30:00', scanResult: 'Clean', confidence: 0.98, status: 'approved', reason: '', moderatorNotes: '' },
  { id: '2', userId: 'u2', userName: 'Bob Smith', thumbnail: '', uploadTime: '2026-07-15T10:15:00', scanResult: 'NSFW Detected', confidence: 0.87, status: 'rejected', reason: 'Adult content detected', moderatorNotes: 'Explicit imagery - rejected per policy' },
  { id: '3', userId: 'u3', userName: 'Carol White', thumbnail: '', uploadTime: '2026-07-15T11:00:00', scanResult: 'Face Match', confidence: 0.95, status: 'approved', reason: '', moderatorNotes: '' },
  { id: '4', userId: 'u4', userName: 'David Brown', thumbnail: '', uploadTime: '2026-07-14T14:30:00', scanResult: 'Duplicate', confidence: 0.92, status: 'flagged', reason: 'Duplicate image detected', moderatorNotes: 'Possible spam - pending review' },
  { id: '5', userId: 'u5', userName: 'Eve Davis', thumbnail: '', uploadTime: '2026-07-14T08:00:00', scanResult: 'Pending Analysis', confidence: 0, status: 'pending', reason: 'Awaiting scan results', moderatorNotes: '' },
  { id: '6', userId: 'u6', userName: 'Frank Miller', thumbnail: '', uploadTime: '2026-07-13T16:45:00', scanResult: 'Clean', confidence: 0.99, status: 'approved', reason: '', moderatorNotes: '' },
  { id: '7', userId: 'u7', userName: 'Grace Wilson', thumbnail: '', uploadTime: '2026-07-13T12:20:00', scanResult: 'Watermark Detected', confidence: 0.76, status: 'flagged', reason: 'Possible copyright violation', moderatorNotes: 'Needs copyright check' },
  { id: '8', userId: 'u8', userName: 'Henry Lee', thumbnail: '', uploadTime: '2026-07-12T10:00:00', scanResult: 'Scanning...', confidence: 0, status: 'scanning', reason: 'In progress', moderatorNotes: '' },
  { id: '9', userId: 'u9', userName: 'Ivy Chen', thumbnail: '', uploadTime: '2026-07-12T09:15:00', scanResult: 'Clean', confidence: 0.97, status: 'approved', reason: '', moderatorNotes: '' },
  { id: '10', userId: 'u10', userName: 'Jack Taylor', thumbnail: '', uploadTime: '2026-07-11T15:30:00', scanResult: 'NSFW Detected', confidence: 0.94, status: 'rejected', reason: 'Explicit content', moderatorNotes: 'Rejected - NSFW content' },
];

export const mockSafetySettings: SafetySettings = {
  enableAiScanning: true,
  enableFaceDetection: true,
  enableNsfwDetection: true,
  enableDuplicateDetection: true,
  enableWatermarkDetection: false,
  enableIdentityMatching: true,
  minimumConfidence: 0.75,
  autoReject: false,
  manualReview: true,
  maxUploadSize: 10,
  allowedImageTypes: 'png, jpg, webp',
  blockedWords: 'violence, gore, explicit, hate, weapons',
  blockedPromptList: 'nude, naked, sexual, gore, violent',
  negativePromptSettings: 'low quality, blurry, distorted, deformed, bad anatomy',
};
