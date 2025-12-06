document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.search-form');
    const resultsContainer = document.querySelector('.search-result');
    const resultsTitle = document.querySelector('.search-result--title');
    const resultsList = document.querySelector('.search-result--list');
    let searchData = [];
    
    // 加载搜索数据
    fetch(form.getAttribute('data-json'))
        .then(response => response.json())
        .then(data => {
            searchData = data;
        })
        .catch(error => console.error('Error loading search data:', error));
    
    // 处理搜索表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const keyword = form.querySelector('input[name="keyword"]').value.trim();
        
        if (!keyword) {
            resultsContainer.style.display = 'none';
            return;
        }
        
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(keyword.toLowerCase()) ||
            item.description.toLowerCase().includes(keyword.toLowerCase())
        );
        
        displayResults(results, keyword);
    });
    
    // 显示搜索结果
    function displayResults(results, keyword) {
        resultsContainer.style.display = 'block';
        
        if (results.length === 0) {
            resultsTitle.textContent = `未找到 "${keyword}" 的搜索结果`;
            resultsList.innerHTML = '<p>没有找到相关文章</p>';
            return;
        }
        
        resultsTitle.textContent = window.searchResultTitleTemplate.replace('{{ . }}', results.length);
        
        const resultsHTML = results.map(item => `
            <article>
                <a href="${item.url}">
                    <div class="article-details">
                        <h2 class="article-title">${item.title}</h2>
                        <p class="article-preview">${item.description}</p>
                    </div>
                </a>
            </article>
        `).join('');
        
        resultsList.innerHTML = resultsHTML;
    }
});