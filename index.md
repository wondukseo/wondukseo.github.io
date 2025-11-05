---
layout: homepage
---

## About Me

Hi! I’m Wonduk Seo, an AI Research Scientist at <a class="about-link" href="https://www.enhans.ai/" target="_blank">Enhans AI</a> since January 2025 and a 2025 graduate of Peking University (Bachelor in Information Management, Big Data Management &amp; Application). Previously, I was advised by <a class="about-link" href="https://scholar.google.com/citations?user=bSUm6ikAAAAJ&amp;hl=en" target="_blank">Prof. Yi Bu</a> at Peking University. I’m passionate about building scalable, transparent, and interpretable methods that keep LLMs grounded in human values, sustain behavioral consistency, and mitigate hallucinations in real-world deployments.

## Research Interests

- **Socially Responsible and Interpretable AI:** Advancing interpretability and accuracy in large language models (LLMs) to ensure their use is consistent with social benefit, ethical standards, and real-world needs.
- **Human Alignment and Interpretability:** Developing interpretability and feedback frameworks that combine retrieval-augmented reasoning, transparent evaluation, and human-in-the-loop refinement to align LLM behavior with subtle and context-dependent human expectations.
- **Multi-Agent Reasoning and Interaction:** Developing collaborative agent architectures that support reasoning, prompt optimization, and hallucination-reduction while enabling interpretable decision-making in large-scale AI systems.
- **Query Reformulation and Understanding:** Designing adaptive query reformulation and expansion pipelines that capture nuanced user intent and orchestrate multiple retrieval strategies, yielding more precise, transparent access to information in real-world systems.

## News

<div class="news-scroll">
<ul>
  <li><strong>[Nov. 2025]</strong> One <strong>co-first author</strong> paper got accepted to <strong>ACM/IEEE Joint Conference on Digital Libraries (JCDL)</strong>.</li>
  <li><strong>[Oct. 2025]</strong> One <strong>co-first author</strong> paper got accepted to <strong>IEEE International Conference on Big Data 2025 Industry Track</strong> for Oral Presentation 🇲🇴.</li>
  <li><strong>[Jul. 2025]</strong> One <strong>first author</strong> paper got accepted to <strong>AAAI/ACM Conference on AI, Ethics, and Society (AIES) Main Track</strong> 🇪🇸.</li>
  <li><strong>[Jul. 2025]</strong> <mark><strong>Graduated from Peking University</strong></mark> (Bachelor in Information Management, Big Data Management &amp; Application) 🎉!</li>
  <li><strong>[Jun. 2025]</strong> One <strong>first author</strong> paper accepted for Oral Presentation at the <strong>ACM SIGKDD 2025 Workshop on AI Agent for Information Retrieval</strong> 🇨🇦.</li>
  <li><strong>[Apr. 2025]</strong> One <strong>co-first author</strong> paper got accepted to <strong>IEEE Engineering in Medicine and Biology Society (EMBC)</strong> for Oral Presentation 🇩🇰.</li>
  <li><strong>[Apr. 2025]</strong> Gave a poster talk at the <strong>International Conference on Research in Computational Molecular Biology (RECOMB)</strong> 🇰🇷.</li>
  <li><strong>[Feb. 2025]</strong> One <strong>first author</strong> paper accepted by <strong>Quantitative Science Studies (QSS)</strong>.</li>
  <li><strong>[Jan. 2025]</strong> Concluded my role as an LLM researcher at <a class="about-link" href="https://www.baidu.com/" target="_blank">Baidu Inc.</a>.</li>
  <li><strong>[Jan. 2025]</strong> Rejoined <a class="about-link" href="https://www.enhans.ai/" target="_blank">Enhans AI</a> as an AI Research Scientist.</li>
  <li><strong>[Nov. 2024]</strong> Ranked 9th in the ACM'24 FinanceRAG Challenge as Team Leader.</li>
  <li><strong>[May. 2024]</strong> 🥉 Earned a bronze medal in Kaggle’s Enefit Predict Energy Behavior of Prosumers (Solo).</li>
  <li><strong>[Apr. 2024]</strong> 🥉 Earned a bronze medal in Kaggle’s Harvard Medical School Brain Activity Classification (Team Leader).</li>
  <li><strong>[Feb. 2024]</strong> Wrapped up my role as a Machine Learning Engineer at <a class="about-link" href="https://www.enhans.ai/" target="_blank">Enhans AI</a> to pursue research-focused opportunities.</li>
  <li><strong>[Dec. 2023]</strong> 🥈 Earned a silver medal in Kaggle’s CAFA 5 Protein Function Prediction (Solo).</li>
  <li><strong>[Oct. 2023]</strong> 🥉 Earned a bronze medal in Kaggle’s LLM Science Exam (Team).</li>
  <li><strong>[Aug. 2023]</strong> Completed my Data Scientist internship at <a class="about-link" href="https://www.lgchem.com/main/index" target="_blank">LG Chem</a>.</li>
  <li><strong>[Apr. 2023]</strong> Completed a Data Scientist internship at <a class="about-link" href="https://www.linkedin.com/company/betabrainco/" target="_blank">BetaBrain</a>.</li>
  <li><strong>[Apr. 2022]</strong> Began a long-term collaboration with <a class="about-link" href="https://scholar.google.com/citations?user=bSUm6ikAAAAJ&hl=en" target="_blank">Prof. Yi Bu</a>.</li>
  <li><strong>[Dec. 2020]</strong> Began my AI journey, diving into machine learning research and engineering.</li>
