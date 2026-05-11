const USER_PROFILE_KEY = 'tutor_user_profile';
const BOOKING_REQUESTS_KEY = 'tutor_booking_requests';
const COURSE_BOOKING_REQUESTS_KEY = 'tutor_course_booking_requests';
const RECENT_VIEWS_KEY = 'tutor_recent_views';
const RECENT_COURSE_VIEWS_KEY = 'tutor_course_recent_views';
const COMPARE_IDS_KEY = 'tutor_compare_ids';
const COURSE_COMPARE_IDS_KEY = 'tutor_course_compare_ids';
const RECENT_COMPARE_SESSIONS_KEY = 'tutor_recent_compare_sessions';
const USER_TUTOR_REVIEWS_KEY = 'tutor_user_reviews';
const MAX_RECENT_VIEWS = 15;
const MAX_COMPARE = 8;
const MAX_RECENT_COMPARE_SESSIONS = 15;

function defaultUserProfile() {
    return {
        displayName: '',
        email: '',
        phone: '',
        city: '',
        about: ''
    };
}

function getUserProfile() {
    try {
        const raw = localStorage.getItem(USER_PROFILE_KEY);
        if (!raw) return defaultUserProfile();
        const data = JSON.parse(raw);
        return { ...defaultUserProfile(), ...data };
    } catch {
        return defaultUserProfile();
    }
}

function saveUserProfile(profile) {
    const merged = { ...getUserProfile(), ...profile };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(merged));
}

