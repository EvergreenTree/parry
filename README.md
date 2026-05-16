# Voice-to-Visual (SwiftUI)

iOS app that records speech, transcribes with **OpenAI Whisper**, sends transcript to **Pioneer**, then generates an image with **fal**.

## Why this matches the hackathon

- Uses **OpenAI** STT via:
  - `POST https://api.openai.com/v1/audio/transcriptions`
- Uses **Pioneer** chat completions via:
  - `POST https://api.pioneer.ai/v1/chat/completions`
- Uses **fal** image generation via:
  - `POST https://fal.run/fal-ai/flux/schnell`

## Project layout

- `VoiceToVisual/` app sources
  - `ContentView.swift`, `VoiceToVisualApp.swift`
  - `Models/` data contracts
  - `Services/` API clients
  - `Stores/` app state
  - `Views/` UI views
- `Config/Config.example.xcconfig` sample config key
- `bootstrap.sh` generates `Config/Config.xcconfig` from `pioneer_token.txt`

## Setup

1. Create a new iOS app in Xcode and choose SwiftUI.
2. Replace/merge the generated source files with the files in `VoiceToVisual/`.
3. Add **Capabilities**:
   - Microphone permission in `Info.plist`:
     - `Privacy - Microphone Usage Description`
4. Add build setting:
   - `PIONEER_API_KEY` from `Config/Config.xcconfig`.
5. Add `Config/Config.xcconfig` in project as an **Configuration settings file**:
   - Debug and Release can both include this file.
6. Run `./bootstrap.sh` once to generate local key config from `pioneer_token.txt`:
   - `./bootstrap.sh`

### Runtime keys

- OpenAI key: configured in the app Settings screen (stored in Keychain)
- fal key: configured in the app Settings screen (stored in Keychain)
- Pioneer key: loaded from `Config/Config.xcconfig` as `PIONEER_API_KEY`

## Flow

1. Record 5-10 seconds of voice.
2. Send the recorded clip to OpenAI Whisper and display transcript.
3. Send transcript to Pioneer for:
   - visual scene reasoning
   - prompt derivation
4. Send derived prompt to fal and render output image.

## Notes

- The app defaults to `fal-ai/flux/schnell` for speed.
- To switch model: update `FalService` model value to `fal-ai/flux/dev`.
