import { getFirestore, isFirebaseConfigured } from './firebase';

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function timeAgo(ts) {
    if (!ts) return '';
    const date = ts instanceof Date ? ts : ts.toDate();
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
}

export function initComments(articleId, options = {}) {
    const container = document.getElementById(options.containerId || 'comments-list');
    const countEl = document.getElementById('comments-count');
    const form = document.getElementById('comment-form');

    if (!container) return;

    const renderComment = (c) => `
        <div class="flex gap-4" data-comment-id="${c.id}">
            <div class="h-10 w-10 shrink-0 rounded-full bg-brand-50 text-brand flex items-center justify-center font-semibold text-sm uppercase">
                ${escapeHtml((c.authorName || 'A').charAt(0))}
            </div>
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 text-sm">
                    <span class="font-semibold text-ink">${escapeHtml(c.authorName || 'Anonymous')}</span>
                    <span class="text-xs text-gray-400">${timeAgo(c.createdAt)}</span>
                </div>
                <p class="mt-1 text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">${escapeHtml(c.body)}</p>
                <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <button data-react="${c.id}" class="react-btn inline-flex items-center gap-1 hover:text-brand">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"/></svg>
                        <span data-react-count="${c.id}">${c.reactions || 0}</span>
                    </button>
                </div>
                ${(c.replies || []).map((r) => renderComment(r)).join('')}
            </div>
        </div>
    `;

    const renderAll = (comments) => {
        const topLevel = comments.filter((c) => !c.parentId);
        const children = comments.filter((c) => c.parentId);
        const map = (c) => ({
            ...c,
            replies: children.filter((x) => x.parentId === c.id).map(map),
        });
        container.innerHTML = topLevel.map(map).map(renderComment).join('')
            || '<p class="text-gray-500">Be the first to comment.</p>';
        if (countEl) countEl.textContent = comments.length;
    };

    if (isFirebaseConfigured()) {
        import('firebase/firestore').then(async ({ collection, query, orderBy, onSnapshot }) => {
            const db = await getFirestore();
            if (!db) return;
            const q = query(
                collection(db, 'articles', String(articleId), 'comments'),
                orderBy('createdAt', 'asc')
            );
            onSnapshot(q, (snap) => {
                const comments = [];
                snap.forEach((doc) => comments.push({ id: doc.id, ...doc.data() }));
                renderAll(comments);
            });
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = form.querySelector('[name="body"]')?.value?.trim();
            if (!body) return;

            const button = form.querySelector('button[type="submit"]');
            const original = button?.textContent;
            if (button) button.disabled = true;

            try {
                const resp = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    },
                    body: JSON.stringify({ body }),
                });
                if (resp.ok) {
                    form.querySelector('[name="body"]').value = '';
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (button) {
                    button.disabled = false;
                    button.textContent = original;
                }
            }
        });
    }

    container.addEventListener('click', async (e) => {
        const reactBtn = e.target.closest('[data-react]');
        if (reactBtn) {
            const id = reactBtn.getAttribute('data-react');
            try {
                const resp = await fetch(`/comments/${id}/react`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    },
                });
                if (resp.ok && isFirebaseConfigured() === false) {
                    const json = await resp.json();
                    const countEl2 = container.querySelector(`[data-react-count="${id}"]`);
                    if (countEl2) countEl2.textContent = json.reactions;
                }
            } catch (err) {
                console.error(err);
            }
        }
    });
}
