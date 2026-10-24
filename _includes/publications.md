<h2 id="publications">Publications</h2>
<p class="pub-note">* Equal contribution &nbsp; <sup>†</sup> Corresponding author</p>

{% assign papers = site.data.publications %}
{% assign featured_papers = papers.working | where: 'show_on_homepage', true %}
{% assign all_papers = featured_papers | concat: papers.accepted %}
{% if all_papers.size > 0 %}
<div class="publication-list" data-publication-list data-preview-count="4">
  <div class="publication-toolbar">
    <div class="publication-toolbar-heading">
      <h3>Papers <span class="publication-count">{{ all_papers.size }}</span></h3>
      <p class="publication-summary" data-publication-summary hidden></p>
    </div>
    <label class="publication-filter">Venue
      <select data-publication-venue aria-label="Filter papers by venue">
        <option value="all">All venues</option>
        <option value="preprint">Preprint</option>
        <option value="icml">ICML</option>
        <option value="acl">ACL</option>
        <option value="wsdm">WSDM</option>
        <option value="icpr">ICPR</option>
        <option value="sigir">SIGIR series</option>
        <option value="aaai">AAAI series</option>
        <option value="bigdata">BigData</option>
        <option value="jcdl">JCDL</option>
        <option value="embc">EMBC</option>
        <option value="qss">QSS</option>
      </select>
    </label>
  </div>
  <div class="publications">
    <ol class="bibliography" id="publication-papers">
      {% for paper in all_papers %}
      {% include publication-item.html paper=paper %}
      {% endfor %}
    </ol>
  </div>
  <button class="publications-more" type="button" data-publications-more aria-controls="publication-papers" aria-expanded="false">Show all {{ all_papers.size }} papers</button>
  <p class="publication-list-status sr-only" role="status" aria-live="polite" data-publications-status></p>
</div>
{% endif %}
