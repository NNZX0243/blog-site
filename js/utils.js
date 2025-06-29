;(HTMLElement.prototype.wrap = function (e) {
	this.parentNode.insertBefore(e, this),
		this.parentNode.removeChild(this),
		e.appendChild(this)
}),
	(() => {
		var e = () =>
			document.dispatchEvent(new Event('page:loaded', { bubbles: !0 }))
		document.addEventListener('DOMContentLoaded', e),
			document.addEventListener('pjax:success', e)
	})(),
	(NexT.utils = {
		registerExtURL() {
			document.querySelectorAll('span.exturl').forEach((e) => {
				var t = document.createElement('a')
				;(t.href = decodeURIComponent(
					atob(e.dataset.url)
						.split('')
						.map(
							(e) =>
								'%' +
								('00' + e.charCodeAt(0).toString(16)).slice(-2)
						)
						.join('')
				)),
					(t.rel = 'noopener external nofollow noreferrer'),
					(t.target = '_blank'),
					(t.className = e.className),
					(t.title = e.title),
					(t.innerHTML = e.innerHTML),
					e.parentNode.replaceChild(t, e)
			})
		},
		registerCopyButton(e, n, i = '') {
			e.insertAdjacentHTML(
				'beforeend',
				'<div class="copy-btn"><i class="fa fa-copy fa-fw"></i></div>'
			)
			let r = e.querySelector('.copy-btn')
			r.addEventListener('click', () => {
				var e, t
				i ||
					((e = n.querySelector('.code') || n.querySelector('code')),
					(i = e.innerText)),
					navigator.clipboard
						? navigator.clipboard.writeText(i).then(
								() => {
									r.querySelector('i').className =
										'fa fa-check-circle fa-fw'
								},
								() => {
									r.querySelector('i').className =
										'fa fa-times-circle fa-fw'
								}
						  )
						: (((e = document.createElement('textarea')).style.top =
								window.scrollY + 'px'),
						  (e.style.position = 'absolute'),
						  (e.style.opacity = '0'),
						  (e.readOnly = !0),
						  (e.value = i),
						  document.body.append(e),
						  e.select(),
						  e.setSelectionRange(0, i.length),
						  (e.readOnly = !1),
						  (t = document.execCommand('copy')),
						  (r.querySelector('i').className = t
								? 'fa fa-check-circle fa-fw'
								: 'fa fa-times-circle fa-fw'),
						  e.blur(),
						  r.blur(),
						  document.body.removeChild(e))
			}),
				n.addEventListener('mouseleave', () => {
					setTimeout(() => {
						r.querySelector('i').className = 'fa fa-copy fa-fw'
					}, 300)
				})
		},
		registerCodeblock(e) {
			let r = !!e,
				t
			;(t = CONFIG.hljswrap
				? (r ? e : document).querySelectorAll('figure.highlight')
				: document.querySelectorAll('pre')).forEach((n) => {
				if (!n.querySelector('.mermaid')) {
					if (!r) {
						let e = n.querySelectorAll('.code .line span')
						;(e =
							0 === e.length
								? n.querySelectorAll('code.highlight span')
								: e).forEach((t) => {
							t.classList.forEach((e) => {
								t.classList.replace(e, 'hljs-' + e)
							})
						})
					}
					var i,
						e = parseInt(window.getComputedStyle(n).height, 10),
						e = CONFIG.fold.enable && e > CONFIG.fold.height
					if (e || CONFIG.copycode.enable) {
						let t
						if (CONFIG.hljswrap && 'mac' === CONFIG.copycode.style)
							t = n
						else {
							let e = n.querySelector('.code-container')
							e ||
								((i = n.querySelector('.table-container') || n),
								((e = document.createElement('div')).className =
									'code-container'),
								i.wrap(e),
								e.classList.add('notranslate')),
								(t = e)
						}
						e &&
							!t.classList.contains('unfold') &&
							(t.classList.add('highlight-fold'),
							t.insertAdjacentHTML(
								'beforeend',
								'<div class="fold-cover"></div><div class="expand-btn"><i class="fa fa-angle-down fa-fw"></i></div>'
							),
							t
								.querySelector('.expand-btn')
								.addEventListener('click', () => {
									t.classList.remove('highlight-fold'),
										t.classList.add('unfold')
								})),
							!r &&
								CONFIG.copycode.enable &&
								this.registerCopyButton(t, n)
					}
				}
			})
		},
		wrapTableWithBox() {
			document.querySelectorAll('table').forEach((e) => {
				var t = document.createElement('div')
				;(t.className = 'table-container'), e.wrap(t)
			})
		},
		registerVideoIframe() {
			document.querySelectorAll('iframe').forEach((t) => {
				var e, n, i
				;[
					'www.youtube.com',
					'player.vimeo.com',
					'player.youku.com',
					'player.bilibili.com',
					'www.tudou.com',
				].some((e) => t.src.includes(e)) &&
					!t.parentNode.matches('.video-container') &&
					(((e = document.createElement('div')).className =
						'video-container'),
					t.wrap(e),
					(n = Number(t.width)),
					(i = Number(t.height)),
					n) &&
					i &&
					(e.style.paddingTop = (i / n) * 100 + '%')
			})
		},
		updateActiveNav() {
			if (Array.isArray(this.sections)) {
				let e = this.sections.findIndex(
					(e) => 10 < e?.getBoundingClientRect().top
				)
				;-1 === e ? (e = this.sections.length - 1) : 0 < e && e--,
					this.activateNavByIndex(e)
			}
		},
		registerScrollPercent() {
			let t = document.querySelector('.back-to-top'),
				n = document.querySelector('.reading-progress-bar')
			window.addEventListener(
				'scroll',
				() => {
					var e
					;(t || n) &&
						((e =
							0 <
							(e =
								document.body.scrollHeight - window.innerHeight)
								? Math.min((100 * window.scrollY) / e, 100)
								: 0),
						t &&
							(t.classList.toggle(
								'back-to-top-on',
								5 <= Math.round(e)
							),
							(t.querySelector('span').innerText =
								Math.round(e) + '%')),
						n) &&
						n.style.setProperty('--progress', e.toFixed(2) + '%'),
						this.updateActiveNav()
				},
				{ passive: !0 }
			),
				t?.addEventListener('click', () => {
					window.anime({
						targets: document.scrollingElement,
						duration: 500,
						easing: 'linear',
						scrollTop: 0,
					})
				})
		},
		registerTabsTag() {
			document.querySelectorAll('.tabs ul.nav-tabs .tab').forEach((c) => {
				c.addEventListener('click', (e) => {
					if ((e.preventDefault(), !c.classList.contains('active'))) {
						e = c.parentNode
						let t = e.nextElementSibling
						;(t.style.overflow = 'hidden'),
							(t.style.transition = 'height 1s')
						var a =
								t.querySelector('.active') ||
								t.firstElementChild,
							l =
								parseInt(
									window.getComputedStyle(a).height,
									10
								) || 0
						let n = parseInt(
								window.getComputedStyle(a).paddingTop,
								10
							),
							i = parseInt(
								window.getComputedStyle(a.firstElementChild)
									.marginBottom,
								10
							),
							r =
								((t.style.height = l + n + i + 'px'),
								[...e.children].forEach((e) => {
									e.classList.toggle('active', e === c)
								}),
								document.getElementById(
									c
										.querySelector('a')
										.getAttribute('href')
										.replace('#', '')
								)),
							o =
								([...r.parentNode.children].forEach((e) => {
									e.classList.toggle('active', e === r)
								}),
								r.dispatchEvent(
									new Event('tabs:click', { bubbles: !0 })
								),
								document.body.scrollHeight >
									(window.innerHeight ||
										document.documentElement.clientHeight))
						a = parseInt(
							window.getComputedStyle(t.querySelector('.active'))
								.height,
							10
						)
						;(t.style.height = a + n + i + 'px'),
							setTimeout(() => {
								var e
								document.body.scrollHeight >
									(window.innerHeight ||
										document.documentElement
											.clientHeight) !=
									o &&
									((t.style.transition =
										'height 0.3s linear'),
									(e = parseInt(
										window.getComputedStyle(
											t.querySelector('.active')
										).height,
										10
									)),
									(t.style.height = e + n + i + 'px')),
									setTimeout(() => {
										;(t.style.transition = ''),
											(t.style.height = '')
									}, 250)
							}, 1e3),
							CONFIG.stickytabs &&
								((l =
									e.parentNode.getBoundingClientRect().top +
									window.scrollY +
									10),
								window.anime({
									targets: document.scrollingElement,
									duration: 500,
									easing: 'linear',
									scrollTop: l,
								}))
					}
				})
			}),
				window.dispatchEvent(new Event('tabs:register'))
		},
		registerCanIUseTag() {
			window.addEventListener(
				'message',
				({ data: e }) => {
					var t
					'string' == typeof e &&
						e.includes('ciu_embed') &&
						((t = e.split(':')[1]),
						(e = e.split(':')[2]),
						(document.querySelector(
							`iframe[data-feature=${t}]`
						).style.height = parseInt(e, 10) + 5 + 'px'))
				},
				!1
			)
		},
		registerActiveMenuItem() {
			document.querySelectorAll('.menu-item a[href]').forEach((e) => {
				var t =
						e.pathname === location.pathname ||
						e.pathname ===
							location.pathname.replace('index.html', ''),
					n =
						!CONFIG.root.startsWith(e.pathname) &&
						location.pathname.startsWith(e.pathname)
				e.classList.toggle(
					'menu-item-active',
					e.hostname === location.hostname && (t || n)
				)
			})
		},
		registerLangSelect() {
			document.querySelectorAll('.lang-select').forEach((e) => {
				;(e.value = CONFIG.page.lang),
					e.addEventListener('change', () => {
						let t = e.options[e.selectedIndex]
						document
							.querySelectorAll('.lang-select-label span')
							.forEach((e) => {
								e.innerText = t.text
							}),
							(window.location.href = t.dataset.href)
					})
			})
		},
		registerSidebarTOC() {
			;(this.sections = [
				...document.querySelectorAll(
					'.post-toc:not(.placeholder-toc) li a.nav-link'
				),
			].map((t) => {
				let n = document.getElementById(
					decodeURI(t.getAttribute('href')).replace('#', '')
				)
				return (
					t.addEventListener('click', (e) => {
						e.preventDefault()
						e = n.getBoundingClientRect().top + window.scrollY
						window.anime({
							targets: document.scrollingElement,
							duration: 500,
							easing: 'linear',
							scrollTop: e,
							complete: () => {
								history.pushState(null, document.title, t.href)
							},
						})
					}),
					n
				)
			})),
				this.updateActiveNav()
		},
		registerPostReward() {
			var e = document.querySelector('.reward-container button')
			e &&
				e.addEventListener('click', () => {
					document
						.querySelector('.post-reward')
						.classList.toggle('active')
				})
		},
		activateNavByIndex(n) {
			var i = document.querySelector(
				'.post-toc:not(.placeholder-toc) .nav'
			)
			if (i) {
				var r = i.querySelectorAll('.nav-item'),
					n = r[n]
				if (n && !n.classList.contains('active-current')) {
					var o = r[r.length - 1].offsetHeight
					i.querySelectorAll('.active').forEach((e) => {
						e.classList.remove('active', 'active-current')
					}),
						n.classList.add('active', 'active-current')
					let e = n.querySelector('.nav-child') || n.parentElement,
						t = 0
					for (; i.contains(e); )
						e.classList.contains('nav-item')
							? e.classList.add('active')
							: ((t += o * e.childElementCount + 5),
							  e.style.setProperty('--height', t + 'px')),
							(e = e.parentElement)
					r = document.querySelector(
						'Pisces' === CONFIG.scheme || 'Gemini' === CONFIG.scheme
							? '.sidebar-panel-container'
							: '.sidebar'
					)
					document.querySelector('.sidebar-toc-active') &&
						window.anime({
							targets: r,
							duration: 200,
							easing: 'linear',
							scrollTop:
								r.scrollTop -
								r.offsetHeight / 2 +
								n.getBoundingClientRect().top -
								r.getBoundingClientRect().top,
						})
				}
			}
		},
		updateSidebarPosition() {
			if (
				!(
					window.innerWidth < 1200 ||
					'Pisces' === CONFIG.scheme ||
					'Gemini' === CONFIG.scheme
				)
			) {
				var t = document.querySelector(
					'.post-toc:not(.placeholder-toc)'
				)
				let e = CONFIG.page.sidebar
				;(e =
					'boolean' != typeof e
						? 'always' === CONFIG.sidebar.display ||
						  ('post' === CONFIG.sidebar.display && t)
						: e) && window.dispatchEvent(new Event('sidebar:show'))
			}
		},
		activateSidebarPanel(t) {
			var n = document.querySelector('.sidebar-inner'),
				i = ['sidebar-toc-active', 'sidebar-overview-active']
			if (!n.classList.contains(i[t])) {
				var r = n.querySelector('.sidebar-panel-container'),
					o = r.firstElementChild,
					a = r.lastElementChild
				let e = o.scrollHeight
				o = [
					(e =
						0 === t && (o = o.querySelector('.nav'))
							? parseInt(o.style.getPropertyValue('--height'), 10)
							: e),
					a.scrollHeight,
				]
				r.style.setProperty('--inactive-panel-height', o[1 - t] + 'px'),
					r.style.setProperty('--active-panel-height', o[t] + 'px'),
					n.classList.replace(i[1 - t], i[t])
			}
		},
		updateFooterPosition() {
			function e() {
				var e = document.querySelector('.footer'),
					t =
						document.querySelector('.main').offsetHeight +
						e.offsetHeight
				e.classList.toggle('footer-fixed', t <= window.innerHeight)
			}
			'Pisces' !== CONFIG.scheme &&
				'Gemini' !== CONFIG.scheme &&
				(e(),
				window.addEventListener('resize', e),
				window.addEventListener('scroll', e, { passive: !0 }))
		},
		getScript(i, e = {}, t) {
			if ('function' == typeof e)
				return this.getScript(i, { condition: t }).then(e)
			let {
					condition: n = !1,
					attributes: {
						id: r = '',
						defer: o = !1,
						crossOrigin: a = '',
						dataset: l = {},
						...c
					} = {},
					parentNode: s = null,
				} = e,
				d = e.async ?? !1
			return new Promise((e, t) => {
				if (n) e()
				else {
					let n = document.createElement('script')
					r && (n.id = r),
						a && (n.crossOrigin = a),
						(n.async = d),
						(n.defer = o),
						Object.assign(n.dataset, l),
						Object.entries(c).forEach(([e, t]) => {
							n.setAttribute(e, String(t))
						}),
						(n.onload = e),
						(n.onerror = t),
						'object' == typeof i
							? (({ url: e, integrity: t } = i),
							  (n.src = e),
							  t &&
									((n.integrity = t),
									(n.crossOrigin = 'anonymous')))
							: (n.src = i),
						(s || document.head).appendChild(n)
				}
			})
		},
		loadComments(t, e) {
			return e
				? this.loadComments(t).then(e)
				: new Promise((n) => {
						var e = document.querySelector(t)
						CONFIG.comments.lazyload && e
							? new IntersectionObserver((e, t) => {
									e[0].isIntersecting && (n(), t.disconnect())
							  }).observe(e)
							: n()
				  })
		},
		debounce(n, i) {
			let r
			return function (...e) {
				let t = this
				clearTimeout(r), (r = setTimeout(() => n.apply(t, e), i))
			}
		},
	})
