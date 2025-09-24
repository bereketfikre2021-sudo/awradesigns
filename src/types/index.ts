// Core Types
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  tags: string[];
  year: number;
  location: string;
  area: string;
  budget: string;
  duration: string;
  features: string[];
  technologies: string[];
  client: string;
  testimonial?: string;
  rating: number;
  isFeatured: boolean;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  pricing: {
    basic: number;
    standard: number;
    premium: number;
  };
  duration: string;
  isPopular: boolean;
  category: 'interior' | 'exterior' | 'consultation' | 'maintenance';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  project?: string;
  date: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  skills: string[];
  experience: number;
  education: string;
  certifications: string[];
  social: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}

// 3D and Animation Types
export interface ThreeDScene {
  id: string;
  name: string;
  models: ThreeDModel[];
  lighting: LightingConfig;
  camera: CameraConfig;
  environment: EnvironmentConfig;
  animations: AnimationConfig[];
}

export interface ThreeDModel {
  id: string;
  name: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  materials: MaterialConfig[];
  animations: ModelAnimation[];
}

export interface MaterialConfig {
  name: string;
  type: 'standard' | 'physical' | 'toon' | 'custom';
  color: string;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
  normalMap?: string;
  displacementMap?: string;
  aoMap?: string;
}

export interface LightingConfig {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: [number, number, number];
  };
  point: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    distance: number;
    decay: number;
  }>;
}

export interface CameraConfig {
  type: 'perspective' | 'orthographic';
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

export interface EnvironmentConfig {
  background: string | string[];
  fog: {
    color: string;
    near: number;
    far: number;
  };
  postprocessing: PostProcessingConfig;
}

export interface PostProcessingConfig {
  bloom: {
    enabled: boolean;
    threshold: number;
    strength: number;
    radius: number;
  };
  ssao: {
    enabled: boolean;
    intensity: number;
    radius: number;
  };
  dof: {
    enabled: boolean;
    focus: number;
    aperture: number;
    maxblur: number;
  };
}

export interface AnimationConfig {
  id: string;
  name: string;
  type: 'rotation' | 'translation' | 'scale' | 'color' | 'custom';
  duration: number;
  delay: number;
  easing: string;
  loop: boolean;
  target: string;
  properties: Record<string, any>;
}

export interface ModelAnimation {
  name: string;
  duration: number;
  loop: boolean;
  tracks: AnimationTrack[];
}

export interface AnimationTrack {
  property: string;
  keyframes: Keyframe[];
}

export interface Keyframe {
  time: number;
  value: any;
  easing?: string;
}

// AI and Interactive Types
export interface AIConfig {
  enabled: boolean;
  model: 'gpt-4' | 'claude' | 'local';
  features: {
    chat: boolean;
    recommendations: boolean;
    designGeneration: boolean;
    colorPalette: boolean;
    spaceOptimization: boolean;
  };
  apiKey?: string;
  endpoint?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DesignRecommendation {
  id: string;
  type: 'color' | 'furniture' | 'layout' | 'lighting' | 'material';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  alternatives: string[];
  cost: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// State Management Types
export interface AppState {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  user: User | null;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  team: TeamMember[];
  currentProject: Project | null;
  selectedService: Service | null;
  is3DMode: boolean;
  isARMode: boolean;
  isAIAssistantActive: boolean;
  chatHistory: ChatMessage[];
  recommendations: DesignRecommendation[];
  loading: {
    projects: boolean;
    services: boolean;
    testimonials: boolean;
    team: boolean;
    ai: boolean;
  };
  errors: {
    projects: string | null;
    services: string | null;
    testimonials: string | null;
    team: string | null;
    ai: string | null;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    aiAssistance: boolean;
    analytics: boolean;
  };
  projects: string[];
  favorites: string[];
  history: string[];
  createdAt: Date;
  lastActive: Date;
}

// Performance and Analytics Types
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  frameRate: number;
  networkLatency: number;
  cacheHitRate: number;
  errorRate: number;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'click' | 'scroll' | 'hover' | 'form_submit' | '3d_interaction' | 'ai_interaction';
  element: string;
  data: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

// PWA and Offline Types
export interface PWAConfig {
  enabled: boolean;
  cacheStrategy: 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate';
  offlinePage: string;
  updatePrompt: boolean;
  installPrompt: boolean;
}

export interface OfflineData {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  team: TeamMember[];
  lastSync: Date;
  version: string;
}

// Form and Validation Types
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  preferences: {
    newsletter: boolean;
    sms: boolean;
    call: boolean;
  };
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Utility Types
export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'en' | 'am' | 'ar';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ConnectionType = 'slow' | 'fast' | 'offline';

export interface Viewport {
  width: number;
  height: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
}

export interface Geolocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  source: string;
}

export type EventHandler<T = any> = (event: CustomEvent<T>) => void;
