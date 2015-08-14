(function () {
    'use strict';

    var moment = require('moment'),
        path = require('path'),
        _ = require('lodash'),
        ejs = require('ejs'),
        chai = require('chai'),
        assert = chai.assert,
        DOMParser = require('xmldom').DOMParser,
        Promise = require('bluebird'),
        fs = Promise.promisifyAll(require('fs')),
        viewsDirPath = 'views',
        views = [{
            'type': 'categories',
            'path': path.join(viewsDirPath, 'category-sitemap.ejs')
        }];

    describe('SEO-friendly sitemap generator: ', function () {
        it('should generate a valid category-sitemap.xml file.', function () {
            return getCompiledContent('categories')
                .then(xmlValidator);
        });
    });

    var getCompiledContent = function (type) {
        var filePath = _(views).find('type', type).path;

        var boundData = {
            config: {
                'url': 'http://yoursite.com'
            },
            items: [
                {
                    'permalink': 'http://yoursite.com/categories/Cat1/',
                    'updated': moment().toDate()
                }
            ]
        };

        var readFileOptions = {
            encoding: 'utf8'
        };
        return fs.readFileAsync(filePath, readFileOptions)
            .then(function (content) {
                var compiledTemplate = ejs.compile(content, {
                        filename: filePath
                    }),
                    xml = compiledTemplate(boundData);
                return xml;
            });
    };


    var xmlValidator = function (xml) {
        return new Promise(function (resolve, reject) {
            new DOMParser({
                locator: {},
                errorHandler: function (level, msg) {
                    reject(msg);
                }
            }).parseFromString(xml, 'text/xml');
            resolve();
        });
    };
})();