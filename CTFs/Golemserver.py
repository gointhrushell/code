import os

from flask import (
	Flask, 
	render_template,
	request,
	url_for,
	redirect,
	session,
	render_template_string
)
from flask.ext.session import Session

app = Flask(__name__)


execfile(&#39;flag.py&#39;)
execfile(&#39;key.py&#39;)

FLAG = flag
app.secret_key = key

@app.route(&#34;/golem&#34;, methods=[&#34;GET&#34;, &#34;POST&#34;])
def golem():
	if request.method != &#34;POST&#34;:
		return redirect(url_for(&#34;index&#34;))

	golem = request.form.get(&#34;golem&#34;) or None

	if golem is not None:
		golem = golem.replace(&#34;.&#34;, &#34;&#34;).replace(&#34;_&#34;, &#34;&#34;).replace(&#34;{&#34;,&#34;&#34;).replace(&#34;}&#34;,&#34;&#34;)
	
	if &#34;golem&#34; not in session or session[&#39;golem&#39;] is None:
		session[&#39;golem&#39;] = golem

	template = None

	if session[&#39;golem&#39;] is not None:
		template = &#39;&#39;&#39;{%% extends &#34;layout.html&#34; %%}
		{%% block body %%}
		&lt;h1&gt;Golem Name&lt;/h1&gt;
		&lt;div class=&#34;row&gt;
		&lt;div class=&#34;col-md-6 col-md-offset-3 center&#34;&gt;
		Hello : %s, why you don&#39;t look at our &lt;a href=&#39;/article?name=article&#39;&gt;article&lt;/a&gt;?
		&lt;/div&gt;
		&lt;/div&gt;
		{%% endblock %%}
		&#39;&#39;&#39; % session[&#39;golem&#39;]

		print 

		session[&#39;golem&#39;] = None

	return render_template_string(template)

@app.route(&#34;/&#34;, methods=[&#34;GET&#34;])
def index():
	return render_template(&#34;main.html&#34;)

@app.route(&#39;/article&#39;, methods=[&#39;GET&#39;])
def article():

    error = 0

    if &#39;name&#39; in request.args:
        page = request.args.get(&#39;name&#39;)
    else:
        page = &#39;article&#39;

    if page.find(&#39;flag&#39;)&gt;=0:
    	page = &#39;notallowed.txt&#39;

    try:
        template = open(&#39;/home/golem/articles/{}&#39;.format(page)).read()
    except Exception as e:
        template = e

    return render_template(&#39;article.html&#39;, template=template)

if __name__ == &#34;__main__&#34;:
	app.run(host=&#39;0.0.0.0&#39;, debug=False)