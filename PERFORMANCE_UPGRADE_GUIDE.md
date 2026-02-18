# 🚀 Performance Upgrade Guide - Video Analysis Platform

This guide provides step-by-step instructions to speed up video analysis processing.

---

## 📊 Current Performance Baseline

- **Current Setup:** Hugging Face Spaces - CPU Basic (2 vCPU, 16GB RAM)
- **Typical Processing Time:**
  - 30-second video: 2-5 minutes
  - 1-minute video: 5-10 minutes
  - 3-minute video: 10-20 minutes

---

## 🎯 Upgrade Options (Ranked by Impact)

### Option 1: Upgrade Hugging Face Space Hardware ⭐ RECOMMENDED
**Impact:** 5-10x faster processing  
**Cost:** $0.40/hour (~$12-30/month for moderate use)  
**Difficulty:** Easy (No code changes required)

#### Steps:
1. Go to your Hugging Face Space: https://huggingface.co/spaces/bharathan56/citnow-backend/settings
2. Scroll to **"Space Hardware"** section
3. Select **"Nvidia T4 small"**
   - 4 vCPU
   - 15GB RAM
   - 16GB VRAM (GPU)
   - Cost: $0.40/hour
4. Click **"Update"**
5. Wait for the Space to restart (~2 minutes)

**Expected Result:**
- 30-second video: **30-60 seconds**
- 1-minute video: **1-2 minutes**
- 3-minute video: **3-5 minutes**

---

### Option 2: Code Optimizations (Free)
**Impact:** 2-3x faster processing  
**Cost:** Free  
**Difficulty:** Medium (Requires code changes)

#### A. Reduce Frame Sampling Rate

**File:** `backend/Dude.py`

**Find this section (around line 200-300):**
```python
# Current: Analyzing every frame
for frame in video_frames:
    analyze_frame(frame)
```

**Replace with:**
```python
# New: Analyze every 3rd frame (3x faster)
for i, frame in enumerate(video_frames):
    if i % 3 == 0:  # Only process every 3rd frame
        analyze_frame(frame)
```

---

#### B. Use Smaller Whisper Model

**File:** `backend/Dude.py`

**Find this line (around line 50-100):**
```python
self.whisper_model = whisper.load_model("large")
```

**Replace with:**
```python
self.whisper_model = whisper.load_model("base")  # Much faster, slightly less accurate
```

**Model Comparison:**
| Model | Speed | Accuracy | VRAM |
|-------|-------|----------|------|
| tiny  | 32x   | 70%      | 1GB  |
| base  | 16x   | 80%      | 1GB  |
| small | 6x    | 85%      | 2GB  |
| medium| 2x    | 90%      | 5GB  |
| large | 1x    | 95%      | 10GB |

---

#### C. Parallel Processing (Video + Audio)

**File:** `backend/Dude.py`

**Find the analysis section:**
```python
# Current: Sequential processing
video_result = analyze_video(file)
audio_result = analyze_audio(file)
```

**Replace with:**
```python
# New: Parallel processing
import concurrent.futures

with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
    video_future = executor.submit(analyze_video, file)
    audio_future = executor.submit(analyze_audio, file)
    
    video_result = video_future.result()
    audio_result = audio_future.result()
```

---

### Option 3: Make Transcription Optional
**Impact:** 3-5x faster for videos where transcription isn't needed  
**Cost:** Free  
**Difficulty:** Easy

**File:** `backend/main.py`

**Find the analyze endpoint (around line 800-900):**
```python
@app.post("/analyze")
async def analyze_video(
    file: UploadFile = File(...),
    enable_transcription: bool = True  # Add this parameter
):
    # ... existing code ...
    
    if enable_transcription:
        transcription_result = await transcribe_audio(file)
    else:
        transcription_result = None
```

**Frontend Update:** `frontend/src/pages/dealer-admin/NewAnalysis.js`

Add a checkbox:
```javascript
<FormControlLabel
  control={
    <Checkbox
      checked={enableTranscription}
      onChange={(e) => setEnableTranscription(e.target.checked)}
    />
  }
  label="Enable Audio Transcription (slower)"
/>
```

---

