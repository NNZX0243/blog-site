// 模块加载器对象
const ModuleLoader = {
	// 模块缓存
	cache: {},

	// 配置项
	config: {
		basePath: '/common/', // 默认路径
		minLoadTime: 700,
		useCache: true,
		debugMode: true,
	},

	/**
	 * 加载HTML模块
	 * @param {string} containerId - DOM容器ID
	 * @param {string} filePath - 模块文件路径
	 */
	load(containerId, filePath) {
		const container = document.getElementById(containerId)
		if (!container) {
			console.error(`ModuleLoader: Container not found - #${containerId}`)
			return
		}

		// 设置加载状态
		container.classList.remove('loaded', 'error')
		container.innerHTML = this._createLoaderHtml(containerId, filePath)

		// 实际文件路径（确保以/common/开头）
		const fullPath = this._resolvePath(filePath)

		// 显示加载路径（仅用于演示）
		container.querySelector(
			'.loader-details'
		).textContent = `加载路径: ${fullPath}`

		// 设置重试按钮事件
		container.querySelector('.retry-btn').onclick = () =>
			this.load(containerId, filePath)

		// 检查缓存
		if (this.config.useCache && this.cache[fullPath]) {
			setTimeout(() => {
				this._insertContent(container, this.cache[fullPath])
				container.classList.add('loaded')
			}, this.config.minLoadTime)
			return
		}

		setTimeout(() => {
			fetch(fullPath)
				.then((response) => response.text())
				.then((html) => {
					if (this.config.useCache) this.cache[fullPath] = html
					this._insertContent(container, html)
					container.classList.add('loaded')
				})
				.catch((error) => {
					this._showError(
						container,
						`加载失败: ${error.message}`,
						fullPath
					)
				})
		}, this.config.minLoadTime)
	},

	/**
	 * 清除模块缓存
	 * @param {string} [filePath] - 可选，清除特定模块缓存
	 */
	clearCache(filePath) {
		if (filePath) {
			const fullPath = this._resolvePath(filePath)
			delete this.cache[fullPath]
			console.log(`ModuleLoader: Cache cleared for ${fullPath}`)
		} else {
			this.cache = {}
			console.log('ModuleLoader: All cache cleared')
		}
		alert('缓存已清除！')
	},

	// 内部方法：创建加载器HTML
	_createLoaderHtml(moduleId, filePath) {
		return `
                    <div class="loader-icon"></div>
                    <div class="loader-text">正在加载 ${moduleId.replace(
						'-module',
						''
					)} 模块...</div>
                    <div class="loader-details">加载路径: ${this._resolvePath(
						filePath
					)}</div>
                    <div class="loader-badge">公共模块</div>
                    <button class="retry-btn">重试加载</button>
                `
	},

	// 内部方法：显示错误
	_showError(container, message, path) {
		container.classList.add('error')
		container.innerHTML = `
                    <div class="loader-icon" style="border-color: var(--error-color);"></div>
                    <div class="loader-text">${message}</div>
                    <div class="loader-details">加载路径: ${path}</div>
                    <div class="loader-badge" style="background: var(--error-color);">加载失败</div>
                    <button class="retry-btn">重试加载</button>
                `
		container.querySelector('.retry-btn').onclick = () =>
			this.load(container.id, this._getOriginalPath(path))
	},

	// 内部方法：插入内容
	_insertContent(container, content) {
		container.innerHTML = content
	},

	// 解析文件路径（确保以/common/开头）
	_resolvePath(filePath) {
		const base = this.config.basePath
		// 如果路径不是以/common/开头，自动添加
		if (!filePath.startsWith(base)) {
			if (filePath.startsWith('/')) {
				return `${base}${filePath.substring(1)}`
			}
			return `${base}${filePath}`
		}
		return filePath
	},

	// 获取原始路径（显示给用户）
	_getOriginalPath(fullPath) {
		return fullPath.replace(this.config.basePath, '/common/')
	},
}

// 页面加载时初始化模块
window.addEventListener('DOMContentLoaded', function () {
	// 加载所有模块
	ModuleLoader.load('sidebar-module', '/common/sidebar.html')

	// // 启用代码复制功能
	// window.copyCode = function (id) {
	// 	const codeBlock = document.querySelector(`#${id} pre`)
	// 	const textArea = document.createElement('textarea')
	// 	textArea.value = codeBlock.textContent
	// 	document.body.appendChild(textArea)
	// 	textArea.select()
	// 	document.execCommand('copy')
	// 	document.body.removeChild(textArea)

	// 	const button = document.querySelector(`#${id} .copy-btn`)
	// 	const originalText = button.textContent
	// 	button.textContent = '已复制!'
	// 	setTimeout(() => {
	// 		button.textContent = originalText
	// 	}, 2000)
	// }
})
