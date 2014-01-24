
# o-fonts

This module contains:

* Font source files (`.glyphs`)
* Web font files (created from the source files) in .eot, .ttf and .woff formats
* @font-face definitions
* SASS variables

## For font maintainers

If you don't have it already, clone this repository:

`git clone http://git.svc.ft.com:9080/git/origami/o-fonts.git`

If you do have it already, then make sure you have the latest code:

`git pull`

### Updating an existing font

1. Open the existing font's `.glyph` file from `src/glyphs` in [Glyphs](http://www.glyphsapp.com/)
2. Make the necessary changes, and save.
3. Export a new `.ttf` version of the font from Glyphs, overwriting the existing `.ttf` file in `src/fonts`
4. Use a font conversion tool to create the `.eot` and `.woff` versions, again overwriting the existing `.eot` and `.woff` files in `src/fonts`
6. At the command line, in the o-fonts folder, run `grunt`.
7. For each page in `docs/` for the font(s) you have changed, open them in a range of browsers to check it renders as you expect.
8. Commit the changed files to Git and push them back to the origin

### Adding a new font/variant

5. Update `src/font-name-mappings.json` to reflect any name changes/new fonts added

1. With your new font open in [Glyphs](http://www.glyphsapp.com/), save it as `[font name].glyphs` in the `src/glyphs` folder. If FT already uses a standard name for the font, use this. Otherwise the name should be descriptive of both the font and it's weight/style, and not contain any spaces. For example: `BentonSans-Regular.glyphs`
2. Export a `.ttf` version of the font from Glyphs and save it in `src/fonts/`
3. Use a font conversion tool to create `.eot` and `.woff` versions in `src/fonts/`
4. Update `src/font-name-mappings.json` to reflect your additions (see `src/font-name-mapping-example.json` for guidelines)
5. If you are adding a font from a completely new font-family open `src/scss/_variables` in a text editor and add the font family name to the end of `$o-fonts-supported`. e.g if your font is `Courier-Light.ttf` add `Courier` to the end of the list.
4. At the command line, in the o-fonts folder, run `grunt`. This will generate a demo page in `docs/` for each new font you created in `src/fonts`. Open the demo page(s) in a range of browsers to check it renders as you expect.
6. Add and commit the new and changed files to Git, and push them back to the origin

### Checking font rendering

Different browsers use different font formats. This is why there needs to be `.eot`, `.ttf` and `.woff` versions of each font. In order to check all formats of the font render correctly, the demo pages need to be opened in the following browsers:

* Internet Explorer 7 or 8 - for the `.eot` font
* Safari on iPhone or iPad - for the `.ttf` font
* Chrome - for the `.woff` font

## For developers

Add this to your project's `bower.json` dependencies:

    dependencies": {
        "o-fonts": "http://git.svc.ft.com:9080/git/origami/o-fonts.git#{semver}"
    }

In your project's SASS files, import the o-fonts's `main.scss`:

    @import 'o-fonts/main.scss';

It is assumed you have your bower_components folder listed in your SASS loadPath. If not, you will need to include the full path to the o-fonts.

To load any given font you will need to call the `oFontsInclude()` mixin e.g.

	@include oFontsInclude(BentonSans, Bold);
	@include oFontsInclude(Clarion, Normal, Italic);

### Font loading path

You may need to create a build step to copy the font files from the o-fonts's `dist` folder to where they need to be for use in your project.

In your SASS, define a `$o-font-path` variable containing the path the CSS should use to find the font files, for example:

    $o-font-path: '/static/fonts/';

### Specifying fonts

The following variables are provided to specify standard font stacks:

* `$o-font-sansserif` - for Helvetica, Arial, sans-serif;
* `$o-font-serif` - for Georgia, 'Times New Roman', serif;

For all available font families and variants variables similar to the following are also automatically generated. 

	$o-fonts-bentonsans-lighter: BentonSans-lighter, $o-fonts-sans-serif;
	$o-fonts-bentonsans-normal: BentonSans-normal, $o-fonts-sans-serif;
	$o-fonts-bentonsans-bold: BentonSans-bold, $o-fonts-sans-serif;
	$o-fonts-clarion-italic: Clarion-italic, $o-fonts-serif;

*Note that you still need to use oFontsInclude() to actually include the font family*
