"""Read-only source-snapshot navigation audit, NOT a Production availability test.

Set LAB_AUDIT_SOURCES to a directory containing cinema/, city/, puzzle/ checkouts.
Build puzzle with its pinned npm ci + npm run build first. No source is rewritten.
The browser loads actual HTML/JS/CSS from these snapshots under the configured
production origins, while Lab responses come from the current local dev server.
"""
import json
import mimetypes
import os
from pathlib import Path
import subprocess
from urllib.parse import urlsplit
from urllib.request import urlopen
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LAB_TEST_URL', 'http://127.0.0.1:4174').rstrip('/')
ROOT = Path(os.environ.get('LAB_AUDIT_SOURCES', '/tmp/ember-nav-audit')).resolve()
OUT = Path(os.environ.get('LAB_TEST_OUTPUT', '/tmp/ember-lab-directory-checks'))
OUT.mkdir(parents=True, exist_ok=True)
LAB = 'https://lab.mariustang.com/'
MOUNTS = {
    'ember-film-experiment.vercel.app': ROOT / 'cinema',
    'ember-city-observer.vercel.app': ROOT / 'city',
    'ember-idea-puzzle.vercel.app': ROOT / 'puzzle' / 'dist',
}

def source_response(route):
    parsed = urlsplit(route.request.url)
    if parsed.hostname == 'lab.mariustang.com':
        with urlopen(BASE + parsed.path + ('?' + parsed.query if parsed.query else '')) as response:
            route.fulfill(status=response.status, body=response.read(), content_type=response.headers.get('Content-Type'))
        return
    root = MOUNTS.get(parsed.hostname)
    if not root:
        route.abort()
        return
    path = (root / parsed.path.lstrip('/')).resolve()
    if path.is_dir(): path = path / 'index.html'
    if not path.is_relative_to(root) or not path.is_file():
        route.fulfill(status=404, body='Missing source-snapshot asset')
        return
    route.fulfill(status=200, body=path.read_bytes(), content_type=mimetypes.guess_type(path.name)[0] or 'application/octet-stream')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    checks = []
    for width in [390, 1440]:
        context = browser.new_context(viewport={'width': width, 'height': 844}, is_mobile=width == 390, has_touch=width == 390)
        context.route('**/*', source_response)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(LAB)
        steps = []
        for project, hostname, selector in [
            ('cinema-experiment', 'ember-film-experiment.vercel.app', '#lab-link'),
            ('city-observation', 'ember-city-observer.vercel.app', 'header a'),
        ]:
            page.locator(f'.directory-card[data-project-id="{project}"]').click()
            page.wait_for_url(f'https://{hostname}/')
            page.locator(selector).wait_for(state='visible')
            page.screenshot(path=str(OUT / f'{project}-source-{width}.png'))
            assert page.locator(selector).get_attribute('href').rstrip('/') == LAB.rstrip('/')
            page.locator(selector).click()
            page.wait_for_url(LAB)
            assert page.locator('.directory-card').count() == 4
            assert page.locator('.directory-card').first.bounding_box()['y'] < 400
            steps.append(f'directory → {project} → in-app return → directory')
        page.locator('.directory-card[data-project-id="idea-puzzle"]').click()
        page.wait_for_url('https://ember-idea-puzzle.vercel.app/')
        page.locator('#board').wait_for(state='visible')
        assert page.locator('a[href*="lab.mariustang.com"]').count() == 0
        page.screenshot(path=str(OUT / f'idea-puzzle-source-{width}.png'))
        page.go_back()
        page.wait_for_url(LAB)
        assert page.locator('.directory-card').first.bounding_box()['y'] < 400
        page.locator('.directory-card[data-project-id="cinema-experiment"]').click()
        page.wait_for_url('https://ember-film-experiment.vercel.app/')
        page.locator('#lab-link').wait_for(state='visible')
        steps.append('directory → idea-puzzle → browser Back → directory → cinema-experiment')
        # Deeper City pages have an indirect route, not a direct Lab link.
        page.goto('https://ember-city-observer.vercel.app/desk.html')
        page.locator('header a').click()
        page.wait_for_url('https://ember-city-observer.vercel.app/record.html')
        page.locator('header a').click()
        page.wait_for_url('https://ember-city-observer.vercel.app/')
        page.locator('header a').click()
        page.wait_for_url(LAB)
        steps.append('city desk → record → city home → Lab directory (indirect return)')
        assert not errors, errors
        checks.append({'width': width, 'mode': 'actual read-only source snapshots; responses served locally', 'paths': steps, 'js_errors': errors})
        context.close()
    browser.close()
    revisions = {name: subprocess.check_output(['git','-C',str(ROOT / name),'rev-parse','HEAD'],text=True).strip() for name in ['cinema','city','puzzle']}
    result = {'production_test': False, 'reason': 'Environment proxy denies live origins with CONNECT 403', 'source_revisions': revisions, 'checks': checks, 'culturebridge': 'Live Streamlit server unavailable; no local server or synthetic stand-in used'}
    (OUT / 'source-navigation.json').write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))
