/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["2017-03-17/你好，世界/index.html","85f62d88a77e8c5d99b6c458fa905946"],["2017-10-20/ul li表格拖拽、吸附功能/index.html","7dd270b06b92e8f04739fd432c7fb090"],["2018-01-24/一维数组构建二位数组/index.html","46f9f6eb5d65fa8bc3f61f38f880bff1"],["2018-03-26/css盒模型/index.html","cd8e4281d5cc521b65aaeecd4ad2958d"],["2018-03-26/页面布局/index.html","797ab1b42c1f8d0d66a4db36abc788ac"],["2018-03-28/DOM事件/index.html","49e8f93ebb8018733eb599e5b35b42c1"],["2018-03-28/http协议/index.html","5439d6c34c7ee53bc19cfad733ce3011"],["2018-03-28/针对集合的小方法/index.html","b0c5c6d4250827433e6c347da3a90a60"],["2018-03-30/vscode插件整理/index.html","9c6ded1b74e53804f8ed87870ce17081"],["2018-04-03/浅谈js原型/index.html","b928fe9b40b4f81eba56520a17ec647e"],["2018-04-08/用jq实现简单的数字动画/index.html","3b8201b748beeebd6481780d8072e22e"],["2018-04-09/用js实现简单的抛物线运动/index.html","f9fa1f06afcae05524d248bcfff63de1"],["2018-04-16/浅谈js运行机制/index.html","a4cc923e68abbf880f81753f93fdc6be"],["2018-04-26/解析url字符串/index.html","f4238e7476813e5ae28b71e0ecf5e2b3"],["2018-05-09/vscode的个人配置/index.html","eb95ba5b9f3626cd189598f4c8d4ffe7"],["2018-05-09/针对于移动端的兼容适配/index.html","d9c8ea554cd55378fd82a5a0313fbe53"],["2018-06-14/用jq实现的单个span为单个的数字动画/index.html","309e4c1bcbd3c872dc6739185ac85c4e"],["2018-06-15/webpack从什么都不懂到入门/index.html","c39e837ebd56ddf0a42631479492233d"],["2018-08-22/webpack从单页面到多页面/index.html","53e7aa771f8d03727d9552814a902939"],["2018-10-24/awardRotate转盘插件文字模糊问题和图片加载问题/index.html","bb66212a2f3c89c17e9578fefe09b697"],["2018-11-01/GitBash主题风格/index.html","169421e4b673eedce83486387f3e9ec4"],["2018-12-25/数组的方法的总结和使用/index.html","b7b9a3b099a8f67699b09532f28dd021"],["2019-01-09/字符串的方法的总结和使用/index.html","40e4e27ec82d26e987fb5d900f4f0c99"],["2019-11-16/使用ss代理简单爬取小说/index.html","5221a5b07510ddc54624abd6028e8ea5"],["2019-12-30/docker-compose的mysql和mongo问题解决/index.html","3d2b56dd1a22ad53dc31fc5c1455630e"],["2020-01-13/从零教你打造免费稳定高效的图床/index.html","2dc2dfac6d1c450d73c2d9f07b49c728"],["2020-01-17/从零搭建Window前端开发环境/index.html","df145249d171104acd5edbd3f3d283dc"],["2020-02-25/Windows10开启Ubuntu子系统并搭建Docker环境 - 副本/index.html","e70263aa5c535f1f950f151c837f9ff8"],["2020-03-11/node实现图片分割/index.html","e7cd4f020dc493f569e0c6809af397c0"],["2020-03-14/用vue实现一个简单的时间屏幕/index.html","ac5fe490bd74da4c705d7f7058dd4402"],["2020-06-04/Charles的基本使用/index.html","76778c0effe39b2aa6c1f62296720600"],["2020-06-08/手把手教你写一个符合自己需求的小程序日历组件/index.html","6ffcaa3a11f6d234ca8004ac76311ee0"],["2020-06-10/node图片四周填充透明区域/index.html","8ce638433b2f91bb032ed184ba5d8a69"],["2020-06-12/node实现图片尺寸批量修改/index.html","a9cda23febbf671778f291f412a4dede"],["2020-06-17/node实现文件属性批量修改/index.html","34a3ba39f1306b97866e4c25cba01cc4"],["2020-07-05/node实现文件属性批量修改(文件名)/index.html","517a6434fd66d26e7d34e448d2434b1a"],["2020-09-08/JS中有趣的内置对象-JSON/index.html","6221a7508c8e93cd5ae31ca2bb824b41"],["2020-11-03/Vue+Antd搭配百度地图实现搜索定位等功能/index.html","48f61cfe0da7c06a38cea212c42eca00"],["404.html","a6873de696d59d30d6b80eb04397dfc8"],["about/index.html","5b1a4ad9c3dea61956fae15dc5575637"],["archives/2017/03/index.html","c380d8e4bc1f61e8e8fd30bd7e8b48a6"],["archives/2017/10/index.html","3aaabbafef41660bd9c059588f1f94bb"],["archives/2017/index.html","ca1f228c0b70ef0c5db589a5ecedf903"],["archives/2018/01/index.html","39afe221d2fe3a7c479fcf7a599d57b9"],["archives/2018/03/index.html","145e17035e587dffa127b68e72c2a672"],["archives/2018/04/index.html","351fa1f4f837c028838df50348536576"],["archives/2018/05/index.html","5f4ba62aec7078935576ed506871db14"],["archives/2018/06/index.html","a6702c00cd20584a4ef57d047fc41013"],["archives/2018/08/index.html","be66ea447add6a873d16cdca11f8167c"],["archives/2018/10/index.html","b30fc039a667e6c0e6388ee1b14e8163"],["archives/2018/11/index.html","9fd1f306e7d4b7b0b49aa3b000cf6b94"],["archives/2018/12/index.html","b52f9484e5fde4a7f5439b69d64357d4"],["archives/2018/index.html","1dd6f47ebb6edc16326ae42ee3d65535"],["archives/2018/page/2/index.html","91d5b0121bb19bae44342f4699bb608d"],["archives/2019/01/index.html","b68d7a208c591353f321a4e8f582610c"],["archives/2019/11/index.html","791d188440be23ca38e6546b379f52f5"],["archives/2019/12/index.html","b32a07e6e8910503adb61a420dcdbbfd"],["archives/2019/index.html","b5696f6f1b596dd3893d6e7867bfc671"],["archives/2020/01/index.html","4eeff042565bb09b3938068f50e6d71a"],["archives/2020/02/index.html","c5a560c1f4d64fa0ecaae6c7b9cb8205"],["archives/2020/03/index.html","56b8d14173c61a3dcc48773c0b41a4b4"],["archives/2020/06/index.html","001097bae64005179cab9a4c9d9361da"],["archives/2020/07/index.html","18784c7a1adf66fa7905368c6c71703c"],["archives/2020/09/index.html","28d7e420eac3f965787631e559fb936e"],["archives/2020/11/index.html","8371d02601b0ba19767bac12a1565808"],["archives/2020/index.html","7554f4361b7f1a929f342da486535295"],["archives/2020/page/2/index.html","98b76d84ab40d38f0bc4d0bd58009bd0"],["archives/index.html","b1f4c1851c58f7900d0a3e8b938bae8d"],["archives/page/2/index.html","eef6b5903f0cf6e935ab4218d6f4c411"],["archives/page/3/index.html","1e875638d520419ca5536d6b86b1ca83"],["archives/page/4/index.html","0e1e3bfb9ac5d260b46c30144064325c"],["assets/algolia/algoliasearch.js","d5d2500bfe8443b42baaefe4996ee532"],["assets/algolia/algoliasearch.min.js","9c5e51e57e2b1d888950bf4cb5708c49"],["assets/algolia/algoliasearchLite.js","ce9b0e62645c036a143f639b92e7789f"],["assets/algolia/algoliasearchLite.min.js","c2d71f042c879659dbc97f8853b62f21"],["categories/index.html","8d7be0034ee022e8d9b070221362da2c"],["categories/小工具/index.html","80f341bc735ddfbf5b8b50ff0fd107f9"],["categories/小特效/index.html","65f9e40a15b2a19d9987f6e4483e84b3"],["categories/小程序/index.html","e97a4d961fe5d1c72095c582296b1366"],["categories/抓包工具/index.html","ccccff069195e400ffa0c1f38d7b57e6"],["categories/爬虫/index.html","245b2856a134f237ae6d12b6276a28fc"],["categories/编辑器/index.html","17fdf3f5c3ff40ee6b6a6fa2656e36e8"],["categories/记录/index.html","2e4e1f0f2e7db689866f309e6f49c072"],["categories/记录/page/2/index.html","517b2c7a611e6ce3f543f135fd6c5486"],["categories/记录/page/3/index.html","50af18908f3c1f193034ea23453f1046"],["categories/随笔/index.html","817db5a2d8d0c0aa7e4ad5abcedd3c90"],["css/index.css","625de03d915407b11cb4fec6f35c6af1"],["css/var.css","d41d8cd98f00b204e9800998ecf8427e"],["img/404.jpg","cae3eebf3121aedff311f6eea7e76a5e"],["img/algolia.svg","fd40b88ac5370a5353a50b8175c1f367"],["img/alipay.jpg","931e2f2cfcf009ec2bba4dbd7e8d6f4f"],["img/avatar.png","c0aee6bd75608aa441bebc86a8061c78"],["img/comment_bg.png","34a79bf208a1c3bee9d6e491a00cd369"],["img/friend_404.gif","68af0be9d22722e74665ef44dd532ba8"],["img/icp.png","6e26aed5ced63bc60524cc736611d39e"],["img/loading.gif","d1cf8d9ccb6a2b3514a7d14332035a3c"],["img/post_loadding.svg","2901bcb74c0f032ed139676618432304"],["img/wechat.jpg","77ba5dee903310dd569c2c0d171f72b2"],["index.html","1e33e8b5262e360ebcc6d7a324e25d80"],["js/main.js","bfde994589d567b1e063a9775db2dc5a"],["js/tw_cn.js","e117e6df2941c5ac37e9207a4ab8b8df"],["js/utils.js","57df79ed3fb0b9674e524aefdc04801f"],["page/2/index.html","c15353f67411d353bbe3e5786d298c2e"],["page/3/index.html","e5a1aa4c13382349e0f19224108c13df"],["page/4/index.html","a6f988729474c4d796eef78eecf1dace"],["tags/Charles/index.html","dd1b6f181942f8e2ded55b3646ddeacb"],["tags/Github/index.html","198ec96132db84d2c493e45b7c6bf97a"],["tags/JsDelivr/index.html","ee679b69a7af44040aa21150f3439e60"],["tags/PicGo/index.html","1c689b1def9185073dd11817a351c8c0"],["tags/Shell/index.html","739d71aa38fd8a550614488d2a09cf26"],["tags/ant-design-vue/index.html","a3fef30048f27a63d4e3d8831748d9b6"],["tags/baidu-map/index.html","d31b3ddc3166176d1969edfbba3aefd1"],["tags/css/index.html","c9e300aaceeb9cafd1855b16e629b512"],["tags/html/index.html","da386a2f1458b893d5e3129a7cad8319"],["tags/http/index.html","259358e46ac81d9b40e74b980d5b813c"],["tags/index.html","816cfb8c09c24520b1f1001051162f63"],["tags/javascript/index.html","3a701b715fe8be6759a128c4ede933f4"],["tags/javascript/page/2/index.html","9c03a6f49dfb2022477ffdc3d98c450b"],["tags/node-canvas/index.html","6560769eea8062ebf38fe450946e905e"],["tags/node/index.html","86709133fc7029942b787f64cfdf03bc"],["tags/vscode/index.html","d0ea474209023dd679cdd17e53cf9ad7"],["tags/vue/index.html","e9bc822516e2f224c5d1b7a805305301"],["tags/webpack/index.html","a44f2fe98b807ae2a678aac12858b018"],["tags/小程序/index.html","631bcff8e19aeea74336138e9b38c51d"],["tags/随笔/index.html","48be80782a52f1af14d5c8d55297de13"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







