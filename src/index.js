const Nightmare = require('nightmare');
const vo = require('vo');
const util = require('util');

const browserWidth = 1200;
const browserHeight = 800;

function *run() {
  const nightmare = new Nightmare({
    width: 1200,
    height: 800,
  });

  const height = yield nightmare.goto('http://blackrockdigital.github.io/startbootstrap-grayscale/')
          .wait('body')
          .evaluate(function() {
            const body = document.querySelector('body');
            return body.scrollHeight;
          });

  yield nightmare.goto('http://blackrockdigital.github.io/startbootstrap-grayscale/')
          .wait('body')
          .screenshot(require('path').join('./', `g0.png`));

  console.log(height);

  for (var i = 1; i < height / browserHeight; i ++) {
    yield nightmare.viewport(browserWidth, browserHeight)
      .wait('body')
      // のこりheightがブラウザ高さ未満の場合veiwポートを変更？して高さをあわせる？
      .scrollTo(browserHeight * i, 0)
      .wait(100)
      .evaluate(i => {
        const searchNodes = root => {
          // const list = [];
          const search = node => {
            while (node != null) {
              var position;
              if (node.style) {
                position = window.getComputedStyle(node, null).getPropertyValue("position");
              }
              if (position === 'fixed') {
                try { node.style.display = 'none' } catch(e) {};
              }
              search(node.firstChild);
              node = node.nextSibling;
            }
          }
          search(root.firstChild);
        }
        return searchNodes(document.querySelector('body'));
      })
      .screenshot(require('path').join('./', `g${i}.png`));
  }
  yield nightmare.end();
}

vo(run)(function() {
  console.log('done');
});

