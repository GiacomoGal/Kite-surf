/**
 * Highlight reel manifest — curated 60s edit from build_highlight.py
 */

export interface HighlightClip {
  file: string;
  label: string;
  duration: number;
}

export interface HighlightManifest {
  total_clips: number;
  total_duration: number;
  clips: HighlightClip[];
}

export const highlightManifest: HighlightManifest = {
  total_clips: 13,
  total_duration: 54.18,
  clips: [
    { file: "hl_01_kite_open.mp4", label: "kite_open", duration: 3.0 },
    { file: "hl_02_close_start.mp4", label: "close_start", duration: 4.02 },
    { file: "hl_03_first_ride.mp4", label: "first_ride", duration: 4.02 },
    { file: "hl_04_kite_cut1.mp4", label: "kite_cut1", duration: 2.0 },
    { file: "hl_05_mid_ride.mp4", label: "mid_ride", duration: 5.01 },
    { file: "hl_06_wide_panoramic.mp4", label: "wide_panoramic", duration: 3.0 },
    { file: "hl_07_intense_ride.mp4", label: "intense_ride", duration: 4.02 },
    { file: "hl_08_audience.mp4", label: "audience", duration: 1.52 },
    { file: "hl_09_wave_ride.mp4", label: "wave_ride", duration: 5.01 },
    { file: "hl_10_kite_spin.mp4", label: "kite_spin", duration: 3.567 },
    { file: "hl_11_the_jump.mp4", label: "the_jump", duration: 9.99 },
    { file: "hl_12_ride_out.mp4", label: "ride_out", duration: 4.02 },
    { file: "hl_13_kite_finale.mp4", label: "kite_finale", duration: 5.0 },
  ],
};
