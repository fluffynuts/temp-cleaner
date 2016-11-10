#!/usr/bin/env node
var 
  fs = require('fs'),
  pathUtil = require('path'),
  rimraf = require('rimraf');

function Cleaner() {
};
Cleaner.prototype = {
  clean: function() {
    var tempFolders = this._getTempDirs();
    var self = this;
    tempFolders.forEach(function(folder) {
      self._removeRelicsFrom(folder);
    });
  },
  _removeRelicsFrom: function(folder) {
    var contents = fs.readdirSync(folder).map(function(sub) {
      return pathUtil.join(folder, sub);
    });
    var self = this;
    var now = new Date();
    var cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    var cutoffTime = cutoff.getTime();
    contents.forEach(function(item) {
      self._removeIfOlderThan(item, cutoffTime);
    });
  },
  _removeIfOlderThan: function(path, cutoffTime) {
    var mtime = this._getLastModifiedFor(path);
    if (!mtime) {
      return;
    }
    try {
      console.log('-> ' + path);
      rimraf.sync(path);
    } catch (e) {
      console.error([
          'Unable to remove "',
          path,
          '": ',
          e
      ].join(''));
    }
  },
  _getLastModifiedFor: function(path) {
    try {
      return fs.lstatSync(path).mtime;
    } catch (e) {
      console.error([
        'Unable to get last modified for "',
        path,
        '": ',
        e
      ].join(''));
    }
  },
  _getTempDirs: function() {
    var base = 'C:/Users';
    return fs.readdirSync('C:/Users')
              .reduce((acc, cur) => {
                var tempPath = pathUtil.join(
                  base,
                  cur,
                  'AppData',
                  'Local',
                  'Temp'
                );
                if (fs.existsSync(tempPath)) {
                  acc.push(tempPath);
                }
                return acc;
              }, []);
  }
};

if (require.main === module) {
  var cleaner = new Cleaner();
  cleaner.clean();
}

