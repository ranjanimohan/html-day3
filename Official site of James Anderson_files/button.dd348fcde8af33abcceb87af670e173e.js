__twttrll([2],{107:function(a,t,e){var n=e(84);a.exports=n.build([e(108)])},108:function(a,t,e){function n(a){return"large"===a?"l":"m"}function s(a){a.params({screenName:{required:!0},lang:{required:!0,transform:g.matchLanguage,fallback:"en"},size:{fallback:"medium",transform:n},showScreenName:{fallback:!0},showCount:{fallback:!0},partner:{fallback:p(o.val,o,"partner")},count:{},preview:{}}),a.define("getUrlParams",function(){return l.compact({id:this.id,lang:this.params.lang,size:this.params.size,screen_name:this.params.screenName,show_count:"none"===this.params.count?!1:this.params.showCount,show_screen_name:this.params.showScreenName,preview:this.params.preview,partner:this.params.partner,dnt:m.enabled(),time:+new Date})}),a.around("widgetDataAttributes",function(a){return l.aug({"screen-name":this.params.screenName},a())}),a.around("scribeNamespace",function(a){return l.aug(a(),{page:"button",section:"follow"})}),a.define("scribeImpression",function(){this.scribe({action:"impression"},{language:this.params.lang,message:[this.params.size,"none"===this.params.count?"nocount":"withcount"].join(":")+":"})}),a.override("render",function(){var a=h(f,{lang:this.params.lang}),t=c.encode(this.getUrlParams()),e=u.base()+a+"#"+t;return this.scribeImpression(),r.all([this.sandbox.setTitle(b),this.sandbox.addClass(w),this.sandbox.loadDocument(e)])})}var r=e(2),i=e(84),o=e(37),u=e(93),m=e(33),h=e(109),l=e(11),c=e(24),p=e(13),d=e(110),g=e(90),f=d.followButtonHtmlPath,b="Twitter Follow Button",w="twitter-follow-button";a.exports=i.couple(e(96),e(111),s)},109:function(a,t){function e(a,t){return a.replace(n,function(a,e){return void 0!==t[e]?t[e]:a})}var n=/\{\{([\w_]+)\}\}/g;a.exports=e},110:function(a,t){a.exports={tweetButtonHtmlPath:"/widgets/tweet_button.8aaa8a700f2ad6e38ed8b762e8f8decc.{{lang}}.html",followButtonHtmlPath:"/widgets/follow_button.8aaa8a700f2ad6e38ed8b762e8f8decc.{{lang}}.html",hubHtmlPath:"/widgets/hub.8aaa8a700f2ad6e38ed8b762e8f8decc.html"}},231:function(a,t,e){var n=e(84);a.exports=n.build([e(232)])},232:function(a,t,e){function n(a){return"large"===a?"l":"m"}function s(a){return f.contains(C,a)}function r(a){return w.hashTag(a,!1)}function i(a){var t=/\+/.test(a)&&!/ /.test(a);return t?a.replace(/\+/g," "):a}function o(a){a.params({lang:{required:!0,transform:_.matchLanguage,fallback:"en"},size:{fallback:"medium",transform:n},type:{fallback:"share",validate:s},text:{transform:i},screenName:{transform:w.screenName},buttonHashtag:{transform:r},partner:{fallback:x(l.val,l,"partner")},via:{},related:{},hashtags:{},url:{}}),a.define("getUrlParams",function(){var a=this.params.text,t=this.params.url,e=this.params.via,n=this.params.related,s=g.getScreenNameFromPage();return"share"===this.params.type?(a=a||m.title,t=t||g.getCanonicalURL()||h.href,e=e||s):s&&(n=n?s+","+n:s),f.compact({id:this.id,lang:this.params.lang,size:this.params.size,type:this.params.type,text:a,url:t,via:e,related:n,button_hashtag:this.params.buttonHashtag,screen_name:this.params.screenName,hashtags:this.params.hashtags,partner:this.params.partner,original_referer:h.href,dnt:p.enabled(),time:+new Date})}),a.around("widgetDataAttributes",function(a){return"mention"==this.params.type?f.aug({"screen-name":this.params.screenName},a()):"hashtag"==this.params.type?f.aug({hashtag:this.params.buttonHashtag},a()):f.aug({url:this.params.url},a())}),a.around("scribeNamespace",function(a){return f.aug(a(),{page:"button",section:this.params.type})}),a.define("scribeImpression",function(){this.scribe({action:"impression"},{language:this.params.lang,message:[this.params.size,"nocount"].join(":")+":"})}),a.override("render",function(){var a,t=d(k,{lang:this.params.lang}),e=b.encode(this.getUrlParams()),n=c.base()+t+"#"+e;switch(this.params.type){case"hashtag":a=H;break;case"mention":a=B;break;default:a=z}return this.scribeImpression(),u.all([this.sandbox.setTitle(P),this.sandbox.addClass(y),this.sandbox.addClass(a),this.sandbox.loadDocument(n)])})}var u=e(2),m=e(9),h=e(18),l=e(37),c=e(93),p=e(33),d=e(109),g=e(35),f=e(11),b=e(24),w=e(23),v=e(84),x=e(13),N=e(110),_=e(90),k=N.tweetButtonHtmlPath,P="Twitter Tweet Button",y="twitter-tweet-button",z="twitter-share-button",H="twitter-hashtag-button",B="twitter-mention-button",C=["share","hashtag","mention"];a.exports=v.couple(e(96),e(111),o)}});