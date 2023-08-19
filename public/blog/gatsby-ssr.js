// gatsby-ssr.js
import React from "react";
import HTML from "./src/html";

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes, setBodyAttributes }, pluginOptions) => {
  // Extract title and description from the page context, if available
  const { title, desc } = pluginOptions;

  setHtmlAttributes({ lang: "en" });
  setBodyAttributes({});
  setHeadComponents([
    <HTML key="html-component" title={title} desc={desc} />
  ]);
};