### Option 4: Upgrade to Dedicated Server
**Impact:** 10-20x faster processing  
**Cost:** $50-200/month  
**Difficulty:** Hard (Requires migration)

#### Recommended Providers:

**A. AWS EC2 with GPU**
- Instance: `g4dn.xlarge`
- Cost: ~$0.50/hour (~$360/month for 24/7)
- Specs: 4 vCPU, 16GB RAM, 1x NVIDIA T4 GPU

**B. Google Cloud Platform**
- Instance: `n1-standard-4` + 1x NVIDIA T4
- Cost: ~$0.45/hour (~$324/month)

**C. Paperspace Gradient**
- Instance: GPU+ (P4000)
- Cost: $0.51/hour (~$367/month)

---

## 🔧 Environment Variables for Optimization

Add these to your `.env` file or Hugging Face Secrets:

```bash
# Performance Tuning
MAX_WORKERS="4"                    # Increase for more parallel processing
CONCURRENCY_LIMIT="4"              # Allow more simultaneous analyses
PROCESS_TIMEOUT_SECONDS="600"     # 10 minutes (reduce if needed)

# AI Model Settings
WHISPER_MODEL="base"               # Options: tiny, base, small, medium, large
FRAME_SAMPLE_RATE="3"              # Analyze every Nth frame (higher = faster)
ENABLE_TRANSCRIPTION="true"        # Set to false to skip transcription
ENABLE_TRANSLATION="false"         # Disable if not needed

# GPU Settings (if using GPU hardware)
CUDA_VISIBLE_DEVICES="0"           # Use first GPU
PYTORCH_CUDA_ALLOC_CONF="max_split_size_mb:512"  # Optimize memory
```

---

## 📈 Performance Comparison Table

| Upgrade Option | Processing Time (1-min video) | Cost/Month | Difficulty |
|----------------|-------------------------------|------------|------------|
| **Current (CPU Basic)** | 5-10 minutes | Free | - |
| Code Optimizations | 2-4 minutes | Free | Medium |
| HF Space (T4 small) | 1-2 minutes | $12-30 | Easy ⭐ |
| HF Space (A10G) | 30-60 seconds | $50-150 | Easy |
| Dedicated AWS GPU | 30-60 seconds | $360 | Hard |

---

## ✅ Recommended Implementation Plan

### Phase 1: Quick Wins (Today)
1. ✅ Upgrade Hugging Face Space to **Nvidia T4 small** ($0.40/hour)
2. ✅ Update `.env` to use `WHISPER_MODEL="base"`
3. ✅ Set `FRAME_SAMPLE_RATE="3"`

### Phase 2: Code Optimizations (This Week)
1. Implement parallel processing for video + audio
2. Make transcription optional in the UI
3. Add progress indicators with estimated time

### Phase 3: Advanced (Next Month)
1. Implement result caching
2. Add video compression before upload
3. Consider dedicated GPU server if usage is high

---

## 🧪 Testing Your Upgrades

After each upgrade, test with the same video:

1. Upload the test video
2. Note the processing time
3. Compare quality of results
4. Verify all features still work

**Test Video Checklist:**
- ✅ Video quality score accurate
- ✅ Audio transcription correct (if enabled)
- ✅ Metadata extracted properly
- ✅ Overall score calculated

---

## 💡 Cost-Benefit Analysis

### For Light Usage (< 50 videos/month):
- **Recommendation:** Code optimizations only (Free)
- **Expected Speed:** 2-3x faster

### For Moderate Usage (50-200 videos/month):
- **Recommendation:** HF Space T4 small + Code optimizations
- **Cost:** ~$15-25/month
- **Expected Speed:** 5-8x faster

### For Heavy Usage (> 200 videos/month):
- **Recommendation:** Dedicated GPU server
- **Cost:** ~$360/month
- **Expected Speed:** 10-15x faster

---

## 🆘 Support

If you encounter issues during upgrades:
1. Check Hugging Face Space logs
2. Verify environment variables are set correctly
3. Test with a small video first
4. Roll back changes if needed

---

## 📝 Changelog

- **2026-02-17:** Initial upgrade guide created
- Add your upgrade dates and results here

---

**Next Steps:** Choose your upgrade path and follow the steps above. Start with Option 1 (HF Space upgrade) for the easiest and most impactful improvement!
