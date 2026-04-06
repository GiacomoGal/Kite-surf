/**
 * Scene manifest — auto-generated from detect_scenes.py + upscale pipeline
 * Video format: portrait 612x1080 (upscaled from 480p kitesurf footage)
 */

export interface Scene {
  file: string;
  source: string;
  start: number;
  end: number;
  duration: number;
}

export interface SceneManifest {
  total_scenes: number;
  scenes: Scene[];
}

// Auto-load from manifest.json at build time
// For now, statically imported — will be replaced by manifest sync script
export const sceneManifest: SceneManifest = {
  "total_scenes": 32,
  "scenes": [
    { "file": "video_2_scene_001.mp4", "source": "video_2.mp4", "start": 0.0, "end": 11.31, "duration": 11.31 },
    { "file": "video_2_scene_002.mp4", "source": "video_2.mp4", "start": 20.01, "end": 24.15, "duration": 4.14 },
    { "file": "video_2_scene_003.mp4", "source": "video_2.mp4", "start": 26.73, "end": 39.45, "duration": 12.72 },
    { "file": "video_2_scene_004.mp4", "source": "video_2.mp4", "start": 50.43, "end": 59.7, "duration": 9.27 },
    { "file": "video_2_scene_005.mp4", "source": "video_2.mp4", "start": 63.51, "end": 69.7, "duration": 6.19 },
    { "file": "video_3_scene_001.mp4", "source": "video_3.mp4", "start": 0.0, "end": 3.26, "duration": 3.26 },
    { "file": "video_3_scene_002.mp4", "source": "video_3.mp4", "start": 6.52, "end": 10.29, "duration": 3.77 },
    { "file": "video_3_scene_003.mp4", "source": "video_3.mp4", "start": 11.65, "end": 16.02, "duration": 4.37 },
    { "file": "video_3_scene_004.mp4", "source": "video_3.mp4", "start": 16.02, "end": 19.5, "duration": 3.48 },
    { "file": "video_4_scene_001.mp4", "source": "video_4.mp4", "start": 0.0, "end": 5.63, "duration": 5.63 },
    { "file": "video_4_scene_002.mp4", "source": "video_4.mp4", "start": 7.97, "end": 15.33, "duration": 7.36 },
    { "file": "video_4_scene_003.mp4", "source": "video_4.mp4", "start": 15.33, "end": 19.3, "duration": 3.97 },
    { "file": "vifdeo_1_scene_001.mp4", "source": "vifdeo_1.mp4", "start": 0.0, "end": 10.47, "duration": 10.47 },
    { "file": "vifdeo_1_scene_002.mp4", "source": "vifdeo_1.mp4", "start": 13.41, "end": 16.89, "duration": 3.48 },
    { "file": "vifdeo_1_scene_003.mp4", "source": "vifdeo_1.mp4", "start": 16.89, "end": 23.34, "duration": 6.45 },
    { "file": "vifdeo_1_scene_004.mp4", "source": "vifdeo_1.mp4", "start": 23.34, "end": 29.55, "duration": 6.21 },
    { "file": "vifdeo_1_scene_005.mp4", "source": "vifdeo_1.mp4", "start": 30.72, "end": 34.95, "duration": 4.23 },
    { "file": "vifdeo_1_scene_006.mp4", "source": "vifdeo_1.mp4", "start": 38.55, "end": 42.54, "duration": 3.99 },
    { "file": "vifdeo_1_scene_007.mp4", "source": "vifdeo_1.mp4", "start": 42.54, "end": 53.13, "duration": 10.59 },
    { "file": "vifdeo_1_scene_008.mp4", "source": "vifdeo_1.mp4", "start": 53.13, "end": 65.7, "duration": 12.57 },
    { "file": "vifdeo_1_scene_009.mp4", "source": "vifdeo_1.mp4", "start": 65.7, "end": 69.63, "duration": 3.93 },
    { "file": "vifdeo_1_scene_010.mp4", "source": "vifdeo_1.mp4", "start": 69.63, "end": 72.72, "duration": 3.09 },
    { "file": "vifdeo_1_scene_011.mp4", "source": "vifdeo_1.mp4", "start": 72.72, "end": 77.01, "duration": 4.29 },
    { "file": "vifdeo_1_scene_012.mp4", "source": "vifdeo_1.mp4", "start": 78.0, "end": 84.3, "duration": 6.3 },
    { "file": "vifdeo_1_scene_013.mp4", "source": "vifdeo_1.mp4", "start": 85.95, "end": 110.73, "duration": 24.78 },
    { "file": "vifdeo_1_scene_014.mp4", "source": "vifdeo_1.mp4", "start": 114.99, "end": 119.13, "duration": 4.14 },
    { "file": "vifdeo_1_scene_015.mp4", "source": "vifdeo_1.mp4", "start": 119.13, "end": 123.0, "duration": 3.87 },
    { "file": "vifdeo_1_scene_016.mp4", "source": "vifdeo_1.mp4", "start": 123.0, "end": 126.48, "duration": 3.48 },
    { "file": "vifdeo_1_scene_017.mp4", "source": "vifdeo_1.mp4", "start": 130.23, "end": 133.71, "duration": 3.48 },
    { "file": "vifdeo_1_scene_018.mp4", "source": "vifdeo_1.mp4", "start": 133.71, "end": 138.03, "duration": 4.32 },
    { "file": "vifdeo_1_scene_019.mp4", "source": "vifdeo_1.mp4", "start": 138.03, "end": 151.08, "duration": 13.05 },
    { "file": "vifdeo_1_scene_020.mp4", "source": "vifdeo_1.mp4", "start": 151.08, "end": 156.0, "duration": 4.92 }
  ]
};
