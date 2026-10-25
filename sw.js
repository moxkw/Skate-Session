var C="skate-session-v7";
var A=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
function clean(r){return r.redirected?r.blob().then(function(b){return new Response(b,{status:200,statusText:"OK",headers:r.headers})}):Promise.resolve(r)}
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(A.map(function(u){
      return fetch(new Request(u,{cache:"reload"})).then(function(r){if(!r.ok)throw 0;return clean(r)}).then(function(r){return c.put(u,r)}).catch(function(){});
    }));
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var q=e.request;if(q.method!=="GET")return;
  e.respondWith(caches.open(C).then(function(c){
    return c.match(q,{ignoreSearch:true}).then(function(r){
      var net=fetch(q).then(function(n){if(n&&n.ok&&!n.redirected)c.put(q,n.clone());return n});
      if(r){net.catch(function(){});return r}
      return net.catch(function(){return q.mode==="navigate"?c.match("./index.html"):Response.error()});
    });
  }));
});