function getBookingRequests() {
    try {
        const raw = localStorage.getItem(BOOKING_REQUESTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function addBookingRequest(payload) {
    const list = getBookingRequests();
    const item = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        tutorId: payload.tutorId,
        tutorName: payload.tutorName || '',
        subject: payload.subject || '',
        message: payload.message || '',
        contactPhone: payload.contactPhone || '',
        contactEmail: payload.contactEmail || '',
        createdAt: new Date().toISOString()
    };
    list.unshift(item);
    localStorage.setItem(BOOKING_REQUESTS_KEY, JSON.stringify(list));
    return item;
}

function deleteBookingRequest(requestId) {
    const list = getBookingRequests().filter((r) => r.id !== requestId);
    localStorage.setItem(BOOKING_REQUESTS_KEY, JSON.stringify(list));
}

function getCourseBookingRequests() {
    try {
        const raw = localStorage.getItem(COURSE_BOOKING_REQUESTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function addCourseBookingRequest(payload) {
    const list = getCourseBookingRequests();
    const item = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        courseId: payload.courseId,
        courseTitle: payload.courseTitle || '',
        category: payload.category || '',
        message: payload.message || '',
        contactPhone: payload.contactPhone || '',
        contactEmail: payload.contactEmail || '',
        createdAt: new Date().toISOString()
    };
    list.unshift(item);
    localStorage.setItem(COURSE_BOOKING_REQUESTS_KEY, JSON.stringify(list));
    return item;
}

function deleteCourseBookingRequest(requestId) {
    const list = getCourseBookingRequests().filter((r) => r.id !== requestId);
    localStorage.setItem(COURSE_BOOKING_REQUESTS_KEY, JSON.stringify(list));
}

function getAllUserTutorReviews() {
    try {
        const raw = localStorage.getItem(USER_TUTOR_REVIEWS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function getUserTutorReviewsForTutor(tutorId) {
    const tid = parseInt(tutorId, 10);
    return getAllUserTutorReviews()
        .filter((r) => r.tutorId === tid)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addUserTutorReview({ tutorId, rating, text }) {
    const list = getAllUserTutorReviews();
    const profile = getUserProfile();
    const author = (profile.displayName && profile.displayName.trim()) || 'Пользователь';
    const item = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        tutorId: parseInt(tutorId, 10),
        author,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
        text: String(text || '').trim(),
        createdAt: new Date().toISOString(),
        fromUser: true
    };
    list.unshift(item);
    localStorage.setItem(USER_TUTOR_REVIEWS_KEY, JSON.stringify(list));
    return item;
}

function deleteUserTutorReview(reviewId) {
    if (!reviewId) return false;
    const list = getAllUserTutorReviews().filter((r) => r.id !== reviewId);
    localStorage.setItem(USER_TUTOR_REVIEWS_KEY, JSON.stringify(list));
    return true;
}

function recordTutorView(tutor) {
    if (!tutor || tutor.id == null) return;
    let list = [];
    try {
        const raw = localStorage.getItem(RECENT_VIEWS_KEY);
        list = raw ? JSON.parse(raw) : [];
    } catch {
        list = [];
    }
    const entry = {
        id: tutor.id,
        name: tutor.name || '',
        subject: tutor.subject || '',
        viewedAt: new Date().toISOString()
    };
    list = list.filter((v) => v.id !== tutor.id);
    list.unshift(entry);
    if (list.length > MAX_RECENT_VIEWS) list = list.slice(0, MAX_RECENT_VIEWS);
    localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(list));
}

function recordCourseView(course) {
    if (!course || course.id == null) return;
    let list = [];
    try {
        const raw = localStorage.getItem(RECENT_COURSE_VIEWS_KEY);
        list = raw ? JSON.parse(raw) : [];
    } catch {
        list = [];
    }
    const entry = {
        id: course.id,
        title: course.title || '',
        category: course.category || '',
        viewedAt: new Date().toISOString()
    };
    list = list.filter((v) => v.id !== course.id);
    list.unshift(entry);
    if (list.length > MAX_RECENT_VIEWS) list = list.slice(0, MAX_RECENT_VIEWS);
    localStorage.setItem(RECENT_COURSE_VIEWS_KEY, JSON.stringify(list));
}

function getRecentViews() {
    try {
        const raw = localStorage.getItem(RECENT_VIEWS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function getRecentCourseViews() {
    try {
        const raw = localStorage.getItem(RECENT_COURSE_VIEWS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function clearRecentViews() {
    localStorage.removeItem(RECENT_VIEWS_KEY);
}

function clearRecentCourseViews() {
    localStorage.removeItem(RECENT_COURSE_VIEWS_KEY);
}

function getCompareIds() {
    try {
        const raw = localStorage.getItem(COMPARE_IDS_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr)
            ? arr.map((id) => parseInt(id, 10)).filter((n) => !Number.isNaN(n)).slice(0, MAX_COMPARE)
            : [];
    } catch {
        return [];
    }
}

function setCompareIds(ids) {
    const unique = [...new Set(ids.map((id) => parseInt(id, 10)).filter((n) => !Number.isNaN(n)))].slice(
        0,
        MAX_COMPARE
    );
    localStorage.setItem(COMPARE_IDS_KEY, JSON.stringify(unique));
    window.dispatchEvent(new CustomEvent('compareIdsChanged', { detail: unique }));
}

function toggleCompareId(tutorId) {
    const id = parseInt(tutorId, 10);
    if (Number.isNaN(id)) return getCompareIds();
    let ids = getCompareIds();
    if (ids.includes(id)) {
        ids = ids.filter((x) => x !== id);
    } else if (ids.length < MAX_COMPARE) {
        ids.push(id);
    } else {
        ids = [...ids.slice(1), id];
    }
    setCompareIds(ids);
    return ids;
}

function isCompareSelected(tutorId) {
    const id = parseInt(tutorId, 10);
    return getCompareIds().includes(id);
}

function getCourseCompareIds() {
    try {
        const raw = localStorage.getItem(COURSE_COMPARE_IDS_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr)
            ? arr.map((id) => parseInt(id, 10)).filter((n) => !Number.isNaN(n)).slice(0, MAX_COMPARE)
            : [];
    } catch {
        return [];
    }
}

function setCourseCompareIds(ids) {
    const unique = [...new Set(ids.map((id) => parseInt(id, 10)).filter((n) => !Number.isNaN(n)))].slice(
        0,
        MAX_COMPARE
    );
    localStorage.setItem(COURSE_COMPARE_IDS_KEY, JSON.stringify(unique));
    window.dispatchEvent(new CustomEvent('courseCompareIdsChanged', { detail: unique }));
}

function toggleCourseCompareId(courseId) {
    const id = parseInt(courseId, 10);
    if (Number.isNaN(id)) return getCourseCompareIds();
    let ids = getCourseCompareIds();
    if (ids.includes(id)) {
        ids = ids.filter((x) => x !== id);
    } else if (ids.length < MAX_COMPARE) {
        ids.push(id);
    } else {
        ids = [...ids.slice(1), id];
    }
    setCourseCompareIds(ids);
    return ids;
}

function isCourseCompareSelected(courseId) {
    const id = parseInt(courseId, 10);
    return getCourseCompareIds().includes(id);
}

function normalizeCompareSessionIds(type, ids) {
    const uniq = [...new Set(ids.map((x) => parseInt(x, 10)).filter((n) => !Number.isNaN(n)))].sort((a, b) => a - b);
    if (uniq.length < 2) return null;
    return { type: type === 'course' ? 'course' : 'tutor', ids: uniq };
}

function compareSessionIdsEqual(a, b) {
    const aa = Array.isArray(a) ? [...a].sort((x, y) => x - y) : [];
    const bb = Array.isArray(b) ? [...b].sort((x, y) => x - y) : [];
    if (aa.length !== bb.length) return false;
    return aa.every((v, i) => v === bb[i]);
}

function migrateSessionEntry(s) {
    const type = s.type === 'course' ? 'course' : 'tutor';
    const comparedAt = s.comparedAt || '';
    if (Array.isArray(s.ids) && s.ids.length >= 2) {
        const ids = [...new Set(s.ids.map((x) => parseInt(x, 10)).filter((n) => !Number.isNaN(n)))].sort((a, b) => a - b);
        if (ids.length < 2) return null;
        return { type, ids, comparedAt };
    }
    const idA = parseInt(s.idA, 10);
    const idB = parseInt(s.idB, 10);
    if (Number.isNaN(idA) || Number.isNaN(idB) || idA === idB) return null;
    const lo = Math.min(idA, idB);
    const hi = Math.max(idA, idB);
    return { type, ids: [lo, hi], comparedAt };
}

function getRecentCompareSessions() {
    try {
        const raw = localStorage.getItem(RECENT_COMPARE_SESSIONS_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(arr)) return [];
        return arr
            .map((s) => migrateSessionEntry(s))
            .filter(Boolean)
            .slice(0, MAX_RECENT_COMPARE_SESSIONS);
    } catch {
        return [];
    }
}

function recordCompareSession(type, ids) {
    const norm = normalizeCompareSessionIds(type, ids);
    if (!norm) return;
    let list = getRecentCompareSessions();
    list = list.filter((s) => !(s.type === norm.type && compareSessionIdsEqual(s.ids, norm.ids)));
    list.unshift({ ...norm, comparedAt: new Date().toISOString() });
    list = list.slice(0, MAX_RECENT_COMPARE_SESSIONS);
    localStorage.setItem(RECENT_COMPARE_SESSIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('recentCompareSessionsChanged'));
}

function clearRecentCompareSessions() {
    localStorage.removeItem(RECENT_COMPARE_SESSIONS_KEY);
    window.dispatchEvent(new CustomEvent('recentCompareSessionsChanged'));
}

function updateRecentCompareCount() {
    const n = getRecentCompareSessions().length;
    document.querySelectorAll('.recent-compare-count').forEach((el) => {
        el.textContent = String(n);
    });
}

window.getUserProfile = getUserProfile;
window.saveUserProfile = saveUserProfile;
window.getBookingRequests = getBookingRequests;
window.addBookingRequest = addBookingRequest;
window.deleteBookingRequest = deleteBookingRequest;
window.getCourseBookingRequests = getCourseBookingRequests;
window.addCourseBookingRequest = addCourseBookingRequest;
window.deleteCourseBookingRequest = deleteCourseBookingRequest;
window.getAllUserTutorReviews = getAllUserTutorReviews;
window.getUserTutorReviewsForTutor = getUserTutorReviewsForTutor;
window.addUserTutorReview = addUserTutorReview;
window.deleteUserTutorReview = deleteUserTutorReview;
window.recordTutorView = recordTutorView;
window.recordCourseView = recordCourseView;
window.getRecentViews = getRecentViews;
window.getRecentCourseViews = getRecentCourseViews;
window.clearRecentViews = clearRecentViews;
window.clearRecentCourseViews = clearRecentCourseViews;
window.getCompareIds = getCompareIds;
window.setCompareIds = setCompareIds;
window.toggleCompareId = toggleCompareId;
window.isCompareSelected = isCompareSelected;
window.getCourseCompareIds = getCourseCompareIds;
window.setCourseCompareIds = setCourseCompareIds;
window.toggleCourseCompareId = toggleCourseCompareId;
window.isCourseCompareSelected = isCourseCompareSelected;
window.getRecentCompareSessions = getRecentCompareSessions;
window.recordCompareSession = recordCompareSession;
window.clearRecentCompareSessions = clearRecentCompareSessions;
window.updateRecentCompareCount = updateRecentCompareCount;
window.getMaxCompareSelection = function getMaxCompareSelection() {
    return MAX_COMPARE;
};

document.addEventListener('DOMContentLoaded', () => {
    updateRecentCompareCount();
});
window.addEventListener('recentCompareSessionsChanged', updateRecentCompareCount);
