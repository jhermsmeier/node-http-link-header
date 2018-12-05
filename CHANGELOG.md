# Changelog

## v1.0.2

- Make `.get()` have a consistent return type ([@dhui])
- Improve `.has()` best-case performance ([@dhui])
- Fix `.has()` test and add a test for the negative case ([@dhui])

## v1.0.1

- Fix `link.has()` always returning `true`

## v1.0.0

**Breaking Changes:**

- Removed parsing of query parameters from link IRI / URI
- Added handling for attributes with multiple occurrences

**Changes:**

- Rewrote parser, removing exponential-time regular expressions
- Fixed erronous URI-encoding of `rel`, `anchor` and `type` attributes
- Fixed handling of backslash-escaped characters
- Fixed missing cardinality handling for `type`, `media` and `title` attributes
- Fixed handling of leading / trailing whitespace around delimiters
- Replace `querystring.*()` with `xxcodeURIComponent()` ([@ykzts])

[@ykzts]: https://github.com/ykzts
[@dhui]: https://github.com/dhui
