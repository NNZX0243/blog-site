window.NexT || (window.NexT = {}),
	(() => {
		let o = {},
			i = {},
			r = (e) => {
				var t = document.querySelector(`.next-config[data-name="${e}"]`)
				t &&
					((t = t.text),
					(t = JSON.parse(t || '{}')),
					'main' === e ? Object.assign(o, t) : (i[e] = t))
			}
		r('main'),
			(window.CONFIG = new Proxy(
				{},
				{
					get(e, t) {
						let n
						if (
							((n = (t in o ? o : (t in i || r(t), i))[t]),
							t in e || 'object' != typeof n || (e[t] = {}),
							t in e)
						) {
							let o = e[t]
							return 'object' == typeof o && 'object' == typeof n
								? new Proxy(
										{ ...n, ...o },
										{
											set(e, t, n) {
												return (
													(e[t] = n), (o[t] = n), !0
												)
											},
										}
								  )
								: o
						}
						return n
					},
				}
			)),
			document.addEventListener('pjax:success', () => {
				i = {}
			})
	})()