</ul>
</div>

{% include_relative _includes/publications.md %}

{% include_relative _includes/services.md %}

## Visitors

{% assign clustrmaps_base_color = site.clustrmaps_color | default: "ffffff" %}
{% assign clustrmaps_width = site.clustrmaps_width | default: 600 %}
{% assign clustrmaps_url = site.clustrmaps_url | default: site.url %}
{% if site.baseurl and site.baseurl != "" %}
  {% assign clustrmaps_url = clustrmaps_url | append: site.baseurl %}
{% endif %}
{% assign clustrmaps_link = nil %}
{% if site.clustrmaps_site_id %}
  {% capture clustrmaps_link %}
https://clustrmaps.com/site/{{ site.clustrmaps_site_id }}
  {% endcapture %}
{% elsif clustrmaps_url %}
  {% capture clustrmaps_link %}
https://clustrmaps.com/counter/maps.php?url={{ clustrmaps_url | uri_escape }}
  {% endcapture %}
{% endif %}
{% assign clustrmaps_img = nil %}
{% if site.clustrmaps_map_hash %}
  {% capture clustrmaps_img %}
//clustrmaps.com/map_v2.png?d={{ site.clustrmaps_map_hash }}&cl={{ clustrmaps_base_color }}&w={{ clustrmaps_width }}
  {% endcapture %}
{% elsif clustrmaps_url %}
  {% capture clustrmaps_img %}
//clustrmaps.com/map_v2.png?url={{ clustrmaps_url | uri_escape }}&cl={{ clustrmaps_base_color }}&w={{ clustrmaps_width }}
  {% endcapture %}
{% endif %}
{% if clustrmaps_img %}
<div class="clustrmaps-container">
  <div class="clustrmaps-wrapper">
    {% if clustrmaps_link %}
    <a href="{{ clustrmaps_link | strip }}" target="_blank" rel="noopener">
      <img src="{{ clustrmaps_img | strip }}" alt="ClustrMaps visitor overview" loading="lazy">
    </a>
    {% else %}
      <img src="{{ clustrmaps_img | strip }}" alt="ClustrMaps visitor overview" loading="lazy">
    {% endif %}
  </div>
</div>
<p class="map-note">Visitors are tracked via <a class="about-link" href="https://clustrmaps.com/" target="_blank" rel="noopener">ClustrMaps</a>. Update <code>clustrmaps_map_hash</code>, <code>clustrmaps_site_id</code>, or <code>clustrmaps_url</code> in <code>_config.yml</code> with the values from your ClustrMaps dashboard.</p>
{% else %}
<div class="clustrmaps-placeholder">
  <p>Provide your ClustrMaps embed settings (<code>clustrmaps_map_hash</code> or <code>clustrmaps_url</code>) in <code>_config.yml</code> to activate the visitor map.</p>
</div>
{% endif %}
