---
layout: 'layouts/feed.html'
metaDesc: Begoña Pereda is a Mexico City–based producer and composer creating music for video games.
pagination:
  data: collections.blog
  size: 10
paginationPrevText: 'Newer'
paginationNextText: 'Older'
paginationAnchor: '#post-list'
permalink: 'blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
title: 'Journal'

lede: |
  <p>Use this section for articles, updates, case studies, or editorial content.</p>

---
