System.register(["./p-5e3f33dd.system.js"],(function(e){"use strict";var r,t,i,a;return{setters:[function(e){r=e.r;t=e.c;i=e.h;a=e.H}],execute:function(){var n=".sr-only{border:0;clip:rect(0, 0, 0, 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute !important;width:1px;word-wrap:normal !important}div{-webkit-box-sizing:border-box;box-sizing:border-box}.progress-bar{border:2px solid var(--color-primary);border-radius:1em;display:block;height:1em;margin:1em 0;width:100%}.progress-bar-inner{background-color:var(--color-primary);content:'&nbsp;';display:block;height:100%;max-width:100%}";var o=e("va_progress_bar",function(){function e(e){r(this,e);this.componentLibraryAnalytics=t(this,"component-library-analytics",7);this.enableAnalytics=false;this.percent=undefined;this.label=undefined}e.prototype.componentDidRender=function(){if(this.enableAnalytics&&(this.percent===0||this.percent===100)){this.componentLibraryAnalytics.emit({componentName:"va-progress-bar",action:"change",details:{label:this.label||"".concat(this.percent,"% complete"),percent:this.percent}})}};e.prototype.render=function(){var e=this,r=e.label,t=r===void 0?"".concat(this.percent.toFixed(0),"% complete"):r,n=e.percent;return i(a,null,i("div",{"aria-label":t,"aria-valuemax":"100","aria-valuemin":"0","aria-valuenow":n.toFixed(0),"aria-valuetext":t,class:"progress-bar",tabindex:"0",role:"progressbar"},i("div",{class:"progress-bar-inner",style:{width:"".concat(n,"%")}})),i("span",{"aria-atomic":"true","aria-live":"polite",class:"sr-only"},n.toFixed(0),"% complete"))};return e}());o.style=n}}}));