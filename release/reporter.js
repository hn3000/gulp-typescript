///<reference path='../typings/tsd.d.ts'/>
var gutil = require('gulp-util');
function nullReporter() {
    return {};
}
exports.nullReporter = nullReporter;
function defaultReporter() {
    return {
        error: function (error) {
            console.error(error.message);
        }
    };
}
exports.defaultReporter = defaultReporter;
function flattenDiagnosticsVerbose(message, index) {
    if (index === void 0) { index = 0; }
    if (typeof message === 'undefined') {
        return '';
    }
    else if (typeof message === 'string') {
        return message;
    }
    else {
        var result;
        if (index === 0) {
            result = message.messageText;
        }
        else {
            result = '\n> TS' + message.code + ' ' + message.messageText;
        }
        return result + flattenDiagnosticsVerbose(message.next, index + 1);
    }
}
function longReporter() {
    return {
        error: function (error) {
            if (error.tsFile) {
                console.error('[' + gutil.colors.gray('gulp-typescript') + '] ' + gutil.colors.red(error.fullFilename + '(' + error.startPosition.line + ',' + error.startPosition.character + '): ') + 'error TS' + error.diagnostic.code + ' ' + flattenDiagnosticsVerbose(error.diagnostic.messageText));
            }
            else {
                console.error(error.message);
            }
        }
    };
}
exports.longReporter = longReporter;
function fullReporter(fullFilename) {
    if (fullFilename === void 0) { fullFilename = false; }
    return {
        error: function (error, typescript) {
            console.error('[' + gutil.colors.gray('gulp-typescript') + '] '
                + gutil.colors.bgRed(error.diagnostic.code + '')
                + ' ' + gutil.colors.red(flattenDiagnosticsVerbose(error.diagnostic.messageText)));
            if (error.tsFile) {
                console.error('> ' + gutil.colors.gray('file: ') + (fullFilename ? error.fullFilename : error.relativeFilename) + gutil.colors.gray(':'));
                var lines = error.tsFile.text.split(/(\r\n|\r|\n)/);
                var logLine = function (lineIndex, errorStart, errorEnd) {
                    var line = lines[lineIndex];
                    if (errorEnd === undefined)
                        errorEnd = line.length;
                    console.error('> ' + gutil.colors.gray('[' + lineIndex + '] ')
                        + line.substring(0, errorStart)
                        + gutil.colors.red(line.substring(errorStart, errorEnd))
                        + line.substring(errorEnd));
                };
                for (var i = error.startPosition.line; i <= error.endPosition.line; i++) {
                    logLine(i, i === error.startPosition.line ? error.startPosition.character - 1 : 0, i === error.endPosition.line ? error.endPosition.character - 1 : undefined);
                }
            }
        }
    };
}
exports.fullReporter = fullReporter;
