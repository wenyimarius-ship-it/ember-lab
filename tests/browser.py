"""Local flow-home and project-notes checks; external targets are not loaded."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LAB_TEST_URL', 'http://127.0.0.1:4173').rstrip('/')
OUT = Path(os.environ.get('LAB_TEST_OUTPUT', '/tmp/ember-lab-directory-checks'))
OUT.mkdir(parents=True, exist_ok=True)
TARGETS = {
    'cinema-experiment': 'https://cinema.mariustang.com',
    'city-observation': 'https://city.mariustang.com',
    'idea-puzzle': 'https://puzzle.mariustang.com',
    'culturebridge': 'https://culturebridge-dwbxqchgzdremscutzk5eh.streamlit.app/',
}
def settled_arc(page):
    page.wait_for_function("""() => {
        const value=Number(document.querySelector('.thread').dataset.progress);
        const now=performance.now(), previous=window.__labArcCheck;
        if(!previous || Math.abs(previous.value-value)>.00001) {
            window.__labArcCheck={value,at:now};
            return false;
        }
        return now-previous.at>180;
    }""")
    return float(page.locator('.thread').get_attribute('data-progress'))

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    results = []
    for width in [320, 390, 700, 1440]:
        page = browser.new_page(viewport={'width': width, 'height': 844}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        assert page.goto(BASE).status == 200
        page.wait_for_function('document.querySelector(".thread").dataset.progress !== undefined')
        chapters = page.locator('.chapter')
        links = page.locator('.play[data-project-id]')
        assert chapters.count() == 4
        assert links.count() == 4
        assert links.evaluate_all('(links)=>links.map(link=>link.dataset.projectId)') == list(TARGETS)
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        for i, link in enumerate(links.all()):
            assert link.get_attribute('href') == TARGETS[link.get_attribute('data-project-id')]
            assert link.get_attribute('target') is None
            assert link.locator('a,button').count() == 0
            assert link.bounding_box()['height'] >= 44
            assert chapters.nth(i).locator('h2').count() == 1
            assert chapters.nth(i).locator('.one-line').count() == 1
            assert chapters.nth(i).locator('canvas').count() == 1
        first = links.first.bounding_box()
        assert first['y'] + first['height'] < 844
        assert page.locator('a[href^="#"]').evaluate_all('(links)=>links.every(link=>document.getElementById(link.getAttribute("href").slice(1)))')
        page.screenshot(path=str(OUT / f'flow-{width}.png'), full_page=True)
        page.screenshot(path=str(OUT / f'first-screen-{width}.png'))
        page.keyboard.press('Tab')
        assert page.locator('.skip-link').evaluate('(el)=>el===document.activeElement')
        page.keyboard.press('Enter')
        assert page.locator('#cinema').evaluate('(el)=>el===document.activeElement')
        page.locator('#language').click()
        assert page.locator('html').get_attribute('lang') == 'en'
        assert 'Answer three' in chapters.first.inner_text()
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        page.screenshot(path=str(OUT / f'flow-en-{width}.png'), full_page=True)
        page.reload()
        assert page.locator('html').get_attribute('lang') == 'en'
        page.locator('footer a[data-notes][href="/about/?lang=en"]').click()
        page.wait_for_url(BASE + '/about/?lang=en')
        assert page.locator('html').get_attribute('lang') == 'en'
        page.locator('.notes-heading a[href="/?lang=en"]').click()
        page.wait_for_url(BASE + '/?lang=en')
        assert page.locator('html').get_attribute('lang') == 'en'
        page.locator('#language').click()
        page.locator('#open-directory').click()
        assert page.locator('#directory').is_visible()
        assert page.locator('#directory [data-jump]').count() == 4
        for label in ['电影推荐', '城市路线', '想法拼图', '文化桥']:
            assert label in page.locator('#directory').inner_text()
        for _ in range(20):
            page.keyboard.press('Tab')
            assert page.evaluate('document.querySelector("#directory").contains(document.activeElement)')
        page.keyboard.press('Escape')
        assert not page.locator('#directory').is_visible()
        assert page.locator('#open-directory').evaluate('(el)=>el===document.activeElement')
        initial_arc = settled_arc(page)
        page.locator('.progress a[href="#city"]').click()
        page.wait_for_function('document.querySelector("#city").classList.contains("is-active")')
        page.wait_for_function('(initial)=>Number(document.querySelector(".thread").dataset.progress)>initial+.02', arg=initial_arc)
        city_arc = settled_arc(page)
        page.locator('.progress a[href="#cinema"]').click()
        page.wait_for_function('document.querySelector("#cinema").classList.contains("is-active")')
        assert settled_arc(page) < city_arc - .02
        page.locator('footer a[data-notes][href="/about/"]').click()
        page.wait_for_url(BASE + '/about/')
        assert page.locator('.experiment-card').count() == 4
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        page.locator('[data-filter="live"]').click()
        assert page.locator('.experiment-card:visible').count() == 3
        page.locator('.notes-heading a[href="/"]').click()
        page.wait_for_url(BASE + '/')
        assert chapters.count() == 4
        assert chapters.first.bounding_box()['y'] < 400
        assert not errors, errors
        results.append({'width': width, 'flow_home': 'passed', 'first_experience_above_fold': True, 'languages': 'passed', 'keyboard_directory': 'passed', 'scroll_arc_navigation': 'passed', 'notes_roundtrip': 'passed', 'js_errors': errors})
        page.close()
    context = browser.new_context(java_script_enabled=False, viewport={'width': 320, 'height': 740})
    page = context.new_page()
    page.goto(BASE)
    assert page.locator('.chapter:visible').count() == 4
    assert page.locator('.play[data-project-id]:visible').count() == 4
    for link in page.locator('.play[data-project-id]').all():
        assert link.get_attribute('href') == TARGETS[link.get_attribute('data-project-id')]
    assert not page.locator('#language').is_visible()
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
    context.close()
    context = browser.new_context(reduced_motion='reduce', viewport={'width': 390, 'height': 844})
    page = context.new_page()
    page.goto(BASE)
    page.wait_for_function('document.querySelector(".thread").dataset.progress !== undefined')
    assert page.locator('#motion').get_attribute('aria-pressed') == 'true'
    assert page.locator('body').evaluate('(el)=>el.classList.contains("paused")')
    assert page.locator('.play[data-project-id]').count() == 4
    context.close()
    browser.close()
    report = {'scope': 'Local Lab build; external destinations not loaded', 'viewports': results, 'without_javascript': 'passed', 'reduced_motion': 'passed'}
    (OUT / 'results.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
