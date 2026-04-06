/**
 * Highlight V2 manifest — cinematic kitesurf edit
 * Slow-mo on flights + direction changes, no repeated footage
 */

export interface HighlightV2Clip {
  file: string;
  label: string;
  duration: number;
  speed: number;
}

export interface HighlightV2Manifest {
  total_clips: number;
  total_duration: number;
  clips: HighlightV2Clip[];
}

export const highlightV2Manifest: HighlightV2Manifest = {
  total_clips: 17,
  total_duration: 89.77,
  clips: [
    { file: "hl2_01_s1_kite_establish.mp4", label: "s1_kite_establish", duration: 2.5, speed: 1.0 },
    { file: "hl2_02_s1_close_launch.mp4", label: "s1_close_launch", duration: 6.933, speed: 0.5 },
    { file: "hl2_03_s1_sferzata_1.mp4", label: "s1_sferzata_1", duration: 3.933, speed: 0.5 },
    { file: "hl2_04_s1_ride_away.mp4", label: "s1_ride_away", duration: 3.0, speed: 1.0 },
    { file: "hl2_05_s2_mid_ride.mp4", label: "s2_mid_ride", duration: 4.02, speed: 1.0 },
    { file: "hl2_06_s2_kite_aero.mp4", label: "s2_kite_aero", duration: 4.933, speed: 0.7 },
    { file: "hl2_07_s2_approach.mp4", label: "s2_approach", duration: 4.02, speed: 1.0 },
    { file: "hl2_08_s2_panoramic.mp4", label: "s2_panoramic", duration: 3.51, speed: 1.0 },
    { file: "hl2_09_s2_multi_kiters.mp4", label: "s2_multi_kiters", duration: 5.01, speed: 1.0 },
    { file: "hl2_10_s3_audience.mp4", label: "s3_audience", duration: 1.52, speed: 1.0 },
    { file: "hl2_11_s3_sferzata_2.mp4", label: "s3_sferzata_2", duration: 5.9, speed: 0.5 },
    { file: "hl2_12_s3_ride_alt.mp4", label: "s3_ride_alt", duration: 4.02, speed: 1.0 },
    { file: "hl2_13_s4_kite_spin.mp4", label: "s4_kite_spin", duration: 7.9, speed: 0.5 },
    { file: "hl2_14_s4_pre_flight.mp4", label: "s4_pre_flight", duration: 7.933, speed: 0.5 },
    { file: "hl2_15_s4_the_flight.mp4", label: "s4_the_flight", duration: 17.433, speed: 0.4 },
    { file: "hl2_16_s5_ride_out.mp4", label: "s5_ride_out", duration: 3.0, speed: 1.0 },
    { file: "hl2_17_s5_kite_finale.mp4", label: "s5_kite_finale", duration: 4.2, speed: 0.7 },
  ],
};
