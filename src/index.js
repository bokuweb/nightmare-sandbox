const Nightmare = require('nightmare');
const vo = require('vo');

const browserWidth = 1200;
const browserHeight = 800;

function *run() {
  const nightmare = new Nightmare({
    show: false,
    width: 1200,
    height: 800,
  });

  const height = yield nightmare.goto('http://blackrockdigital.github.io/startbootstrap-grayscale/')
          .wait('body')
          .evaluate(function() {
            const body = document.querySelector('body');
            return body.scrollHeight;
          });

  console.dir(height);
  for (var i = 0; i < height / browserHeight; i ++) {
    yield nightmare.viewport(browserWidth, browserHeight)
      .scrollTo(browserHeight * i, 0)
      .wait(100)
      .screenshot(require('path').join('./', `grayscale${i}.png`));
  }
  yield nightmare.end();
}

vo(run)(function() {
  console.log('done');
});
