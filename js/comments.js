window.addEventListener('tabs:register', () => {
	let t = CONFIG.comments.activeClass
	var e
	;(t = CONFIG.comments.storage
		? localStorage.getItem('comments_active') || t
		: t) &&
		(e = document.querySelector(`a[href="#comment-${t}"]`)) &&
		e.click()
}),
	CONFIG.comments.storage &&
		window.addEventListener('tabs:click', (t) => {
			t.target.matches('.tabs-comment .tab-content .tab-pane') &&
				((t = t.target.classList[1]),
				localStorage.setItem('comments_active', t))
		})
