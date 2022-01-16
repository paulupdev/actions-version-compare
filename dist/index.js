require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 464:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ }),

/***/ 923:
/***/ ((module) => {

module.exports = eval("require")("semver");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(396)
const github = __nccwpck_require__(716)
const fetch = __nccwpck_require__(464)
const semver = __nccwpck_require__(923)

try {
  if (github.context.eventName !== 'pull_request') {
    core.info('Skipping as it is not pull request')
    return
  }

  const token = core.getInput('token')
  const headers = {}
  if (token) {
    core.info('Using specified token')
    headers.Authorization = `token ${token}`
  }

  const baseSha = github.context.payload.pull_request.base.sha
  const headSha = github.context.payload.pull_request.head.sha

  core.info(`Comparing ${headSha} to ${baseSha}`)
  const baseUrl = `https://raw.githubusercontent.com/${github.context.repo.repo}/${baseSha}/package.json`

  fetch(baseUrl, { headers })
    .then(res => res.json())
    .then(res => res.version)
    .then(version => {
      const localVersion =
        require(`${process.env.GITHUB_WORKSPACE}/package.json`).version

      if (!semver.valid(localVersion))
        core.setFailed(
          `Current version '${localVersion}' detected as invalid one`
        )
      if (!semver.gt(localVersion, version))
        core.setFailed(
          `Version '${localVersion}' wasn't detected as greater than '${version}'`
        )
    })
    .catch(core.setFailed)
} catch (error) {
  core.setFailed(error.message)
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map