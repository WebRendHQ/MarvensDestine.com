# Project Videos Directory

This directory contains video files for project showcases that will be displayed instead of or as fallbacks to Spline scenes.

## How it Works

The system supports both video files and Spline scenes with automatic fallback:

1. **Video Priority**: If a project has a `video` field, it will try to load the video first
2. **Spline Fallback**: If the video fails to load or doesn't exist, it falls back to the Spline scene
3. **Spline Only**: Projects can have only Spline scenes (no video field)
4. **Video Only**: Projects can have only videos (no scene field)

## File Naming

Videos should be named descriptively and referenced in the project data:

```typescript
{
  video: "/projects/videos/your-video-name.mp4",
  scene: "https://prod.spline.design/your-spline-url/scene.splinecode", // optional fallback
  title: "Your Project",
  // ... other fields
}
```

## Supported Formats

- **MP4** (recommended) - Best browser support
- **WebM** - Good compression, modern browsers
- **MOV** - Works but larger file sizes

## Video Specifications

For best performance and quality:

- **Resolution**: 1920x1080 or higher
- **Frame Rate**: 30fps or 60fps
- **Codec**: H.264 for MP4
- **Duration**: 10-60 seconds (loops automatically)
- **Audio**: Videos are muted by default
- **File Size**: Keep under 10MB for web performance

## Example Videos to Add

Based on current project data:
- `odesza-showcase.mp4` - ODESZA stage visuals
- `webrender-demo.mp4` - WebRend 3D globe showcase  
- `ethereal-beings-collection.mp4` - NFT collection preview

## Testing

After adding videos:
1. Restart the development server
2. Navigate between projects using the toggle
3. Videos should autoplay and loop
4. If a video fails, it should fallback to Spline automatically 