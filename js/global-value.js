window.GLOBAL_VARS = {
	categories: 13,
	archives: 2,
	siteName: "NNZX'S BLOG",
	author: '~NNZX~',
}

const GobalValueUpdate = {
	update() {
		const archives = document.getElementById('badge-archives')
		archives.textContent = GLOBAL_VARS.archives
		const categories = document.getElementById('badge-categories')
		categories.textContent = GLOBAL_VARS.categories
	},
}
