# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by *Keep a Changelog* and follows basic semantic versioning.

---

## [1.1.0] – Live CSS Editing
### Added
- Editable computed CSS properties
- Live style injection into inspected page

<!-- Screenshots for this version -->
![live editing enabled for the selected component](assets/v2-live-editing.png)
![live css shown for the selected component](assets/v2-live-css.png)

## Expected limitations for this version
- Styles reset on refresh
- Only limited CSS props
- Class selector may affect similar elements (acceptable for now)

## [1.0.0] – Initial Scaffold

### Added
- Manifest V3 DevTools extension setup
- DevTools panel creation
- Element inspection using `chrome.devtools` APIs
- Dark, developer-focused UI

### UI
Initial DevTools panel with basic inspection output.

<!-- Screenshots for this version -->
![Dev Companion v0.1 – Panel and Inspection](assets/v1-panel.png)

### Planned
- Live CSS editing
- Component extraction to React
- ZIP export
