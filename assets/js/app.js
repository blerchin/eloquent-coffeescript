
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

  var clear = document.createElement('button');
  clear.className = 'clear-console';
  clear.textContent = 'Clear Console';
  el.parentNode.appendChild(clear);

  var consoleBox = document.createElement('code');
  consoleBox.className = "console";
  el.parentNode.appendChild(consoleBox);

  hideHint(el, consoleBox);

  var cm = CodeMirror(function(cm) {
    el.parentNode.replaceChild(cm, el);
  }, {
    mode: 'coffeescript',
    lineNumbers: false,
    smartIndent: true,
    tabSize: 2,
    indentWithTabs: true,
    value: el.textContent
  });

  run.addEventListener('click', runExample.bind(null, cm, consoleBox));
  clear.addEventListener('click', clearConsole.bind(null, consoleBox));
});

function hideHint(el, consoleBox) {
  var code = el.textContent;
  var blockComment = /#{3}hint([\s\S]*?)#{3}/;
  var hint = code.match(blockComment);
  if (hint) {
    el.textContent = code.replace(blockComment, '');
    el.dataset.hint = hint[1];

    var hintButton = document.createElement('button');
    hintButton.className = 'show-hint';
    hintButton.textContent = 'Show Hint';
    el.parentNode.appendChild(hintButton);
    hintButton.addEventListener('click', showHint.bind(null, hint[1], consoleBox));
  }
}

function showHint(hint, consoleBox) {
  consoleBox.textContent = '\n' + hint;
}

function runExample(cm, consoleBox) {
  clearConsole(consoleBox);
  buf = "";
  var code = cm.getValue();
  try {
    CoffeeScript.eval(code);
  } catch (e) {
    console.trace(e);
    buf = e.name + ': ' + e.message;
  }
  if (buf.length) {
    consoleBox.textContent += buf;
  }
}

function clearConsole(consoleBox) {
  consoleBox.textContent = '';
}
