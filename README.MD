# Menu Prototypes

This workspace contains lightweight HTML/CSS/JS prototypes for a digital restaurant menu. It is intended for rapid visual exploration and mock data.

## Project structure

- index.html: root search page listing every prototype (reads manifest.json)
- manifest.json: generated index of prototypes — do not edit by hand (except `archived`)
- _build-manifest.js: regenerates manifest.json — run `node _build-manifest.js` after adding or renaming a prototype
- data/menu.json: shared mock menu data (restaurant info, allergens, categories, dishes)
- data/images/dishes: dish images referenced by menu.json
- data/images/alergenos: allergen icons referenced by menu.json
- prototypes/[prototype]: all the prototypes included in the project, each having html, css and javascript file

## Root search page

- Serves as the only entry point to browse prototypes; each card opens the prototype in a new tab.
- Prototypes must NOT link back to the root — clients viewing a demo should never land on the search page. The new-tab opening also leaves the back button dead.
- The prototype name shown in the search comes from the `<title>` of its index.html (text before the first " - "). Keep titles accurate.
- Tagline/location come from the prototype's own menu.json only when it has one; prototypes using the shared data show a "datos demo" badge instead.
- To hide a prototype from the search without deleting it, set `"archived": true` for it in manifest.json (the build script preserves this flag).

## Adding a prototype

1. Create `prototypes/<slug>/` with at least an index.html (plus css/js).
2. Use the shared data (`fetch("../../data/menu.json")` and `../../data/images/...`) unless the restaurant needs its own menu — then add a local `menu.json` and `images/` and reference those.
3. Run `node _build-manifest.js` and commit the updated manifest.json.

## Data model notes

- menu.json is the source of truth for everything rendered in prototypes.
- Each dish can include:
  - description, ingredients, prepTime, calories
  - servingSize, spiceLevel, pairing, chefNote, dietary
  - allergens: array of allergen ids
  - image: relative path under images/dishes
- allergens are defined in menu.json with id, name, and icon.

Don't need to include all of this data, keep it simple and personalize for each restaurant

## Rendering behavior

- Both prototypes read data/menu.json with fetch and render a full card per dish.
- If a dish has allergens, its card shows the matching allergen icons.

## Design intent

- The copy is always in spanish
- Keep layouts simple, eye-catching, and not overwhelming.
- Include a section for highlighted dishes, like a hero slider
- Use badges in some dishes to show interesting/highlighted data of the dish
- Inlcude a button to reserve a place in the restaurant
- Include a top menu to navigate through the menu
- Provide feedback on interesting features for special restaurants (for example, if its a chess restaurant including a puzzle before loading the menu), be creative

## Guidance for future changes

- Always keep data/images and menu.json in sync.
- Any new dish image should be added to menu.json with matching metadata.
- Make changes mobile-first and verify small-screen layout first.
