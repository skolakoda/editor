/* CONFIG */

const language = document.getElementById('language')
const output = document.getElementById('output')
const run = document.getElementById('run')

const target = 'https://www.hackerrank.com/api/shiv/submission'
const proxy = 'https://proxy-requests.herokuapp.com/'
const submitUrl = proxy + target
const api_key = 'hackerrank|192673-2110|7220543fdb59d6d1bf59d84a1d33913e63ef41be'
const testcases = '["1"]' // mora bar jedan

const editorCodes = {
  c: "text/x-csrc",
  cpp: "text/x-c++src",
  java: "text/x-java",
  js: "text/javascript",
  python: "text/x-python",
  haskell: "text/x-haskell",
}

const hello = {
  c: `#include <stdio.h>

int main()
{
    printf("Zdravo C");
    return 0;
}
`,
  cpp: `#include <iostream>
using namespace std;

int main(){
    cout << "Zdravo C++" << endl;
    return 0;
}
`,
  java: `class ZdravoSvete {
    public static void main (String args[]) {
      System.out.println("Zdravo Java");
    }
}
`,
  js: `console.log('Zdravo Javascript')\n`,
  python: `print('Zdravo Python')\n`,
  haskell: `main = print "Zdravo Haskell"\n`,
}

const editor = CodeMirror.fromTextArea(document.getElementById('input'), {
  lineNumbers: true,
  mode: editorCodes[language.value],
  autoCloseBrackets: true,
  lineWrapping: true,
  matchBrackets: true,
  theme: 'monokai',
})


/* FUNCTIONS */

function izvrsiJS(input, output) {
  output.innerHTML = ''
  // https://stackoverflow.com/questions/30935336
  const originalLog = console.log
  console.log = (...args) =>
    args.map((arg, i) => output.innerHTML += arg + (args[i + 1] ? ' ' : '<br>'))
  try {
    eval(input)
  } catch (e) {
    console.log(e.message)
  }
  console.log = originalLog
}

function izvrsiNaServeru(input, lang, output) {
  const source = encodeURIComponent(input)
  const params = `source=${source}&lang=${lang}&testcases=${testcases}&api_key=${api_key}`
  output.innerHTML = 'Izvršava se...'

  const http = new XMLHttpRequest()
  http.open('POST', submitUrl)
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  http.onload = () => {
    const rezultat = JSON.parse(JSON.parse(http.responseText).response).result
    output.innerHTML = rezultat.stdout ? rezultat.stdout[0] : rezultat.compilemessage.replace(/â/g, '')
  }
  http.onerror = () => output.innerHTML = 'Greška, nema odgovora sa servera.'
  http.send(params)
}

function izvrsi(input, lang, output) {
  if (lang == 'js') izvrsiJS(input, output)
  else izvrsiNaServeru(input, langCodes[lang], output)
}

/* EVENTS */

language.addEventListener('change', e => {
  editor.setValue(hello[language.value])
  editor.setOption("mode", editorCodes[language.value])
})

run.onclick = () => izvrsi(editor.getValue(), language.value, output)

/* INIT */

editor.setValue(hello[language.value])
editor.setOption("mode", editorCodes[language.value])
