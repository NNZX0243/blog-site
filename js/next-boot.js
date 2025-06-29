;(NexT.boot = {}),
	(NexT.boot.registerEvents = function () {
		NexT.utils.registerScrollPercent(),
			NexT.utils.registerCanIUseTag(),
			NexT.utils.updateFooterPosition(),
			document
				.querySelector('.site-nav-toggle .toggle')
				.addEventListener('click', (e) => {
					e.currentTarget.classList.toggle('toggle-close')
					e = document.querySelector('.site-nav')
					e &&
						(e.style.setProperty(
							'--scroll-height',
							e.scrollHeight + 'px'
						),
						document.body.classList.toggle('site-nav-on'))
				}),
			document.querySelectorAll('.sidebar-nav li').forEach((e, t) => {
				e.addEventListener('click', () => {
					NexT.utils.activateSidebarPanel(t)
				})
			}),
			window.addEventListener('hashchange', () => {
				var e = location.hash
				'' === e ||
					e.match(/%\S{2}/) ||
					document
						.querySelector(`.tabs ul.nav-tabs li a[href="${e}"]`)
						?.click()
			}),
			window.addEventListener('tabs:click', (e) => {
				NexT.utils.registerCodeblock(e.target)
			})
	}),
	(NexT.boot.refresh = function () {
		CONFIG.prism && window.Prism.highlightAll(),
			CONFIG.mediumzoom &&
				window.mediumZoom(
					'.post-body :not(a) > img, .post-body > img',
					{ background: 'var(--content-bg-color)' }
				),
			CONFIG.lazyload && window.lozad('.post-body img').observe(),
			CONFIG.pangu && window.pangu.spacingPage(),
			CONFIG.exturl && NexT.utils.registerExtURL(),
			NexT.utils.wrapTableWithBox(),
			NexT.utils.registerCodeblock(),
			NexT.utils.registerTabsTag(),
			NexT.utils.registerActiveMenuItem(),
			NexT.utils.registerLangSelect(),
			NexT.utils.registerSidebarTOC(),
			NexT.utils.registerPostReward(),
			NexT.utils.registerVideoIframe()
	}),
	(NexT.boot.motion = function () {
		CONFIG.motion.enable &&
			NexT.motion.integrator
				.add(NexT.motion.middleWares.header)
				.add(NexT.motion.middleWares.sidebar)
				.add(NexT.motion.middleWares.postList)
				.add(NexT.motion.middleWares.footer)
				.bootstrap(),
			NexT.utils.updateSidebarPosition()
	}),
	document.addEventListener('DOMContentLoaded', () => {
		NexT.boot.registerEvents(), NexT.boot.refresh(), NexT.boot.motion()
	})
