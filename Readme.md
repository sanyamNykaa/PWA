# Service Workers

Service workers essentially act as proxies between web browsers and web servers. They essentially aim to provide:

 - Effective offline experience
 - Intercept network requests and take appropriate action
 - Boost page performance 
 - Access to push notifications

## Concepts and Usages

### 1. Origin and path

A service worker is an event-driven worker registered against an origin and a path. A service worker's scope is determined by its location on a web server. If a service worker runs on a page located at `/subdir/index.html`, and is located at `/subdir/sw.js`, the service worker's scope is `/subdir/`. Explained using example: https://service-worker-scope-viewer.glitch.me/subdir/index.html

### 2. Lifecycle of a new service worker

When a new service worker is deployed for a website with no active service worker it goes through the following phases:

  - **Registration**
    To install a service worker, you have to register it on your background page. It informs the browser regarding the location of the service worker in a JavaScript file.

  - **Installation (Install Event)**

    After the successful completion of the registration process, the service worker script is downloaded and the installation event is initiated. You can define a callback for the `install event` and decide which files to cache.

  - **Activation**
  
    After successful installation, the service worker enters an installed state. It is not active yet but takes control of the page from the current service worker. 

  ### 3. Caching strategies

  We handle most routes for assets with one of the built-in caching strategies.

  - **Stale While Revalidate**

    It uses a cached response for a request if it's available and updates the cache in the background with a response from the network.

    ```
    import {registerRoute} from 'workbox-routing';
    import {StaleWhileRevalidate} from 'workbox-strategies';

    registerRoute(
      ({url}) => url.pathname.startsWith('/images/avatars/'),
      new StaleWhileRevalidate()
    );
    ```

  - **Network First**
  
    It tries to get a response from the network first. If a response is received, it passes that response to the browser and saves it to a cache. If the network request fails, the last cached response will be used, enabling offline access to the asset.

    ```
    import {registerRoute} from 'workbox-routing';
    import {NetworkFirst} from 'workbox-strategies';

    registerRoute(
      ({url}) => url.pathname.startsWith('/social-timeline/'),
      new NetworkFirst()
    );
    ```
  
  - **Cache First**
  
    It checks the cache for a response first and uses it if available. If the request isn't in the cache, the network is used and any valid response is added to the cache before being passed to the browser.

    ```
    import {registerRoute} from 'workbox-routing';
    import {CacheFirst} from 'workbox-strategies';

    registerRoute(({request}) => request.destination === 'style', new CacheFirst());
    ```

  - **Network Only**

    It forces the response to come from the network.

    ```
    import {registerRoute} from 'workbox-routing';
    import {NetworkOnly} from 'workbox-strategies';

    registerRoute(({url}) => url.pathname.startsWith('/admin/'), new NetworkOnly());
    ```

  - **Cache Only**

    It forces the response to come from the cache.

    ```
    import {registerRoute} from 'workbox-routing';
    import {CacheOnly} from 'workbox-strategies';

    registerRoute(({url}) => url.pathname.startsWith('/app/v2/'), new CacheOnly());
    ```

## Possible drawbacks

  1. If there are major bugs in your service worker logic, it can prevent a user from accessing your website.
  2. It cannot access the DOM directly.
  3. They can’t rely on global state within their `onfetch` and `onmessage` handlers because they are terminated when not in use and restarted when they are needed again.

## What to cache

 - CSS, images, fonts, JS, templates… basically anything you'd consider static to that "version" of your site.
 - Assets and resources required for offline user experience

## What not to cache

  - Any User-specific data or sensitive data, such as banking or credit card information.
  - Caching opaque response can result in a persistently broken experience, requiring you to explicitly clear your caches or deploy an updated service worker that uses a network-first strategy for cross-origin requests to fix the problem.
