import { Prompt } from './types';

export const mockPrompts: Prompt[] = [
  {
    id: '1', title: 'Studio Portrait Base', description: 'Base prompt for studio portrait generation',
    content: 'Generate a professional studio portrait using the uploaded face. Place the subject against a plain background. Use soft diffused key lighting with a subtle rim light. Maintain facial identity precisely. Keep skin tones natural. Ensure eyes are sharp and in focus.',
    negativePrompt: 'distorted face, unnatural proportions, harsh shadows, oversaturated colors', variables: 'lighting_style, background_color',
    category: 'General Prompt', status: 'active', createdAt: '2026-06-01T10:00:00', updatedAt: '2026-06-15T14:00:00',
  },
  {
    id: '2', title: 'Outdoor Nature Background', description: 'Prompt for placing subjects in natural outdoor settings',
    content: 'Create an outdoor nature scene with the uploaded face. Place the subject in a park or garden setting with natural greenery. Use golden hour lighting for warm tones. Maintain facial identity. Blur background slightly for depth of field.',
    negativePrompt: 'urban elements, unnatural lighting, distorted face', variables: 'location, time_of_day',
    category: 'Background Prompt', status: 'active', createdAt: '2026-05-20T08:00:00', updatedAt: '2026-06-10T12:00:00',
  },
  {
    id: '3', title: 'Christmas Theme', description: 'Holiday-themed prompt for Christmas portraits',
    content: 'Generate a Christmas-themed portrait. Place the subject in a cozy living room with a decorated Christmas tree. Add warm fairy lights and fireplace glow. Maintain facial identity. Use red and gold color accents. Add subtle snow effect outside the window.',
    negativePrompt: 'summer elements, beach, halloween motifs, distorted face', variables: 'tree_style, light_color',
    category: 'Theme Prompt', status: 'active', createdAt: '2026-04-15T09:00:00', updatedAt: '2026-05-01T11:00:00',
  },
  {
    id: '4', title: 'July Summer Scene', description: 'Monthly summer-themed background prompt for July',
    content: 'Create a vibrant summer scene for July. Place the subject at a sunny beach or poolside. Use bright natural lighting with blue skies. Add summer elements like sunglasses, hat, or beach umbrella. Maintain facial identity. Keep the mood cheerful and relaxed.',
    negativePrompt: 'winter clothing, snow, dark atmosphere, distorted face', variables: 'location, outfit_style',
    category: 'Monthly Prompt', status: 'active', createdAt: '2026-07-01T06:00:00', updatedAt: '2026-07-01T06:00:00',
  },
  {
    id: '5', title: 'Holiday Greeting Card', description: 'Generic holiday greeting card prompt',
    content: 'Generate a holiday greeting card style portrait. Place the subject in a festive setting with appropriate holiday decorations. Use warm inviting lighting. Maintain facial identity. Add text overlay space at the bottom. Keep the overall mood cheerful and celebratory.',
    negativePrompt: 'sad expressions, dark themes, distorted face', variables: 'holiday_type, greeting_text',
    category: 'Holiday Prompt', status: 'active', createdAt: '2026-03-10T07:00:00', updatedAt: '2026-05-20T10:00:00',
  },
  {
    id: '6', title: 'Birthday Party Scene', description: 'Birthday celebration scene generator',
    content: 'Create a birthday party scene with the uploaded face. Add birthday cake, balloons, party hats, and confetti. Use warm celebratory lighting. Maintain facial identity. Make the subject look happy and engaged. Add gift boxes in the background.',
    negativePrompt: 'sad atmosphere, hospital setting, school setting, distorted face', variables: 'age_number, party_theme',
    category: 'Birthday Prompt', status: 'active', createdAt: '2026-02-20T11:00:00', updatedAt: '2026-04-01T09:00:00',
  },
  {
    id: '7', title: 'System Identity Check', description: 'System-level identity verification prompt',
    content: 'Verify facial identity preservation. Generate a front-facing portrait with minimal styling. Use neutral lighting and plain background. Ensure all facial features are accurately reproduced including eye color, face shape, skin tone, and hair style.',
    negativePrompt: 'any style alterations, age modification, gender modification', variables: '',
    category: 'System Prompt', status: 'active', createdAt: '2026-01-05T14:00:00', updatedAt: '2026-02-01T10:00:00',
  },
  {
    id: '8', title: 'NSFW Content Filter', description: 'Safety prompt to prevent inappropriate content generation',
    content: 'REJECT: This prompt appears to request adult, explicit, or inappropriate content. Do not generate any images that contain nudity, sexual content, violence, gore, hate speech, or any material that violates content policies. Return a safety warning instead.',
    negativePrompt: '', variables: '',
    category: 'Safety Prompt', status: 'active', createdAt: '2025-12-01T08:00:00', updatedAt: '2026-01-10T15:00:00',
  },
  {
    id: '9', title: 'Negative Low Quality', description: 'Negative prompt to filter out low quality results',
    content: 'low quality, blurry, pixelated, distorted, deformed, ugly, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck',
    negativePrompt: '', variables: '',
    category: 'Negative Prompt', status: 'active', createdAt: '2026-06-15T12:00:00', updatedAt: '2026-06-20T14:00:00',
  },
  {
    id: '10', title: 'Classroom Setting', description: 'School classroom background prompt',
    content: 'Generate a classroom setting with the uploaded face. Place the subject at a school desk with books and educational materials. Use bright fluorescent lighting typical of classrooms. Maintain facial identity. Add a chalkboard or whiteboard in the background.',
    negativePrompt: 'outdoor setting, home setting, distorted face', variables: 'grade_level, subject',
    category: 'Background Prompt', status: 'draft', createdAt: '2026-07-10T09:00:00', updatedAt: '2026-07-10T09:00:00',
  },
  {
    id: '11', title: 'Graduation Ceremony', description: 'Graduation day ceremony prompt',
    content: 'Create a graduation ceremony scene. Place the subject wearing a cap and gown on stage or in front of the university building. Add diploma and celebratory elements. Use bright outdoor or auditorium lighting. Maintain facial identity with a proud expression.',
    negativePrompt: 'casual clothing, sad expression, distorted face', variables: 'degree_type, university_name',
    category: 'Theme Prompt', status: 'active', createdAt: '2026-04-01T10:00:00', updatedAt: '2026-04-15T11:00:00',
  },
  {
    id: '12', title: 'Newborn Photography', description: 'Gentle newborn photography prompt',
    content: 'Generate a gentle newborn portrait. Place the baby in a soft cozy nest or wrap using plush blankets. Use very soft diffused lighting from the side. Keep the image warm with beige and pastel tones. Ensure the baby appears comfortable and peaceful.',
    negativePrompt: 'harsh lighting, bright colors, busy background, distorted face', variables: 'blanket_color, prop_style',
    category: 'General Prompt', status: 'active', createdAt: '2025-11-15T08:00:00', updatedAt: '2026-01-05T14:00:00',
  },
];
