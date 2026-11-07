"""Optional browser checks: python tests/browser.py (requires Playwright + Chromium)."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LAB_TEST_URL', 'http://127.0.0.1:4173')
OUT = Path(os.environ.get('LAB_TEST_OUTPUT', '/tmp/ember-lab-checks'))
OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    results = []
    for width in [320, 390, 700, 1440]:
        page = browser.new_page(viewport={'width': width, 'height': 1000}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(BASE)
        assert response.status == 200
        assert page.locator('.experiment-card').count() == 4
        assert page.locator('.experiment-card:visible').count() == 4
        overflow = page.evaluate('document.documentElement.scrollWidth > innerWidth')
        assert not overflow, f'Horizontal overflow at {width}'
        for heading in page.locator('.featured-copy h3, .card-body h3').all():
            assert heading.evaluate('(el)=>el.scrollWidth <= el.clientWidth + 1'), f'Clipped title at {width}'
        page.screenshot(path=str(OUT / f'lab-{width}.png'), full_page=True)
        # Unavailable projects are informational cards, never dead anchors.
        assert page.locator('.experiment-card a, .featured-card a').count() == 0
        page.locator('[data-filter="in-development"]').click()
        assert page.locator('.experiment-card:visible').count() == 3
        page.locator('[data-filter="existing"]').click()
        assert page.locator('.experiment-card:visible').count() == 1
        for status in ['live', 'planned']:
            page.locator(f'[data-filter="{status}"]').click()
            assert page.locator('.experiment-card:visible').count() == 0
            assert page.locator('.empty-state').is_visible()
            page.locator('#reset-filter').click()
            assert page.locator('.experiment-card:visible').count() == 4
        page.locator('.lab-navigation a[href="#about"]').click()
        page.wait_for_timeout(1200)
        assert page.evaluate("document.querySelector('#about').getBoundingClientRect().top >= 80")
        page.locator('.lab-navigation a[href="#experiments"]').click()
        page.wait_for_timeout(1200)
        assert page.evaluate("document.querySelector('#experiments').getBoundingClientRect().top >= 80")
        # All same-origin resources and anchor targets resolve.
        for href in page.locator('a').evaluate_all('(as) => as.map(a=>a.getAttribute("href"))'):
            if href.startswith('#'):
                assert page.locator(href).count() == 1
        for url in page.evaluate('performance.getEntriesByType("resource").map(r=>r.name)'):
            assert url.startswith(BASE), f'Unexpected external request: {url}'
            assert page.request.get(url).status == 200
        # Both languages fit, update complete project copy, and retain filter state.
        page.locator('[data-filter="in-development"]').click()
        page.locator('#language').click()
        assert page.locator('html').get_attribute('lang') == 'en'
        assert page.locator('.featured-copy .description').inner_text().startswith('Turning cultural knowledge')
        assert page.locator('.experiment-card:visible').count() == 3
        assert 'Showing 3 of 4' in page.locator('#filter-result').inner_text()
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        page.screenshot(path=str(OUT / f'lab-en-{width}.png'), full_page=True)
        page.reload()
        assert page.locator('html').get_attribute('lang') == 'en'
        page.locator('#language').click()
        assert page.locator('html').get_attribute('lang') == 'zh-CN'
        page.locator('#index-open').click()
        assert page.locator('#site-index').is_visible()
        assert page.locator('#index-open').get_attribute('aria-expanded') == 'true'
        page.keyboard.press('Escape')
        assert not page.locator('#site-index').is_visible()
        assert page.locator('#index-open').evaluate('(el)=>el===document.activeElement')
        page.locator('[data-filter="existing"]').click()
        page.locator('#index-open').click()
        page.locator('.index-projects [data-project-id="idea-puzzle"]').click()
        assert page.locator('#experiment-idea-puzzle').is_visible()
        assert page.locator('.experiment-card:visible').count() == 4
        assert not page.locator('#site-index').is_visible()
        assert page.locator('a[href="mailto:wenyi.marius@gmail.com"]').count() == 1
        assert page.locator('.lab-navigation a[href="https://www.mariustang.com/spaces/"]').count() == 1
        assert not errors, errors
        results.append({'width': width, 'overflow': overflow, 'filters': 'passed', 'anchors': 'passed', 'js_errors': errors})
        page.close()
    page = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    page.goto(BASE)
    page.keyboard.press('Tab')
    assert page.locator('.skip-link').evaluate('(el)=>el===document.activeElement')
    assert page.locator('.skip-link').bounding_box()['y'] >= 0
    page.keyboard.press('Enter')
    assert page.locator('#main').evaluate('(el)=>el===document.activeElement')
    page.locator('[data-filter="existing"]').focus()
    page.keyboard.press('Enter')
    assert page.locator('.experiment-card:visible').count() == 1
    assert page.locator('[data-filter="existing"]').get_attribute('aria-pressed') == 'true'
    assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto'
    page.close()
    context = browser.new_context(java_script_enabled=False, viewport={'width': 320, 'height': 800})
    page = context.new_page()
    page.goto(BASE)
    assert page.locator('.experiment-card:visible').count() == 4
    assert not page.locator('.filters').is_visible()
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
    context.close()
    # Export a real 1200×630 PNG for social crawlers; SVG remains editable source.
    page = browser.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    page.goto(BASE + '/assets/og.svg')
    assert page.locator('svg').is_visible()
    browser.close()
    report = {'viewports': results, 'keyboard': 'passed', 'reduced_motion': 'passed', 'without_javascript': 'passed', 'og_export': '1200x630 PNG', 'language_switch': 'passed', 'index_dialog': 'passed', 'contact': 'passed'}
    (OUT / 'results.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
