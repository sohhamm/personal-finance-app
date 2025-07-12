# Bun Documentation

> Bun is a fast all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler,
> test runner, and Node.js-compatible package manager.

This documentation covers all aspects of using Bun, from installation to advanced usage.

## Recent Bun Versions

- [Bun v1.2.16](https://bun.sh/blog/bun-v1.2.16.md): and adds +119 passing Node.js tests. Serve
  files with `Bun.serve` through `routes`, `install.linkWorkspacePackages` option in `bunfig.toml`,
  `bun outdated` support for catalogs, `Bun.hash.rapidhash`, `node:net` compatibility,
  `vm.SyntheticModule` support, `HTTPParser` binding, and memory leak fixes.
- [Bun v1.2.15](https://bun.sh/blog/bun-v1.2.15.md): bun audit scans dependencies for security
  vulnerabilities, bun pm view shows package metadata from npm. bun init adds a Cursor rule to use
  Bun instead of Node.js/Vite/npm/pnpm, `node:vm SourceTextModule` and
  `node:perf_hooks createHistogram` are now implemented.
- [Bun v1.2.14](https://bun.sh/blog/bun-v1.2.14.md): Adds support for catalogs in bun install,
  --react flag for bun init, improved HTTP routing with method-specific routes, better TypeScript
  default module settings, fixes a HTTPS proxy issue impacting Codex, and several Node.js
  compatibility improvements including worker_threads reliability enhancements and http2 server
  improvements.
- [Bun v1.2.13](https://bun.sh/blog/bun-v1.2.13.md): adding +28 passing Node.js tests). Improved
  --hot stability and Node.js compatibility. Better `node:worker_threads` support, environment data,
  reduced memory usage for child_process IPC and worker_threads. Fixes BOM handling in `.npmrc`
  files. Fixes hot reloading on older versions of chrome
- [Bun v1.2.12](https://bun.sh/blog/bun-v1.2.12.md): Stream browser console logs to your terminal,
  dev server uses less memory. Node.js compatibility improvements for timers, vm, net, http, and
  bugfixes for TextDecoder, hot reloading reliability bugfixes

## Documentation Sections

### Intro

- [What is Bun?](https://bun.sh/docs/index.md): Bun is an all-in-one runtime for JavaScript and
  TypeScript apps. Build, run, and test apps with one fast tool.
- [Installation](https://bun.sh/docs/installation.md): Install Bun with npm, Homebrew, Docker, or
  the official install script.
- [Quickstart](https://bun.sh/docs/quickstart.md): Get started with Bun by building and running a
  simple HTTP server in 6 lines of TypeScript.
- [TypeScript](https://bun.sh/docs/typescript.md): Install and configure type declarations for Bun's
  APIs

### Templating

- [`bun init`](https://bun.sh/docs/cli/init.md): Scaffold an empty Bun project.
- [`bun create`](https://bun.sh/docs/cli/bun-create.md): Scaffold a new Bun project from an official
  template or GitHub repo.

### Runtime

- [`bun run`](https://bun.sh/docs/cli/run.md): Use `bun run` to execute JavaScript/TypeScript files
  and package.json scripts.
- [File types](https://bun.sh/docs/runtime/loaders.md): Bun's runtime supports JavaScript/TypeScript
  files, JSX syntax, Wasm, JSON/TOML imports, and more.
- [TypeScript](https://bun.sh/docs/runtime/typescript.md): Bun can directly execute TypeScript files
  without additional configuration.
- [JSX](https://bun.sh/docs/runtime/jsx.md): Bun can directly execute TypeScript files without
  additional configuration.
- [Environment variables](https://bun.sh/docs/runtime/env.md): How to read and set environment
  variables, plus how to use them to configure Bun
- [Bun APIs](https://bun.sh/docs/runtime/bun-apis.md): Bun provides a set of highly optimized native
  APIs for performing common tasks.
- [Web APIs](https://bun.sh/docs/runtime/web-apis.md): Bun implements an array of Web-standard APIs
  like fetch, URL, and WebSocket.
- [Node.js compatibility](https://bun.sh/docs/runtime/nodejs-apis.md): Bun aims for full Node.js
  compatibility. This page tracks the current compatibility status.
- [Single-file executable](https://bun.sh/docs/bundler/executables.md): Compile a TypeScript or
  JavaScript file to a standalone executable
- [Plugins](https://bun.sh/docs/runtime/plugins.md): Implement custom loaders and module resolution
  logic with Bun's plugin system.
- [Watch mode](https://bun.sh/docs/runtime/hot.md): Reload your application & tests automatically.
- [Module resolution](https://bun.sh/docs/runtime/modules.md): Bun uses ESM and implements an
  extended version of the Node.js module resolution algorithm.
- [Auto-install](https://bun.sh/docs/runtime/autoimport.md): Never use node_modules again. Bun can
  optionally auto-install your dependencies on the fly.
- [bunfig.toml](https://bun.sh/docs/runtime/bunfig.md): Bun's runtime is configurable with
  environment variables and the bunfig.toml config file.
- [Debugger](https://bun.sh/docs/runtime/debugger.md): Debug your code with Bun's web-based debugger
  or VS Code extension

### Package manager

- [`bun install`](https://bun.sh/docs/cli/install.md): Install all dependencies with `bun install`,
  or manage dependencies with `bun add` and `bun remove`.
- [`bun add`](https://bun.sh/docs/cli/add.md): Add dependencies to your project.
- [`bun remove`](https://bun.sh/docs/cli/remove.md): Remove dependencies from your project.
- [`bun update`](https://bun.sh/docs/cli/update.md): Update your project's dependencies.
- [`bun publish`](https://bun.sh/docs/cli/publish.md): Publish your package to an npm registry.
- [`bun outdated`](https://bun.sh/docs/cli/outdated.md): Check for outdated dependencies.
- [`bun link`](https://bun.sh/docs/cli/link.md): Install local packages as dependencies in your
  project.
- [`bun pm`](https://bun.sh/docs/cli/pm.md): Utilities relating to package management with Bun.
- [Global cache](https://bun.sh/docs/install/cache.md): Bun's package manager installs all packages
  into a shared global cache to avoid redundant re-downloads.
- [Workspaces](https://bun.sh/docs/install/workspaces.md): Bun's package manager supports workspaces
  and monorepo development workflows.
- [Catalogs](https://bun.sh/docs/install/catalogs.md): Use catalogs to share dependency versions
  between packages in a monorepo.
- [Lifecycle scripts](https://bun.sh/docs/install/lifecycle.md): How Bun handles package lifecycle
  scripts with trustedDependencies
- [Filter](https://bun.sh/docs/cli/filter.md): Run scripts in multiple packages in parallel
- [Lockfile](https://bun.sh/docs/install/lockfile.md): Bun's lockfile `bun.lock` tracks your
  resolved dependency tree, making future installs fast and repeatable.
- [Scopes and registries](https://bun.sh/docs/install/registries.md): How to configure private
  scopes, custom package registries, authenticating with npm token, and more.
- [Overrides and resolutions](https://bun.sh/docs/install/overrides.md): Specify version ranges for
  nested dependencies
- [Patch dependencies](https://bun.sh/docs/install/patch.md): Patch dependencies in your project to
  fix bugs or add features without vendoring the entire package.
- [Audit dependencies](https://bun.sh/docs/install/audit.md): Check installed packages for
  vulnerabilities.
- [.npmrc support](https://bun.sh/docs/install/npmrc.md): Bun supports loading some configuration
  options from .npmrc

### Bundler

- [`Bun.build`](https://bun.sh/docs/bundler): Bundle code for consumption in the browser with Bun's
  native bundler.
- [HTML & static sites](https://bun.sh/docs/bundler/html.md): Zero-config HTML bundler for
  single-page apps and multi-page apps. Automatic bundling, TailwindCSS plugins, TypeScript, JSX,
  React support, and incredibly fast builds
- [CSS](https://bun.sh/docs/bundler/css.md): Production ready CSS bundler with support for modern
  CSS features, CSS modules, and more.
- [Fullstack Dev Server](https://bun.sh/docs/bundler/fullstack.md): Serve your frontend and backend
  from the same app with Bun's dev server.
- [Hot reloading](https://bun.sh/docs/bundler/hmr.md): Update modules in a running application
  without reloading the page using import.meta.hot
- [Loaders](https://bun.sh/docs/bundler/loaders.md): Bun's built-in loaders for the bundler and
  runtime
- [Plugins](https://bun.sh/docs/bundler/plugins.md): Implement custom loaders and module resolution
  logic with Bun's plugin system.
- [Macros](https://bun.sh/docs/bundler/macros.md): Run JavaScript functions at bundle-time and
  inline the results into your bundle
- [vs esbuild](https://bun.sh/docs/bundler/vs-esbuild.md): Guides for migrating from other bundlers
  to Bun.

### Test runner

- [`bun test`](https://bun.sh/docs/cli/test.md): Bun's test runner uses Jest-compatible syntax but
  runs 100x faster.
- [Writing tests](https://bun.sh/docs/test/writing.md): Write your tests using Jest-like expect
  matchers, plus setup/teardown hooks, snapshot testing, and more
- [Watch mode](https://bun.sh/docs/test/hot.md): Reload your tests automatically on change.
- [Lifecycle hooks](https://bun.sh/docs/test/lifecycle.md): Add lifecycle hooks to your tests that
  run before/after each test or test run
- [Mocks](https://bun.sh/docs/test/mocks.md): Mocks functions and track method calls
- [Snapshots](https://bun.sh/docs/test/snapshots.md): Add lifecycle hooks to your tests that run
  before/after each test or test run
- [Dates and times](https://bun.sh/docs/test/time.md): Control the date & time in your tests for
  more reliable and deterministic tests
- [Code coverage](https://bun.sh/docs/test/coverage.md): Generate code coverage reports with
  `bun test --coverage`
- [Test reporters](https://bun.sh/docs/test/reporters.md): Add a junit reporter to your test runs
- [Test configuration](https://bun.sh/docs/test/configuration.md): Configure the test runner with
  bunfig.toml
- [Runtime behavior](https://bun.sh/docs/test/runtime-behavior.md): Learn how the test runner
  affects Bun's runtime behavior
- [Finding tests](https://bun.sh/docs/test/discovery.md): Learn how the test runner discovers tests
- [DOM testing](https://bun.sh/docs/test/dom.md): Write headless tests for UI and
  React/Vue/Svelte/Lit components with happy-dom

### Package runner

- [`bunx`](https://bun.sh/docs/cli/bunx.md): Use `bunx` to auto-install and run executable packages
  from npm.

### API

- [HTTP server](https://bun.sh/docs/api/http.md): Bun implements a fast HTTP server built on
  Request/Response objects, along with supporting node:http APIs.
- [HTTP client](https://bun.sh/docs/api/fetch.md): Bun implements Web-standard fetch with some
  Bun-native extensions.
- [WebSockets](https://bun.sh/docs/api/websockets.md): Bun supports server-side WebSockets with
  on-the-fly compression, TLS support, and a Bun-native pubsub API.
- [Workers](https://bun.sh/docs/api/workers.md): Run code in a separate thread with Bun's native
  Worker API.
- [Binary data](https://bun.sh/docs/api/binary-data.md): How to represent and manipulate binary data
  in Bun.
- [Streams](https://bun.sh/docs/api/streams.md): Reading, writing, and manipulating streams of data
  in Bun.
- [SQL](https://bun.sh/docs/api/sql.md): Bun provides fast, native bindings for interacting with
  PostgreSQL databases.
- [S3 Object Storage](https://bun.sh/docs/api/s3.md): Bun provides fast, native bindings for
  interacting with S3-compatible object storage services.
- [File I/O](https://bun.sh/docs/api/file-io.md): Read and write files fast with Bun's heavily
  optimized file system API.
- [Redis client](https://bun.sh/docs/api/redis.md): Bun provides a fast, native Redis client with
  automatic command pipelining for better performance.
- [import.meta](https://bun.sh/docs/api/import-meta.md): Module-scoped metadata and utilities
- [SQLite](https://bun.sh/docs/api/sqlite.md): The fastest SQLite driver for JavaScript is baked
  directly into Bun.
- [FileSystemRouter](https://bun.sh/docs/api/file-system-router.md): Resolve incoming HTTP requests
  against a local file system directory with Bun's fast, Next.js-compatible router.
- [TCP sockets](https://bun.sh/docs/api/tcp.md): Bun's native API implements Web-standard TCP
  Sockets, plus a Bun-native API for building fast TCP servers.
- [UDP sockets](https://bun.sh/docs/api/udp.md): Bun's native API implements fast and flexible UDP
  sockets.
- [Globals](https://bun.sh/docs/api/globals.md): Bun implements a range of Web APIs, Node.js APIs,
  and Bun-native APIs that are available in the global scope.
- [$ Shell](https://bun.sh/docs/runtime/shell.md): Bun's cross-platform shell-scripting API makes
  shell scripting with JavaScript fun
- [Child processes](https://bun.sh/docs/api/spawn.md): Spawn sync and async child processes with
  easily configurable input and output streams.
- [HTMLRewriter](https://bun.sh/docs/api/html-rewriter.md): Parse and transform HTML with Bun's
  native HTMLRewriter API, inspired by Cloudflare Workers.
- [Hashing](https://bun.sh/docs/api/hashing.md): Native support for a range of fast hashing
  algorithms.
- [Console](https://bun.sh/docs/api/console.md): Bun implements a Node.js-compatible `console`
  object with colorized output and deep pretty-printing.
- [Cookie](https://bun.sh/docs/api/cookie.md): Bun's native Cookie API simplifies working with HTTP
  cookies.
- [FFI](https://bun.sh/docs/api/ffi.md): Call native code from JavaScript with Bun's foreign
  function interface (FFI) API.
- [C Compiler](https://bun.sh/docs/api/cc.md): Build & run native C from JavaScript with Bun's
  native C compiler API
- [Testing](https://bun.sh/docs/cli/test.md): Bun's built-in test runner is fast and uses
  Jest-compatible syntax.
- [Utils](https://bun.sh/docs/api/utils.md): Bun implements a set of utilities that are commonly
  required by developers.
- [Node-API](https://bun.sh/docs/api/node-api.md): Bun implements the Node-API spec for building
  native addons.
- [Glob](https://bun.sh/docs/api/glob.md): Bun includes a fast native Glob implementation for
  matching file paths.
- [DNS](https://bun.sh/docs/api/dns.md): Resolve domain names to IP addresses.
- [Semver](https://bun.sh/docs/api/semver.md): Bun's native Semver implementation is 20x faster than
  the popular `node-semver` package.
- [Color](https://bun.sh/docs/api/color.md): Bun's color function leverages Bun's CSS parser for
  parsing, normalizing, and converting colors from user input to a variety of output formats.
- [Transpiler](https://bun.sh/docs/api/transpiler.md): Bun exposes its internal transpiler as a
  pluggable API.

### Project

- [Roadmap](https://bun.sh/docs/project/roadmap.md): Track Bun's near-term and long-term goals.
- [Benchmarking](https://bun.sh/docs/project/benchmarking.md): Bun is designed for performance.
  Learn how to benchmark Bun yourself.
- [Contributing](https://bun.sh/docs/project/contributing.md): Learn how to contribute to Bun and
  get your local development environment up and running.
- [Building Windows](https://bun.sh/docs/project/building-windows.md): Learn how to setup a
  development environment for contributing to the Windows build of Bun.
- [Bindgen](https://bun.sh/docs/project/bindgen.md): About the bindgen code generator
- [License](https://bun.sh/docs/project/licensing.md): Bun is a MIT-licensed project with a large
  number of statically-linked dependencies with various licenses.

## Guides

### Guides: Ecosystem

- [Add Sentry to a Bun app](https://bun.sh/guides/ecosystem/sentry.md)
- [Build a frontend using Vite and Bun](https://bun.sh/guides/ecosystem/vite.md)
- [Build a React app with Bun](https://bun.sh/guides/ecosystem/react.md)
- [Build an app with Astro and Bun](https://bun.sh/guides/ecosystem/astro.md)
- [Build an app with Next.js and Bun](https://bun.sh/guides/ecosystem/nextjs.md)
- [Build an app with Nuxt and Bun](https://bun.sh/guides/ecosystem/nuxt.md)
- [Build an app with Qwik and Bun](https://bun.sh/guides/ecosystem/qwik.md)
- [Build an app with Remix and Bun](https://bun.sh/guides/ecosystem/remix.md)
- [Build an app with SolidStart and Bun](https://bun.sh/guides/ecosystem/solidstart.md)
- [Build an app with SvelteKit and Bun](https://bun.sh/guides/ecosystem/sveltekit.md)
- [Build an HTTP server using Elysia and Bun](https://bun.sh/guides/ecosystem/elysia.md)
- [Build an HTTP server using Express and Bun](https://bun.sh/guides/ecosystem/express.md)
- [Build an HTTP server using Hono and Bun](https://bun.sh/guides/ecosystem/hono.md)
- [Build an HTTP server using StricJS and Bun](https://bun.sh/guides/ecosystem/stric.md)
- [Containerize a Bun application with Docker](https://bun.sh/guides/ecosystem/docker.md)
- [Create a Discord bot](https://bun.sh/guides/ecosystem/discordjs.md)
- [Deploy a Bun application on Render](https://bun.sh/guides/ecosystem/render.md)
- [Read and write data to MongoDB using Mongoose and Bun](https://bun.sh/guides/ecosystem/mongoose.md)
- [Run Bun as a daemon with PM2](https://bun.sh/guides/ecosystem/pm2.md)
- [Run Bun as a daemon with systemd](https://bun.sh/guides/ecosystem/systemd.md)
- [Server-side render (SSR) a React component](https://bun.sh/guides/ecosystem/ssr-react.md)
- [Use Drizzle ORM with Bun](https://bun.sh/guides/ecosystem/drizzle.md)
- [Use EdgeDB with Bun](https://bun.sh/guides/ecosystem/edgedb.md)
- [Use Neon Postgres through Drizzle ORM](https://bun.sh/guides/ecosystem/neon-drizzle.md)
- [Use Neon's Serverless Postgres with Bun](https://bun.sh/guides/ecosystem/neon-serverless-postgres.md)
- [Use Prisma with Bun](https://bun.sh/guides/ecosystem/prisma.md)

### Guides: WebSocket

- [Build a publish-subscribe WebSocket server](https://bun.sh/guides/websocket/pubsub.md)
- [Build a simple WebSocket server](https://bun.sh/guides/websocket/simple.md)
- [Enable compression for WebSocket messages](https://bun.sh/guides/websocket/compression.md)
- [Set per-socket contextual data on a WebSocket](https://bun.sh/guides/websocket/context.md)

### Guides: Package manager

- [Add a dependency](https://bun.sh/guides/install/add.md)
- [Add a development dependency](https://bun.sh/guides/install/add-dev.md)
- [Add a Git dependency](https://bun.sh/guides/install/add-git.md)
- [Add a peer dependency](https://bun.sh/guides/install/add-peer.md)
- [Add a tarball dependency](https://bun.sh/guides/install/add-tarball.md)
- [Add a trusted dependency](https://bun.sh/guides/install/trusted.md)
- [Add an optional dependency](https://bun.sh/guides/install/add-optional.md)
- [Configure a private registry for an organization scope with bun install](https://bun.sh/guides/install/registry-scope.md)
- [Configure git to diff Bun's lockb lockfile](https://bun.sh/guides/install/git-diff-bun-lockfile.md)
- [Configuring a monorepo using workspaces](https://bun.sh/guides/install/workspaces.md)
- [Generate a yarn-compatible lockfile](https://bun.sh/guides/install/yarnlock.md)
- [Install a package under a different name](https://bun.sh/guides/install/npm-alias.md)
- [Install dependencies with Bun in GitHub Actions](https://bun.sh/guides/install/cicd.md)
- [Migrate from npm install to bun install](https://bun.sh/guides/install/from-npm-install-to-bun-install.md)
- [Override the default npm registry for bun install](https://bun.sh/guides/install/custom-registry.md)
- [Using bun install with an Azure Artifacts npm registry](https://bun.sh/guides/install/azure-artifacts.md)
- [Using bun install with Artifactory](https://bun.sh/guides/install/jfrog-artifactory.md)

### Guides: Test runner

- [Bail early with the Bun test runner](https://bun.sh/guides/test/bail.md)
- [Generate code coverage reports with the Bun test runner](https://bun.sh/guides/test/coverage.md)
- [import, require, and test Svelte components with bun test](https://bun.sh/guides/test/svelte-test.md)
- [Mark a test as a "todo" with the Bun test runner](https://bun.sh/guides/test/todo-tests.md)
- [Migrate from Jest to Bun's test runner](https://bun.sh/guides/test/migrate-from-jest.md)
- [Mock functions in `bun test`](https://bun.sh/guides/test/mock-functions.md)
- [Re-run tests multiple times with the Bun test runner](https://bun.sh/guides/test/rerun-each.md)
- [Run tests in watch mode with Bun](https://bun.sh/guides/test/watch-mode.md)
- [Run your tests with the Bun test runner](https://bun.sh/guides/test/run-tests.md)
- [Set a code coverage threshold with the Bun test runner](https://bun.sh/guides/test/coverage-threshold.md)
- [Set a per-test timeout with the Bun test runner](https://bun.sh/guides/test/timeout.md)
- [Set the system time in Bun's test runner](https://bun.sh/guides/test/mock-clock.md)
- [Skip tests with the Bun test runner](https://bun.sh/guides/test/skip-tests.md)
- [Spy on methods in `bun test`](https://bun.sh/guides/test/spy-on.md)
- [Update snapshots in `bun test`](https://bun.sh/guides/test/update-snapshots.md)
- [Use snapshot testing in `bun test`](https://bun.sh/guides/test/snapshot.md)
- [Using Testing Library with Bun](https://bun.sh/guides/test/testing-library.md)
- [Write browser DOM tests with Bun and happy-dom](https://bun.sh/guides/test/happy-dom.md)

### Guides: Utilities

- [Check if the current file is the entrypoint](https://bun.sh/guides/util/entrypoint.md)
- [Check if two objects are deeply equal](https://bun.sh/guides/util/deep-equals.md)
- [Compress and decompress data with DEFLATE](https://bun.sh/guides/util/deflate.md)
- [Compress and decompress data with gzip](https://bun.sh/guides/util/gzip.md)
- [Convert a file URL to an absolute path](https://bun.sh/guides/util/file-url-to-path.md)
- [Convert an absolute path to a file URL](https://bun.sh/guides/util/path-to-file-url.md)
- [Detect when code is executed with Bun](https://bun.sh/guides/util/detect-bun.md)
- [Encode and decode base64 strings](https://bun.sh/guides/util/base64.md)
- [Escape an HTML string](https://bun.sh/guides/util/escape-html.md)
- [Generate a UUID](https://bun.sh/guides/util/javascript-uuid.md)
- [Get the absolute path of the current file](https://bun.sh/guides/util/import-meta-path.md)
- [Get the absolute path to the current entrypoint](https://bun.sh/guides/util/main.md)
- [Get the current Bun version](https://bun.sh/guides/util/version.md)
- [Get the directory of the current file](https://bun.sh/guides/util/import-meta-dir.md)
- [Get the file name of the current file](https://bun.sh/guides/util/import-meta-file.md)
- [Get the path to an executable bin file](https://bun.sh/guides/util/which-path-to-executable-bin.md)
- [Hash a password](https://bun.sh/guides/util/hash-a-password.md)
- [Sleep for a fixed number of milliseconds](https://bun.sh/guides/util/sleep.md)

### Guides: Reading files

- [Check if a file exists](https://bun.sh/guides/read-file/exists.md)
- [Get the MIME type of a file](https://bun.sh/guides/read-file/mime.md)
- [Read a file as a ReadableStream](https://bun.sh/guides/read-file/stream.md)
- [Read a file as a string](https://bun.sh/guides/read-file/string.md)
- [Read a file to a Buffer](https://bun.sh/guides/read-file/buffer.md)
- [Read a file to a Uint8Array](https://bun.sh/guides/read-file/uint8array.md)
- [Read a file to an ArrayBuffer](https://bun.sh/guides/read-file/arraybuffer.md)
- [Read a JSON file](https://bun.sh/guides/read-file/json.md)
- [Watch a directory for changes](https://bun.sh/guides/read-file/watch.md)

### Guides: HTMLRewriter

- [Extract links from a webpage using HTMLRewriter](https://bun.sh/guides/html-rewriter/extract-links.md)
- [Extract social share images and Open Graph tags](https://bun.sh/guides/html-rewriter/extract-social-meta.md)

### Guides: Streams

- [Convert a Node.js Readable to a Blob](https://bun.sh/guides/streams/node-readable-to-blob.md)
- [Convert a Node.js Readable to a string](https://bun.sh/guides/streams/node-readable-to-string.md)
- [Convert a Node.js Readable to an ArrayBuffer](https://bun.sh/guides/streams/node-readable-to-arraybuffer.md)
- [Convert a Node.js Readable to an Uint8Array](https://bun.sh/guides/streams/node-readable-to-uint8array.md)
- [Convert a Node.js Readable to JSON](https://bun.sh/guides/streams/node-readable-to-json.md)
- [Convert a ReadableStream to a Blob](https://bun.sh/guides/streams/to-blob.md)
- [Convert a ReadableStream to a Buffer](https://bun.sh/guides/streams/to-buffer.md)
- [Convert a ReadableStream to a string](https://bun.sh/guides/streams/to-string.md)
- [Convert a ReadableStream to a Uint8Array](https://bun.sh/guides/streams/to-typedarray.md)
- [Convert a ReadableStream to an array of chunks](https://bun.sh/guides/streams/to-array.md)
- [Convert a ReadableStream to an ArrayBuffer](https://bun.sh/guides/streams/to-arraybuffer.md)
- [Convert a ReadableStream to JSON](https://bun.sh/guides/streams/to-json.md)

### Guides: Runtime

- [Codesign a single-file JavaScript executable on macOS](https://bun.sh/guides/runtime/codesign-macos-executable.md):
  Fix the "can't be opened because it is from an unidentified developer" Gatekeeper warning when
  running your JavaScript executable.
- [Debugging Bun with the VS Code extension](https://bun.sh/guides/runtime/vscode-debugger.md)
- [Debugging Bun with the web debugger](https://bun.sh/guides/runtime/web-debugger.md)
- [Define and replace static globals & constants](https://bun.sh/guides/runtime/define-constant.md)
- [Delete directories](https://bun.sh/guides/runtime/delete-directory.md)
- [Delete files](https://bun.sh/guides/runtime/delete-file.md)
- [Import a HTML file as text](https://bun.sh/guides/runtime/import-html.md)
- [Import a JSON file](https://bun.sh/guides/runtime/import-json.md)
- [Import a TOML file](https://bun.sh/guides/runtime/import-toml.md)
- [Inspect memory usage using V8 heap snapshots](https://bun.sh/guides/runtime/heap-snapshot.md)
- [Install and run Bun in GitHub Actions](https://bun.sh/guides/runtime/cicd.md)
- [Install TypeScript declarations for Bun](https://bun.sh/guides/runtime/typescript.md)
- [Re-map import paths](https://bun.sh/guides/runtime/tsconfig-paths.md)
- [Read environment variables](https://bun.sh/guides/runtime/read-env.md)
- [Run a Shell Command](https://bun.sh/guides/runtime/shell.md)
- [Set a time zone in Bun](https://bun.sh/guides/runtime/timezone.md)
- [Set environment variables](https://bun.sh/guides/runtime/set-env.md)

### Guides: Writing files

- [Append content to a file](https://bun.sh/guides/write-file/append.md)
- [Copy a file to another location](https://bun.sh/guides/write-file/file-cp.md)
- [Delete a file](https://bun.sh/guides/write-file/unlink.md)
- [Write a Blob to a file](https://bun.sh/guides/write-file/blob.md)
- [Write a file incrementally](https://bun.sh/guides/write-file/filesink.md)
- [Write a file to stdout](https://bun.sh/guides/write-file/cat.md)
- [Write a ReadableStream to a file](https://bun.sh/guides/write-file/stream.md)
- [Write a Response to a file](https://bun.sh/guides/write-file/response.md)
- [Write a string to a file](https://bun.sh/guides/write-file/basic.md)
- [Write to stdout](https://bun.sh/guides/write-file/stdout.md)

### Guides: HTTP

- [Common HTTP server usage](https://bun.sh/guides/http/server.md)
- [Configure TLS on an HTTP server](https://bun.sh/guides/http/tls.md)
- [fetch with unix domain sockets in Bun](https://bun.sh/guides/http/fetch-unix.md)
- [Hot reload an HTTP server](https://bun.sh/guides/http/hot.md)
- [Proxy HTTP requests using fetch()](https://bun.sh/guides/http/proxy.md)
- [Send an HTTP request using fetch](https://bun.sh/guides/http/fetch.md)
- [Start a cluster of HTTP servers](https://bun.sh/guides/http/cluster.md): Run multiple HTTP
  servers concurrently via the "reusePort" option to share the same port across multiple processes
- [Stream a file as an HTTP Response](https://bun.sh/guides/http/stream-file.md)
- [Streaming HTTP Server with Async Iterators](https://bun.sh/guides/http/stream-iterator.md)
- [Streaming HTTP Server with Node.js Streams](https://bun.sh/guides/http/stream-node-streams-in-bun.md)
- [Upload files via HTTP using FormData](https://bun.sh/guides/http/file-uploads.md)
- [Write a simple HTTP server](https://bun.sh/guides/http/simple.md)

### Guides: Binary data

- [Convert a Blob to a DataView](https://bun.sh/guides/binary/blob-to-dataview.md)
- [Convert a Blob to a ReadableStream](https://bun.sh/guides/binary/blob-to-stream.md)
- [Convert a Blob to a string](https://bun.sh/guides/binary/blob-to-string.md)
- [Convert a Blob to a Uint8Array](https://bun.sh/guides/binary/blob-to-typedarray.md)
- [Convert a Blob to an ArrayBuffer](https://bun.sh/guides/binary/blob-to-arraybuffer.md)
- [Convert a Buffer to a blob](https://bun.sh/guides/binary/buffer-to-blob.md)
- [Convert a Buffer to a ReadableStream](https://bun.sh/guides/binary/buffer-to-readablestream.md)
- [Convert a Buffer to a string](https://bun.sh/guides/binary/buffer-to-string.md)
- [Convert a Buffer to a Uint8Array](https://bun.sh/guides/binary/buffer-to-typedarray.md)
- [Convert a Buffer to an ArrayBuffer](https://bun.sh/guides/binary/buffer-to-arraybuffer.md)
- [Convert a DataView to a string](https://bun.sh/guides/binary/dataview-to-string.md)
- [Convert a Uint8Array to a Blob](https://bun.sh/guides/binary/typedarray-to-blob.md)
- [Convert a Uint8Array to a Buffer](https://bun.sh/guides/binary/typedarray-to-buffer.md)
- [Convert a Uint8Array to a DataView](https://bun.sh/guides/binary/typedarray-to-dataview.md)
- [Convert a Uint8Array to a ReadableStream](https://bun.sh/guides/binary/typedarray-to-readablestream.md)
- [Convert a Uint8Array to a string](https://bun.sh/guides/binary/typedarray-to-string.md)
- [Convert a Uint8Array to an ArrayBuffer](https://bun.sh/guides/binary/typedarray-to-arraybuffer.md)
- [Convert an ArrayBuffer to a Blob](https://bun.sh/guides/binary/arraybuffer-to-blob.md)
- [Convert an ArrayBuffer to a Buffer](https://bun.sh/guides/binary/arraybuffer-to-buffer.md)
- [Convert an ArrayBuffer to a string](https://bun.sh/guides/binary/arraybuffer-to-string.md)
- [Convert an ArrayBuffer to a Uint8Array](https://bun.sh/guides/binary/arraybuffer-to-typedarray.md)
- [Convert an ArrayBuffer to an array of numbers](https://bun.sh/guides/binary/arraybuffer-to-array.md)

### Guides: Processes

- [Get the process uptime in nanoseconds](https://bun.sh/guides/process/nanoseconds.md)
- [Listen for CTRL+C](https://bun.sh/guides/process/ctrl-c.md)
- [Listen to OS signals](https://bun.sh/guides/process/os-signals.md)
- [Parse command-line arguments](https://bun.sh/guides/process/argv.md)
- [Read from stdin](https://bun.sh/guides/process/stdin.md)
- [Read stderr from a child process](https://bun.sh/guides/process/spawn-stderr.md)
- [Read stdout from a child process](https://bun.sh/guides/process/spawn-stdout.md)
- [Spawn a child process](https://bun.sh/guides/process/spawn.md)
- [Spawn a child process and communicate using IPC](https://bun.sh/guides/process/ipc.md)
