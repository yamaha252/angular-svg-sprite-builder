# SVG sprite builder for Angular

Powered by [svg-sprite](https://github.com/svg-sprite) package


```json
{
  ...
  "projects": {
    "myproject": {
      ...
      "architect": {
        "sprite": {
          "builder": "@cbdev/angular-svg-sprite-builder:generate",
          "options": {
            "source": "assets/icons/*.svg",
            "destination": "assets/images/icons.svg",
            "shape": { ... },
            "svg": { ... }
          }
        }
      }
    }
  },
}

```
