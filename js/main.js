document.addEventListener('DOMContentLoaded', async () => {
    // Загружаем популярные предметы
    const subjects = await fetchSubjects();
    const popularSubjects = subjects.slice(0, 6);
    
    const subjectsGrid = document.getElementById('popularSubjects');
    
    if (subjectsGrid) {
        if (popularSubjects.length === 0) {
            subjectsGrid.innerHTML = '<div class="loading">Загрузка предметов...</div>';
            return;
        }
        
        subjectsGrid.innerHTML = popularSubjects.map(subject => {
            const iconBlock = window.createSubjectIcon
                ? window.createSubjectIcon(subject)
                : (window.getSubjectIcon
                    ? `<div class="subject-icon">${window.getSubjectIcon(subject)}</div>`
                    : '<div class="subject-icon"></div>');
            return `
                <div class="subject-card" onclick="window.location.href='catalog.html?subject=${encodeURIComponent(subject)}'">
                    ${iconBlock}
                    <h3>${escapeHtml(subject)}</h3>
                    <p>Найти репетитора</p>
                </div>
            `;
        }).join('');
    }

    renderRecentStrip();
});

function renderRecentStrip() {
    const strip = document.getElementById('recentStrip');
    const chips = document.getElementById('recentChips');
    if (!strip || !chips || typeof getRecentViews !== 'function') return;
    const items = getRecentViews().slice(0, 6);
    if (items.length === 0) {
        strip.hidden = true;
        return;
    }
    strip.hidden = false;
    chips.innerHTML = items
        .map(
            (v) =>
                `<a class="recent-chip" href="tutor-detail.html?id=${encodeURIComponent(v.id)}">${escapeHtml(v.name)}</a>`
        )
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}