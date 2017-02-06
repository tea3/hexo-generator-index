'use strict';

var pagination = require('hexo-pagination');

module.exports = function(locals) {
  var config = this.config;
  var posts = locals.posts.sort(config.index_generator.order_by);
  
  
  // [hexo-generator-indexのgenerator.jsの変更箇所]
  // v0.2.0に対応
  // 指定タグが含まれる記事は、index.htmlに含めない
  // 含めたくないタグの指定は_config.ymlで指定する。
  //-------------------変更ここから---------------------
  var filterTagArr = [];
  if( typeof config.index_generator !== "undefined" && typeof config.index_generator.noIndexTag !== "undefined" && config.index_generator.noIndexTag.length > 0){
    filterTagArr = config.index_generator.noIndexTag;
  }
  
  var tempPosts  = posts;
  var postData   = [];
  var dataLength = 0;
  for(var i=0; i<posts.data.length; i++){
    if( isPermisPush(posts.data[i].tags.data , filterTagArr) ){
      postData.push( posts.data[i] );
      dataLength++;
    }
  }
  //postsを上書きする。
  posts.data   = postData;
  posts.length = dataLength;
  
  function isPermisPush(tagData, filterArr){
    for(var i=0; i<tagData.length; i++){
      for(var j=0; j<filterArr.length; j++){
        if(tagData[i].name == filterArr[j])return false;
      }
    }
    return true;
  }
  //-------------------変更ここまで---------------------
  
  
  var paginationDir = config.pagination_dir || 'page';

  return pagination('', posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};
