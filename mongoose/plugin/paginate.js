'use strict';

// 对分页插件的简单封装

// https://github.com/edwardhotchkiss/mongoose-paginate
const mongoosePaginate = require('mongoose-paginate');

const _paginate = mongoosePaginate.paginate;

function paginate(query, options) {
  const page = options.page || 1;
  let limit = options.limit || 10;
  // limit 上限为 100
  if (limit > 100) limit = 100;

  // 直接返回0条数据
  if (query === null) return Promise.resolve({ metadata: { total: 0, totalPage: 0, page, limit }, data: [] });

  return _paginate.call(this, query, options).then(({ docs, total }) => {
    return {
      metadata: { total, totalPage: Math.ceil(total / limit), page, limit },
      data: docs,
    };
  });
}

module.exports = function (schema) {
  schema.statics.paginate = paginate;
};
