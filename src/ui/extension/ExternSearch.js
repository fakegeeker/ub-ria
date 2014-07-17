/**
 * ADM 2.0
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file 使用外部搜索控件代理控件的搜索的扩展
 * @author lixiang
 * @date $DATE$
 */
define(
    function (require) {
        var lib = require('esui/lib');
        var Extension = require('esui/Extension');

        /**
         * 使用外部搜索控件代理控件的搜索
         *
         * @param {Object} [options] 配置项
         * @extends esui.Extension
         * @constructor
         */
        function ExternSearch(options) {
            options = options || {};
            Extension.apply(this, arguments);
        }

        /**
         * 扩展的类型，始终为`"ExternSearch"`
         *
         * @type {string}
         * @override
         */
        ExternSearch.prototype.type = 'ExternSearch';

        /**
         * 指定对应的searchbox的id，必须指定
         *
         * @type {string | null}
         */
        ExternSearch.prototype.searchbox = null;

        /**
         * 找到控件对应的`SearchBox`控件
         *
         * @return {esui.SearchBox}
         */
        ExternSearch.prototype.resolveSearchBox = function () {
            if (this.searchbox) {
                return this.target.viewContext.get(this.searchbox);
            }
            return null;
        };

        /**
         * 激活扩展
         *
         * @override
         */
        ExternSearch.prototype.activate = function () {
            var searchbox = this.resolveSearchBox();

            // 代理搜索
            searchbox.on('search', search, this);

            // 接收控件内清空搜索操作
            this.target.on('clearquery', clearQuery, this);

            Extension.prototype.activate.apply(this, arguments);
        };

        function search(e) {
            var keywords = e.target.getValue();
            this.target.search(keywords);
        }

        function clearQuery() {
            var searchbox = this.resolveSearchBox();
            searchbox.set('text', '');
        }

        /**
         * 取消激活
         *
         * @override
         */
        ExternSearch.prototype.inactivate = function () {
            var searchbox = this.resolveSearchBox();
            searchbox.un('search', search, this);
            this.target.un('clearquery', clearQuery, this);
            Extension.prototype.inactivate.apply(this, arguments);
        };

        lib.inherits(ExternSearch, Extension);
        require('esui').registerExtension(ExternSearch);
        return ExternSearch;
    }
);
