import * as _ from 'lodash';

function shellExec(
  command: string, 
  args: string[], 
  cb: (error: string, value: string[]) => any
) {
  const spawn = require('child_process').spawn;
  const prc = spawn(command, args);

  prc.stdout.setEncoding('utf8');
  prc.stdout.on('data', function (data: string) {
    const str = data.toString();
    const lines: string[] = str.split(/(\r?\n)/g)
        
    cb(null, lines.filter(
      (line) => line != "\r\n"
    ));
  });

  prc.stderr.on('data', function (data: string) {
    console.log(data + '');
  });

  prc.on('close', function (code: string) {
    console.log('process exit code ' + code);
    cb(code, null);
  });
}


function getHypernyms(terms: string[], cb: (error: string, terms: string[]) => any): void {
  shellExec(
    'python',
    [
      'src/topics.py'
    ].concat(
      terms.map(
        (term) => '"' + term.replace('"', '\\"') + '"'
      )
    ),
    (err, lines: string[]) => 
      cb(err, _.tail(_.tail(lines)))
  )
}

export {
  getHypernyms
}