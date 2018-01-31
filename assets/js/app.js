
var buf = "";

function print() {
  var args = [].slice.apply(arguments);
  buf += args.join(' ') + '\n';
}

var examples = document.querySelectorAll('code.language-coffee');
examples.forEach(function(el) {
  el.contentEditable = true;
  var run = document.createElement('button');
  run.className = 'run-example';
  run.textContent = 'Run Example'
  el.parentNode.appendChild(run);
  run.addEventListener('click', runExample.bind(null, el));

  var clear = document.createElement('button');
  clear.className = 'clear-console';
  clear.textContent = 'Clear Console';
  el.parentNode.appendChild(clear);
  clear.addEventListener('click', clearConsole.bind(null, el));

  hideHint(el);

  el.addEventListener('blur', function(){
    hljs.highlightBlock(el);
  });
});

function hideHint(el) {
  var code = el.textContent;
  var blockComment = /#{3}hint([\s\S]*?)#{3}/;
  var hint = code.match(blockComment);
  if (hint) {
    el.textContent = code.replace(blockComment, '');
    el.dataset.hint = hint[1];

    var hint = document.createElement('button');
    hint.className = 'show-hint';
    hint.textContent = 'Show Hint';
    el.parentNode.appendChild(hint);
    hint.addEventListener('click', showHint.bind(null, el));
  }
}

function showHint(el) {
  var hintWrap = document.createElement('div');
  hintWrap.className = 'result hint';
  hintWrap.textContent = el.dataset.hint;
  el.parentNode.appendChild(hintWrap);

}

function runExample(el) {
  buf = "";
  var code = el.textContent;
  try {
    CoffeeScript.eval(code);
  } catch (e) {
    console.trace(e);
    buf = e.name + ': ' + e.message;
  }
  if (buf.length) {
    console.log(buf);
    var result = document.createElement('pre');
    result.className = "result highlight";
    var resultCode = document.createElement('code');
    result.appendChild(resultCode);
    el.parentNode.appendChild(result);
    resultCode.textContent = buf;
  }
}

function clearConsole(el) {
  var results = el.parentNode.querySelectorAll('.result');
  results.forEach(function(i) {
    el.parentNode.removeChild(i);
  });

}
