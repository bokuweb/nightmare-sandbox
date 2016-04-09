const Nightmare = require('nightmare');
const vo = require('vo');
const util = require('util');

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

  const nodes =  yield nightmare.goto('http://blackrockdigital.github.io/startbootstrap-grayscale/')
          .wait('body')
          .evaluate(function() {
            // jQuery obj?
            //return document.body.style.display
            var l = [];
            const body = document.querySelector('body');
            // var nodes =  body.childNodes;
            for(var i = 0; i < body.childNodes.length; i ++) {
              if (body.childNodes[i].style) l.push(body.childNodes[i].style.display)
            }
            return l;
          })

  console.log(util.inspect(nodes));

  console.log(height);
  for (var i = 0; i < height / browserHeight; i ++) {
    yield nightmare.viewport(browserWidth, browserHeight)
      .wait('body')
      // のこりheightがブラウザ高さ未満の場合veiwポートを変更？して高さをあわせる？
      .scrollTo(browserHeight * i, 0)
      .wait(100)
      .screenshot(require('path').join('./', `grayscale${i}.png`));
  }
  yield nightmare.end();
}

vo(run)(function() {
  console.log('done');
});

function searchNodes(root) {
  var list = [];
  var search = function (node)
  {
    while (node != null)
    {
      // 自分を処理
      list.push(node);
      // 子供を再帰
      search(node.first());
      // 次のノードを探査
      node = node.next();
    }
  }
  search(root.first());
  return list;
}

 
