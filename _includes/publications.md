<h2 id="publications" style="margin: 16px 0px 14px;">Publications</h2>

{% assign sections = site.data.publications %}

{% if sections.accepted %}
<h3 class="pub-section-title">Accepted Papers</h3>
<div class="publications">
<ol class="bibliography">
{% for link in sections.accepted %}
  <li>
  <div class="pub-row">
    <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
      {% if link.image %}
      <img src="{{ link.image }}" class="teaser img-fluid z-depth-1">
      {% if link.conference_short %}
      <abbr class="badge">{{ link.conference_short }}</abbr>
      {% endif %}
      {% endif %}
    </div>
    <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
        <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
        <div class="author">{{ link.authors }}</div>
        <div class="periodical"><em>{{ link.conference }}</em>{% if link.notes %} <span class="oral-note">{{ link.notes }}</span>{% endif %}</div>
        {% assign has_links = link.pdf or link.code or link.video or link.slides or link.poster or link.demo %}
        {% if has_links %}
        <div class="links">
          {% if link.pdf %}
          <a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">PDF</a>
          {% endif %}
          {% if link.code %}
          <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Code</a>
          {% endif %}
          {% if link.video %}
          <a href="{{ link.video }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Video</a>
          {% endif %}
          {% if link.slides %}
          <a href="{{ link.slides }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Slides</a>
          {% endif %}
          {% if link.poster %}
          <a href="{{ link.poster }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Poster</a>
          {% endif %}
          {% if link.demo %}
          <a href="{{ link.demo }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Demo</a>
          {% endif %}
        </div>
        {% endif %}
    </div>
  </div>
  </li>
  <br>
{% endfor %}
</ol>
</div>
{% endif %}

{% if sections.working %}
<h3 class="pub-section-title">Working Papers</h3>
<div class="publications">
<ol class="bibliography">
{% for link in sections.working %}
  <li>
  <div class="pub-row">
    <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
      {% if link.image %}
      <img src="{{ link.image }}" class="teaser img-fluid z-depth-1">
      {% if link.conference_short %}
      <abbr class="badge">{{ link.conference_short }}</abbr>
      {% endif %}
      {% endif %}
    </div>
    <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
        <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
        <div class="author">{{ link.authors }}</div>
        <div class="periodical"><em>{{ link.conference }}</em>{% if link.notes %} <span class="oral-note">{{ link.notes }}</span>{% endif %}</div>
        {% assign has_links = link.pdf or link.code or link.video or link.slides or link.poster or link.demo %}
        {% if has_links %}
        <div class="links">
          {% if link.pdf %}
          <a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">PDF</a>
          {% endif %}
          {% if link.code %}
          <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Code</a>
          {% endif %}
          {% if link.video %}
          <a href="{{ link.video }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Video</a>
          {% endif %}
          {% if link.slides %}
          <a href="{{ link.slides }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Slides</a>
          {% endif %}
          {% if link.poster %}
          <a href="{{ link.poster }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Poster</a>
          {% endif %}
          {% if link.demo %}
          <a href="{{ link.demo }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">Demo</a>
          {% endif %}
        </div>
        {% endif %}
    </div>
  </div>
  </li>
  <br>
{% endfor %}
</ol>
</div>
{% endif %}
