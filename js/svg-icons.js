// Библиотека SVG иконок для преподавателей
const SVGIcons = {
    // Иконка для математики
    math: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 8L12 13L17 8M7 16L12 11L17 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" stroke-width="2"/>
            <path d="M8 12H16M12 8V16" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    // Иконка для английского
    english: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <path d="M12 12V22" stroke="white" stroke-width="2"/>
        </svg>
    `,
    
    // Иконка для физики
    physics: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V16M8 12H16" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/>
            <path d="M3 12H1M23 12H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 3V1M12 23V21" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 4L6 6M18 18L20 20" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    // Иконка для программирования
    programming: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8L4 12L8 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 8L20 12L16 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" stroke-width="2"/>
            <path d="M14 8L10 16" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    // Иконка для русского языка
    russian: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H20M4 12H20M4 17H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 14L19 17L16 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 14L16 17L19 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    
    // Иконка для истории
    history: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/>
            <path d="M12 2V4M12 20V22" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 4L6 6M18 18L20 20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M2 12H4M20 12H22" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    // Иконка для биологии
    biology: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C12 4 8 6 8 10C8 14 12 16 12 16C12 16 16 14 16 10C16 6 12 4 12 4Z" stroke="white" stroke-width="2"/>
            <path d="M12 4V16" stroke="white" stroke-width="2"/>
            <path d="M8 8H6M16 8H18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M10 14C10 14 11 15 12 15C13 15 14 14 14 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    // Иконка для химии
    chemistry: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V8M12 8L8 12H16L12 8Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <path d="M8 12L6 20H18L16 12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <path d="M10 14H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="17" r="1" fill="white"/>
        </svg>
    `,
    
    // Иконка для информатики
    it: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="white" stroke-width="2"/>
            <path d="M8 8H16M8 12H12" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="18" cy="14" r="1.5" fill="white"/>
            <circle cx="18" cy="18" r="1.5" fill="white"/>
            <path d="M8 16H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    // Иконка для географии
    geography: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/>
            <path d="M12 3C10 6 8 8 8 12C8 16 10 18 12 21" stroke="white" stroke-width="2"/>
            <path d="M12 3C14 6 16 8 16 12C16 16 14 18 12 21" stroke="white" stroke-width="2"/>
            <path d="M5 10H19M5 14H19" stroke="white" stroke-width="2"/>
        </svg>
    `,
    
    // Иконка для экономики
    economics: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21V18H3V6Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <path d="M7 12L10 9L13 12L17 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="7" cy="15" r="1" fill="white"/>
            <circle cx="10" cy="15" r="1" fill="white"/>
            <circle cx="13" cy="15" r="1" fill="white"/>
            <circle cx="17" cy="12" r="1" fill="white"/>
        </svg>
    `,
    
    // Иконка по умолчанию (преподаватель)
    default: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="white" stroke-width="2"/>
            <path d="M5 20V19C5 15.13 8.13 12 12 12C15.87 12 19 15.13 19 19V20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 12V4" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 8H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 8H8" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 20L12 16" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `
};

// Иконки направлений курсов (отдельный набор от предметов репетиторов)
const CourseCategoryIcons = {
    programming: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="2"/>
            <path d="M6 9H18M6 12H14M6 15H12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M16 14L18 16L16 18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    languages: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="10" r="3" stroke="white" stroke-width="2"/>
            <path d="M15 7C17 9 17 13 15 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 18C6.5 15 10 14 13 15.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M19 18H17" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    marketing: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19V5" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 19H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <rect x="7" y="12" width="3" height="5" rx="0.5" fill="white" fill-opacity="0.9"/>
            <rect x="12" y="9" width="3" height="8" rx="0.5" fill="white" fill-opacity="0.9"/>
            <rect x="17" y="6" width="3" height="11" rx="0.5" fill="white" fill-opacity="0.9"/>
        </svg>
    `,
    design: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" stroke-width="2"/>
            <circle cx="9" cy="9" r="2" stroke="white" stroke-width="1.5"/>
            <path d="M13 15L19 9" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 18L14 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    math: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6L16 18M16 6L8 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 12H7M17 12H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
    `,
    exams: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 4H17L19 6V20H7V4Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <path d="M7 8H19" stroke="white" stroke-width="2"/>
            <path d="M10 12H16M10 15H14" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M9 19L11 21L15 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    default: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4H18C19 4 20 5 20 6V18C20 19 19 20 18 20H6C5 20 4 19 4 18V6C4 5 5 4 6 4Z" stroke="white" stroke-width="2"/>
            <path d="M8 8H16M8 12H16M8 16H12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `
};

function getCourseCategoryIcon(category) {
    const map = {
        Программирование: CourseCategoryIcons.programming,
        'Иностранные языки': CourseCategoryIcons.languages,
        'Маркетинг и аналитика': CourseCategoryIcons.marketing,
        Дизайн: CourseCategoryIcons.design,
        'Математика и логика': CourseCategoryIcons.math,
        'Подготовка к экзаменам': CourseCategoryIcons.exams
    };
    return map[category] || CourseCategoryIcons.default;
}

function createCourseAvatar(category) {
    const safe = String(category || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return `
        <div class="course-avatar" data-category="${safe}">
            ${getCourseCategoryIcon(category)}
        </div>
    `;
}

// Функция получения иконки по предмету
function getSubjectIcon(subject) {
    const iconMap = {
        'Математика': SVGIcons.math,
        'Английский язык': SVGIcons.english,
        'Английский': SVGIcons.english,
        'Физика': SVGIcons.physics,
        'Программирование': SVGIcons.programming,
        'Информатика': SVGIcons.it,
        'Русский язык': SVGIcons.russian,
        'Русский': SVGIcons.russian,
        'История': SVGIcons.history,
        'Биология': SVGIcons.biology,
        'Химия': SVGIcons.chemistry,
        'География': SVGIcons.geography,
        'Экономика': SVGIcons.economics
    };
    
    return iconMap[subject] || SVGIcons.default;
}

// Функция для создания аватара преподавателя
function createTutorAvatar(subject) {
    return `
        <div class="tutor-avatar" data-subject="${subject}">
            ${getSubjectIcon(subject)}
        </div>
    `;
}

// Функция для создания иконки предмета (маленькая версия)
function createSubjectIcon(subject) {
    return `
        <div class="subject-icon">
            ${getSubjectIcon(subject)}
        </div>
    `;
}

// Экспортируем функции для использования в других файлах
window.SVGIcons = SVGIcons;
window.getSubjectIcon = getSubjectIcon;
window.createTutorAvatar = createTutorAvatar;
window.createSubjectIcon = createSubjectIcon;
window.getCourseCategoryIcon = getCourseCategoryIcon;
window.createCourseAvatar = createCourseAvatar;