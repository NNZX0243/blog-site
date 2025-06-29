document.addEventListener('DOMContentLoaded', () => {
	if (CONFIG.path) {
		let a = new LocalSearch({
				path: CONFIG.path,
				top_n_per_article: CONFIG.localsearch.top_n_per_article,
				unescape: CONFIG.localsearch.unescape,
			}),
			s = document.querySelector('.search-input'),
			r = document.querySelector('.search-result-container')
		var e = () => {
			if (a.isfetched) {
				var t = s.value.trim().toLowerCase(),
					c = t.split(/[-\s]+/)
				let e = []
				0 < t.length && (e = a.getResultItems(c)),
					1 === c.length && '' === c[0]
						? (r.innerHTML =
								'<div class="search-result-icon"><i class="fa fa-search fa-5x"></i></div>')
						: 0 === e.length
						? (r.innerHTML =
								'<div class="search-result-icon"><i class="far fa-frown fa-5x"></i></div>')
						: (e.sort((e, t) =>
								e.includedCount !== t.includedCount
									? t.includedCount - e.includedCount
									: e.hitCount !== t.hitCount
									? t.hitCount - e.hitCount
									: t.id - e.id
						  ),
						  (t = CONFIG.i18n.hits.replace('${hits}', e.length)),
						  (r.innerHTML = `<div class="search-stats">${t}</div>
        <hr>
        <ul class="search-result-list">${e.map((e) => e.item).join('')}</ul>`),
						  'object' == typeof pjax && pjax.refresh(r))
			}
		}
		a.highlightSearchWords(document.querySelector('.post-body')),
			CONFIG.localsearch.preload && a.fetchData(),
			s.addEventListener('input', e),
			window.addEventListener('search:loaded', e),
			document.querySelectorAll('.popup-trigger').forEach((e) => {
				e.addEventListener('click', () => {
					document.body.classList.add('search-active'),
						setTimeout(() => s.focus(), 500),
						a.isfetched || a.fetchData()
				})
			})
		let t = () => {
			document.body.classList.remove('search-active')
		}
		document
			.querySelector('.search-pop-overlay')
			.addEventListener('click', (e) => {
				e.target === document.querySelector('.search-pop-overlay') &&
					t()
			}),
			document
				.querySelector('.popup-btn-close')
				.addEventListener('click', t),
			document.addEventListener('pjax:success', () => {
				a.highlightSearchWords(document.querySelector('.post-body')),
					t()
			}),
			window.addEventListener('keydown', (e) => {
				;(e.ctrlKey || e.metaKey) &&
					'k' === e.key &&
					(e.preventDefault(),
					document.body.classList.add('search-active'),
					setTimeout(() => s.focus(), 500),
					a.isfetched || a.fetchData())
			}),
			window.addEventListener('keyup', (e) => {
				'Escape' === e.key && t()
			})
	} else console.warn('`hexo-generator-searchdb` plugin is not installed!')
})
