const markdownIt = require("markdown-it");
const features = require("./features.json");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const md = markdownIt({ html: true });

module.exports = function(eleventyConfig) {
  // Filters
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) {
      return "";
    }

    return md.render(content);
  });

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/audio");
  eleventyConfig.addPassthroughCopy("src/fonts");

  if (features.blog) {
    const blogPlugin = require("./feature-packs/blog/plugin.js");
    blogPlugin(eleventyConfig);
  }

  if (features.faqs) {
    const faqsPlugin = require("./feature-packs/faqs/plugin.js");
    faqsPlugin(eleventyConfig);
  }

  if (features.portfolio) {
    const portfolioPlugin = require("./feature-packs/portfolio/plugin.js");
    portfolioPlugin(eleventyConfig);
  }

  if (features.team) {
    const teamPlugin = require("./feature-packs/team/plugin.js");
    teamPlugin(eleventyConfig);
  }

  // Use .eleventyignore, not .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Directory structure
  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
