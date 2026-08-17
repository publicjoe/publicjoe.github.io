# Add Painted Model Carousels

This plan outlines adding image carousels for painted models, grouped by month and by faction.

## Proposed Changes

### `style.css`
- Add CSS classes for a responsive, horizontal scrolling carousel (`.carousel-container`, etc.) using CSS flexbox and scroll snapping for a smooth user experience.

### `paint/paint.js`
- **Modify `renderPaintDiary`**: Extract all `images` from the models finished each month. If a month has images, render an image carousel below the list of finished models.
- **Modify `calculatePaintedModelsSummary` / `renderPaintedModelsSummary`**: 
  - Group images by faction while aggregating models.
  - In the "Summary" accordion, add a carousel for each faction that has images.

### JSON Data Structure
We will add an `images` property to the model objects inside `finishedModels` in your `[year].json` files. For example, in `2026.json`:
```json
{
  "system": "WH40K",
  "faction": "Space Wolves",
  "name": "Hellblaster Squad x 5",
  "type": "Small",
  "amount": 5,
  "images": ["/images/paint/2026/hellblasters.jpg"]
}
```

> [!IMPORTANT]
> **User Review Required**
> Does this JSON structure work for you? You will be able to add `images: ["path/to/image.jpg"]` to any finished model, and the code will automatically pick it up and display it in both the monthly and faction-based carousels.
