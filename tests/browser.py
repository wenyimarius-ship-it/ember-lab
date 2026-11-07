"""Lab checks only; external targets are inspected, not treated as live responses."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LAB_TEST_URL', 'http://127.0.0.1:4173').rstrip('/')
OUT = Path(os.environ.get('LAB_TEST_OUTPUT', '/tmp/ember-lab-directory-checks'))
OUT.mkdir(parents=True, exist_ok=True)
TARGETS = {
    'cinema-experiment': 'https://ember-film-experiment.vercel.app',
    'city-observation': 'https://ember-city-observer.vercel.app',
    'idea-puzzle': 'https://ember-idea-puzzle.vercel.app',
    'culturebridge': 'https://culturebridge-dwbxqchgzdremscutzk5eh.streamlit.app/',
}
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    results = []
    for width in [320, 390, 700, 1440]:
        page = browser.new_page(viewport={'width': width, 'height': 844}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        assert page.goto(BASE).status == 200
        cards = page.locator('.directory-card')
        assert cards.count() == 4
        assert cards.evaluate_all('(cards)=>cards.map(c=>c.dataset.projectId)') == list(TARGETS)
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        for card in cards.all():
            assert card.get_attribute('href') == TARGETS[card.get_attribute('data-project-id')]
            assert card.get_attribute('target') is None
            assert card.locator('h3').count() == 1
            assert card.locator('p').count() == 1
            assert card.locator('a,button').count() == 0
            assert card.bounding_box()['height'] >= 100
        first = cards.first.bounding_box()
        assert first['y'] + first['height'] < 844
        second = cards.nth(1).bounding_box()
        assert second['y'] + second['height'] < 844
        assert page.locator('a[href^="#"]').count() == 1  # only the skip link
        page.screenshot(path=str(OUT / f'directory-{width}.png'), full_page=True)
        page.screenshot(path=str(OUT / f'first-screen-{width}.png'))
        page.keyboard.press('Tab')
        assert page.locator('.skip-link').evaluate('(el)=>el===document.activeElement')
        page.keyboard.press('Enter')
        assert page.locator('#main').evaluate('(el)=>el===document.activeElement')
        page.locator('#language').click()
        assert page.locator('html').get_attribute('lang') == 'en'
        assert 'Answer three' in cards.first.inner_text()
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        page.screenshot(path=str(OUT / f'directory-en-{width}.png'), full_page=True)
        page.reload()
        assert page.locator('html').get_attribute('lang') == 'en'
        page.locator('.lab-navigation a[href="/about/?lang=en"]').click()
        page.wait_for_url(BASE + '/about/?lang=en')
        assert page.locator('html').get_attribute('lang') == 'en'
        page.locator('.notes-heading a[href="/?lang=en"]').click()
        page.wait_for_url(BASE + '/?lang=en')
        assert page.locator('html').get_attribute('lang') == 'en'
        page.locator('#language').click()
        page.locator('#index-open').click()
        assert page.locator('#site-index').is_visible()
        for _ in range(20):
            page.keyboard.press('Tab')
            assert page.evaluate('document.querySelector("#site-index").contains(document.activeElement)')
        page.keyboard.press('Escape')
        assert not page.locator('#site-index').is_visible()
        assert page.locator('#index-open').evaluate('(el)=>el===document.activeElement')
        page.locator('.lab-navigation a[href="/about/"]').click()
        page.wait_for_url(BASE + '/about/')
        assert page.locator('.experiment-card').count() == 4
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        page.locator('[data-filter="live"]').click()
        assert page.locator('.experiment-card:visible').count() == 3
        page.locator('.notes-heading a[href="/"]').click()
        page.wait_for_url(BASE + '/')
        assert cards.count() == 4
        assert cards.first.bounding_box()['y'] < 400
        assert not errors, errors
        results.append({'width': width, 'directory': 'passed', 'first_two_entries_above_fold': True, 'languages': 'passed', 'keyboard_index': 'passed', 'notes_roundtrip': 'passed', 'js_errors': errors})
        page.close()
    context = browser.new_context(java_script_enabled=False, viewport={'width': 320, 'height': 740})
    page = context.new_page()
    page.goto(BASE)
    assert page.locator('.directory-card:visible').count() == 4
    assert not page.locator('#language').is_visible()
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
    context.close()
    browser.close()
    report = {'scope': 'Local Lab build; external destinations not loaded', 'viewports': results, 'without_javascript': 'passed'}
    (OUT / 'results.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
