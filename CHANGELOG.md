# Changelog

## [5.0.3](https://github.com/imagekit-developer/imagekit-react/compare/5.0.2...5.0.3) (2026-09-17)


### Bug Fixes

* **deps:** require @imagekit/javascript ^5.5.0 and set up Release Please ([e89b349](https://github.com/imagekit-developer/imagekit-react/commit/e89b34931f68ad2abcc995326dc23231c89f9f99))
* **deps:** require @imagekit/javascript ^5.5.0 for density transformation support ([f38533c](https://github.com/imagekit-developer/imagekit-react/commit/f38533cde5fd992dc333082f1f1c04794d53f978))

## 5.0.2

Include `@imagekit/javascript` in external in Rollup config to prevent bundling it with the package, allowing users to be able to fetch the latest version of the SDK without needing to update the package. This also reduces the bundle size of the package and allows users to manage the SDK version separately.

## 5.0.1

Fix `src` when `responsive:false` is set.

## 5.0.0

This is a major release that includes breaking changes. Please refer to the [official documentation](https://imagekit.io/docs/integration/react) for up-to-date usage instructions.

## 4.3.0

- Added support for React version 19 by [@ankur-dwivedi](https://github.com/ankur-dwivedi) in [#171](https://github.com/imagekit-developer/imagekit-react/pull/171)

**Full Changelog**: [v4.2.0...v4.3.0](https://github.com/imagekit-developer/imagekit-react/compare/4.2.0...4.3.0)

## 4.2.0

- Added `checks` parameter by [@imagekitio](https://github.com/imagekitio) in [#161](https://github.com/imagekit-developer/imagekit-react/pull/161)

**Full Changelog**: [v4.1.0...v4.2.0](https://github.com/imagekit-developer/imagekit-react/compare/4.1.0...4.2.0)

## 4.1.0

- Release details not specified.

**Full Changelog**: [v4.0.0...v4.1.0](https://github.com/imagekit-developer/imagekit-react/compare/4.0.0...4.1.0)

For the complete list of releases and changes, visit the [GitHub Releases Page](https://github.com/imagekit-developer/imagekit-react/releases).
