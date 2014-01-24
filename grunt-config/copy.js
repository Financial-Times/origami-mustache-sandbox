module.exports = {
  polyfills: {
    src: "./bower_components/o-useragent/polyfills/boxsizing.htc",
    dest: "./build/polyfills/boxsizing.htc"
  },
  fonts: {
    flatten: true,
    expand: true,
    src: "./bower_components/o-fonts/webfonts/*",
    dest: "./build/fonts/"
  },
  headerModule: {
      flatten: true,
      src: "./bower_components/o-ft-header/img/ft-logo.gif",
      dest: "./build/img/ft-logo.gif"
  },
  footerModule: {
      flatten: true,
      src: "./bower_components/o-ft-footer/img/pearson_sprite.gif",
      dest: "./build/img/pearson_sprite.gif"
  }
};