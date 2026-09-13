# FFmpeg Audio Ducking & Video Padding

```bash
# Pad video to 9:16 portrait (1080x1920)
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black" output.mp4

# Duck background audio under voice narration
ffmpeg -i voice.mp3 -i music.mp3 -filter_complex "[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2:duration=first" mixed.mp3
```
