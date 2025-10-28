declare module "react" {
  export = React;
  namespace React {}
}

declare module "react-dom" {
  export = ReactDOM;
  namespace ReactDOM {}
}

// Ensure vite client types are available enough for our usage
/// <reference types="vite/client" />
declare const import_meta_env: {
  VITE_API_BASE_URL?: string;
};
