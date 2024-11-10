var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/utils/clean-pathname-optional-ending.ts
var cleanPathnameOptionalEnding = /* @__PURE__ */ __name((pathname) => pathname == "/" ? pathname : pathname.replace(/\/index\.html$/, "").replace(/\/$/, ""), "cleanPathnameOptionalEnding");

// src/utils/is-on-page.ts
var isOnPage = /* @__PURE__ */ __name((path) => {
  if (!path.trim().length) {
    return false;
  }
  const url = new URL(path.trim(), location.origin);
  const matchesPath = cleanPathnameOptionalEnding(location.pathname) === cleanPathnameOptionalEnding(url.pathname);
  if (url.search) {
    return matchesPath && url.search === location.search;
  }
  return matchesPath;
}, "isOnPage");

// src/utils/json-parse.ts
function jsonParse(value) {
  if (value && typeof value === "string") {
    try {
      value = value === "undefined" ? void 0 : JSON.parse(value.replace(/['`]/g, '"'));
    } catch (e) {
    }
  }
  return value;
}
__name(jsonParse, "jsonParse");

// src/utils/get-search-params.ts
var getSearchParams = /* @__PURE__ */ __name(() => {
  const searchParams = new URLSearchParams(location.search);
  const res = {};
  for (const key of searchParams.keys()) {
    const val = searchParams.get(key);
    res[key] = val ? jsonParse(val) : null;
  }
  return res;
}, "getSearchParams");

// src/utils/is-primitive.ts
var isPrimitive = /* @__PURE__ */ __name((val) => {
  return val === null || /undefined|number|string|bigint|boolean|symbol/.test(typeof val);
}, "isPrimitive");

// src/utils/json-stringify.ts
function jsonStringify(value) {
  if (!isPrimitive(value)) {
    try {
      return JSON.stringify(value);
    } catch (e) {
    }
  }
  return String(value);
}
__name(jsonStringify, "jsonStringify");

// src/utils/get-path-match-params.ts
var getPathMatchParams = /* @__PURE__ */ __name((path, { pattern, params }) => {
  path = cleanPathnameOptionalEnding(path);
  const match = path.match(pattern);
  if (match) {
    const [, ...paramValues] = match;
    return params.reduce(
      (acc, p, i) => ({ ...acc, [p]: paramValues[i] ?? null }),
      {}
    );
  }
  return null;
}, "getPathMatchParams");

// src/utils/path-string-to-pattern.ts
var pathStringToPattern = /* @__PURE__ */ __name((path, exact = true) => {
  path = cleanPathnameOptionalEnding(path);
  const params = [];
  const rep = path.replace(/:([^/]+)/g, (s, p) => {
    params.push(p);
    return "([^/]+)";
  }).replace(/\?/g, "\\?");
  return {
    pattern: new RegExp(`^${rep}${exact ? "$" : "(\\/.*)?$"}`),
    params
  };
}, "pathStringToPattern");

// src/pages.ts
var routeListeners = /* @__PURE__ */ new Set();
var broadcast = /* @__PURE__ */ __name(() => {
  routeListeners.forEach((cb) => {
    cb(
      cleanPathnameOptionalEnding(location.pathname),
      getSearchParams(),
      getPageData()
    );
  });
}, "broadcast");
window.addEventListener("popstate", () => {
  broadcast();
});
var onPageChange = /* @__PURE__ */ __name((sub) => {
  routeListeners.add(sub);
  sub(
    cleanPathnameOptionalEnding(location.pathname),
    getSearchParams(),
    getPageData()
  );
  return () => {
    routeListeners.delete(sub);
  };
}, "onPageChange");
var goToPage = /* @__PURE__ */ __name((pathname, data = {}, title = document.title) => {
  window.history.pushState(data, title, pathname);
  if (title !== document.title) {
    document.title = title;
  }
  broadcast();
}, "goToPage");
var replacePage = /* @__PURE__ */ __name((pathname, state = {}, title = document.title) => {
  window.history.replaceState(state, title, pathname);
  if (title !== document.title) {
    document.title = title;
  }
  broadcast();
}, "replacePage");
var previousPage = /* @__PURE__ */ __name(() => {
  window.history.back();
}, "previousPage");
var nextPage = /* @__PURE__ */ __name(() => {
  window.history.forward();
}, "nextPage");
var getPageData = /* @__PURE__ */ __name(() => {
  return window.history.state;
}, "getPageData");
var updateSearchQuery = /* @__PURE__ */ __name((query) => {
  if (query === null) {
    window.history.replaceState(
      history.state,
      document.title,
      location.pathname
    );
  } else {
    const searchParams = new URLSearchParams(window.location.search);
    for (const queryKey in query) {
      const val = query[queryKey];
      if (val) {
        searchParams.set(queryKey, jsonStringify(query[queryKey]));
      }
    }
    window.history.replaceState(
      history.state,
      document.title,
      location.pathname + `?${searchParams.toString()}`
    );
  }
  broadcast();
}, "updateSearchQuery");
var knownRoutes = /* @__PURE__ */ new Map();
var registerRoute = /* @__PURE__ */ __name((pathname, exact = false) => {
  knownRoutes.set(pathname, { pathname, exact });
}, "registerRoute");
var isRegisteredRoute = /* @__PURE__ */ __name((pathname) => Array.from(knownRoutes.values()).some(
  (p) => getPathMatchParams(pathname, pathStringToPattern(p.pathname, p.exact))
), "isRegisteredRoute");
var getPageParams = /* @__PURE__ */ __name(() => {
  for (const p of knownRoutes.values()) {
    const params = getPathMatchParams(
      location.pathname,
      pathStringToPattern(p.pathname, p.exact)
    );
    if (params)
      return params;
  }
  return {};
}, "getPageParams");
var parsePathname = /* @__PURE__ */ __name((pathname) => {
  const currentPathnameParts = location.pathname.split("/");
  return pathname.split("/").map((p, i) => /:.+/.test(p) ? currentPathnameParts[i] : p).join("/");
}, "parsePathname");

// src/utils/get-ancestor-page-route.ts
var getAncestorPageRoute = /* @__PURE__ */ __name((el) => {
  let pageRoute = el.parentNode;
  while (pageRoute) {
    if (pageRoute instanceof ShadowRoot) {
      pageRoute = pageRoute.host;
    }
    if (/PAGE-ROUTE/.test(pageRoute.nodeName)) {
      break;
    }
    pageRoute = pageRoute.parentNode;
  }
  return pageRoute ?? null;
}, "getAncestorPageRoute");

// src/components/page-link.ts
var page_link_default = /* @__PURE__ */ __name(({
  html,
  WebComponent
}) => {
  class PageLink extends WebComponent {
    static observedAttributes = [
      "path",
      "search",
      "keep-current-search",
      "title",
      "payload"
    ];
    path = "";
    search = "";
    keepCurrentSearch = false;
    title = "";
    payload = {};
    #parentRoute = null;
    fullPath = () => {
      const search = new URLSearchParams(this.props.search());
      let path = this.props.path();
      if (!this.hasAttribute("path")) {
        path = cleanPathnameOptionalEnding(location.pathname);
      } else if (path.startsWith("$")) {
        path = cleanPathnameOptionalEnding(
          path.replace(
            /^\$/,
            parsePathname(this.#parentRoute?.fullPath ?? "/")
          )
        );
      } else if (path.startsWith("~")) {
        path = cleanPathnameOptionalEnding(
          path.replace(/^~/, location.pathname)
        );
      }
      const url = new URL(path, location.origin);
      if (this.props.keepCurrentSearch()) {
        const currentQuery = new URLSearchParams(location.search);
        currentQuery.forEach((v, k) => {
          url.searchParams.set(k, v);
        });
      }
      search.forEach((v, k) => {
        url.searchParams.set(k, v);
      });
      return url.pathname + url.search;
    };
    handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      goToPage(this.fullPath(), this.props.payload(), this.props.title());
    };
    toggleActive = (active) => {
      if (active) {
        this.setAttribute("active", "");
      } else {
        this.removeAttribute("active");
      }
    };
    onMount() {
      this.#parentRoute = getAncestorPageRoute(this);
      return onPageChange(() => {
        const newActive = isOnPage(this.fullPath());
        if (newActive !== this.hasAttribute("active")) {
          this.toggleActive(newActive);
          this.dispatch("active", {
            value: newActive
          });
        }
      });
    }
    render() {
      return html`
                <a
                    part="anchor"
                    href="${this.fullPath}"
                    onclick="${this.handleClick}"
                >
                    <slot></slot>
                </a>
            `;
    }
  }
  __name(PageLink, "PageLink");
  customElements.define("page-link", PageLink);
}, "default");

// src/components/page-route.ts
var page_route_default = /* @__PURE__ */ __name(({
  html,
  WebComponent,
  HtmlTemplate
}) => {
  const cachedResult = {};
  registerRoute("/");
  class PageRoute extends WebComponent {
    static observedAttributes = ["path", "src", "title", "exact"];
    initialState = {
      status: 0 /* Idle */
    };
    path = "";
    src = "";
    title = "";
    exact = true;
    #parentRoute = null;
    #search = "";
    get fullPath() {
      return (this.#parentRoute?.fullPath ?? "") + this.props.path();
    }
    _clearContent = () => {
      if (this.hasAttribute("src")) {
        const content = cachedResult[this.props.src()];
        if (content && typeof content.unmount === "function") {
          ;
          content.unmount();
        } else {
          this.innerHTML = "";
        }
      }
    };
    _loadContent = async (params, query) => {
      const src = this.props.src();
      this.setState({ status: 1 /* Loading */ });
      let content = cachedResult[src];
      if (!content) {
        try {
          if (/\.([jt])s$/.test(src)) {
            ;
            ({ default: content } = await (src.startsWith("file:") ? import(src.replace(/^file:/, "")) : import(new URL(src, location.origin).href)));
          } else {
            const res = await fetch(src);
            if (res.status === 200) {
              content = await res.text();
            } else {
              throw new Error(
                `Loading "${this.props.src()}" content failed with status code ${res.status}`
              );
            }
          }
          cachedResult[src] = content;
        } catch (err) {
          this.setState({ status: 3 /* LoadingFailed */ });
          return console.error(err);
        }
      }
      if (this.mounted) {
        try {
          if (typeof content === "function") {
            content = await content(
              getPageData(),
              params,
              query
            );
          }
          this._clearContent();
          if (typeof content.render === "function") {
            ;
            content.render(this);
          } else if (content instanceof Node) {
            this.appendChild(content);
          } else {
            this.innerHTML = String(content);
          }
          this.setState({ status: 2 /* Loaded */ });
        } catch (err) {
          this.setState({ status: 3 /* LoadingFailed */ });
          return console.error(err);
        }
      }
    };
    _handlePageChange = (pathname, query) => {
      const params = getPathMatchParams(
        pathname + (this.#search ? location.search : ""),
        pathStringToPattern(this.fullPath, this.props.exact())
      );
      if (params !== null) {
        if (this.hasAttribute("src") && this.state.status() !== 1 /* Loading */ && this.state.status() !== 2 /* Loaded */) {
          this._loadContent(params, query);
        } else if (this.state.status() !== 2 /* Loaded */) {
          this.setState({ status: 2 /* Loaded */ });
        }
        document.title = this.props.title();
        this.hidden = false;
        return;
      }
      if (this.state.status() !== 0 /* Idle */) {
        this.setState({ status: 0 /* Idle */ });
        this._clearContent();
      }
      this.hidden = true;
    };
    onMount() {
      this.#parentRoute = getAncestorPageRoute(this);
      const url = new URL(this.fullPath, location.origin);
      this.#search = url.search;
      registerRoute(url.pathname, this.props.exact());
      return onPageChange(this._handlePageChange);
    }
    render() {
      const visible = html`<slot></slot>`;
      const hidden = html`<slot name="hidden"></slot>`;
      const loading = html`<slot name="loading"><p>Loading...</p></slot>`;
      const failed = html` <slot name="fallback"
                ><p>Failed to load content</p></slot
            >`;
      return html`
                ${() => {
        switch (this.state.status()) {
          case 2 /* Loaded */:
            return visible;
          case 1 /* Loading */:
            return loading;
          case 3 /* LoadingFailed */:
            return failed;
          default:
            return hidden;
        }
      }}
            `;
    }
  }
  __name(PageRoute, "PageRoute");
  class PageRouteQuery extends PageRoute {
    static observedAttributes = ["key", "value", "src"];
    key = "";
    value = "";
    #parentRoute = null;
    get fullPath() {
      return this.#parentRoute?.fullPath ?? "/";
    }
    _handlePageChange = (pathname, query) => {
      const params = getPathMatchParams(
        pathname,
        pathStringToPattern(
          this.fullPath,
          this.#parentRoute?.props.exact() ?? false
        )
      );
      const key = this.props.key();
      const value = this.props.value();
      if (params === null)
        return;
      if (query[key] === value) {
        if (this.props.src() && this.state.status() !== 1 /* Loading */ && this.state.status() !== 2 /* Loaded */) {
          this._loadContent(params, query);
        } else {
          console.log(
            "-- PathChangeListener",
            { params, key, value },
            2 /* Loaded */
          );
          this.setState({ status: 2 /* Loaded */ });
        }
        this.hidden = false;
        return;
      }
      if (this.state.status() !== 0 /* Idle */) {
        this.setState({ status: 0 /* Idle */ });
        this.hasAttribute("src") && this._clearContent();
      }
      this.hidden = true;
    };
    onMount() {
      this.#parentRoute = getAncestorPageRoute(this);
      return onPageChange(this._handlePageChange);
    }
  }
  __name(PageRouteQuery, "PageRouteQuery");
  class PageRedirect extends WebComponent {
    static observedAttributes = ["to", "type"];
    to = "";
    type = "unknown";
    onMount() {
      const pageRoute = getAncestorPageRoute(this);
      return onPageChange((pathname) => {
        const parentPath = cleanPathnameOptionalEnding(
          pageRoute?.fullPath ?? "/"
        );
        if (pathname.startsWith(parentPath)) {
          if (this.props.type() === "always") {
            if (pathname + location.search === parentPath) {
              goToPage(this.props.to());
            }
          } else if (!isRegisteredRoute(pathname)) {
            goToPage(this.props.to());
          }
        }
      });
    }
  }
  __name(PageRedirect, "PageRedirect");
  customElements.define("page-route", PageRoute);
  customElements.define("page-route-query", PageRouteQuery);
  customElements.define("page-redirect", PageRedirect);
}, "default");

// src/components/page-data.ts
var page_data_default = /* @__PURE__ */ __name(({
  WebComponent
}) => {
  class PageData extends WebComponent {
    static observedAttributes = ["param", "search-param", "key"];
    key = "";
    param = "";
    searchParam = "";
    _updateValue = () => {
      if (this.hasAttribute("param")) {
        const params = getPageParams();
        this.textContent = params[this.props.param()];
        return;
      }
      if (this.hasAttribute("search-param")) {
        const searchParams = getSearchParams();
        this.textContent = searchParams[this.props.searchParam()];
        return;
      }
      let data = getPageData();
      if (this.hasAttribute("key")) {
        const keyParts = this.props.key().split(".");
        for (const k of keyParts) {
          if (k in data) {
            data = data[k];
          } else {
            break;
          }
        }
      }
      this.textContent = jsonStringify(data);
    };
    onMount() {
      return onPageChange(this._updateValue);
    }
    onUpdate() {
      this._updateValue();
    }
    render() {
      return "<slot></slot>";
    }
  }
  __name(PageData, "PageData");
  customElements.define("page-data", PageData);
}, "default");

// src/client.ts
if (!window.BFS?.MARKUP || !window.BFS.WebComponent) {
  throw new Error(
    `BFS.MARKUP and BFS.WebComponent are required in order for BFS.ROUTER to work. Please add the following script to the HTML head tag "<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"><\/script>"`
  );
}
if (window.BFS) {
  const BFS = { ...window.BFS ?? {}, ...window.BFS?.MARKUP };
  page_route_default(BFS);
  page_link_default(BFS);
  page_data_default(BFS);
  window.BFS = {
    ...window.BFS || {},
    ROUTER: {
      goToPage,
      replacePage,
      previousPage,
      nextPage,
      onPageChange,
      isOnPage,
      getSearchParams,
      getPageData,
      getPageParams,
      registerRoute,
      isRegisteredRoute,
      updateSearchQuery
    }
  };
}
//# sourceMappingURL=client.js.map
