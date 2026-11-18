(function () {
    'use strict';

    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function load(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (e) {
            return fallback;
        }
    }
    function save(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {  }
    }

    let lang = load('auction_lang', 'uk');
    if (!I18N[lang]) { lang = 'uk'; }

    function t(key, params) {
        let text = (I18N[lang] && I18N[lang][key]) || I18N.uk[key] || key;
        if (params) {
            Object.keys(params).forEach((k) => { text = text.split('{' + k + '}').join(params[k]); });
        }
        return text;
    }

    const money = (n) => Number(n).toLocaleString(lang === 'uk' ? 'uk-UA' : 'en-US') + '\u00a0₴';

    function bidsText(n) {
        if (lang === 'en') { return n + (n === 1 ? ' bid' : ' bids'); }
        let word = 'ставок';
        if (n % 10 === 1 && n % 100 !== 11) { word = 'ставка'; }
        else if (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) { word = 'ставки'; }
        return n + ' ' + word;
    }

    let toastTimer;
    function toast(message) {
        const el = $('#toast');
        el.textContent = message;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
    }
    function setError(form, message) {
        $('.form-error', form).textContent = message || '';
    }
    function closeMenu() {
        $('#menu-toggle').checked = false;
    }

    $$('dialog').forEach((dlg) => {
        dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
        $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
    });

    // демо-вхід: дані зберігаються в браузері.
    let users = load('auction_users', []);
    let currentUser = load('auction_current', null);
    let pending = null; // дія після входу.
    let bidCard = null;

    function updateAuthUI() {
        $('#sign-link').textContent = currentUser ? t('sign_user', { name: currentUser.name.split(' ')[0] }) : t('sign_in');
    }

    function showTab(tab) {
        $$('.tab').forEach((x) => x.classList.toggle('active', x.dataset.tab === tab));
        $('#form-signin').hidden = tab !== 'signin';
        $('#form-register').hidden = tab !== 'register';
    }
    $$('.tab').forEach((x) => x.addEventListener('click', () => showTab(x.dataset.tab)));

    function openAuth(tab, noteKey) {
        showTab(tab);
        $$('#dlg-auth form').forEach((f) => { f.reset(); setError(f, ''); });
        const noteEl = $('#auth-note');
        noteEl.hidden = !noteKey;
        noteEl.dataset.key = noteKey || '';
        noteEl.textContent = noteKey ? t(noteKey) : '';
        $('#dlg-auth').showModal();
    }

    function requireAuth(action, noteKey) {
        if (currentUser) {
            action();
        } else {
            pending = action;
            openAuth('signin', noteKey);
        }
    }

    function finishAuth(user, message) {
        currentUser = { name: user.name, email: user.email };
        save('auction_current', currentUser);
        updateAuthUI();
        const action = pending;
        pending = null;
        $('#dlg-auth').close();
        toast(message);
        if (action) { action(); }
    }

    function signOut() {
        currentUser = null;
        save('auction_current', null);
        updateAuthUI();
        toast(t('t_out'));
    }

    $('#dlg-auth').addEventListener('close', () => { pending = null; });

    $('#form-register').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const name = data.get('name').trim();
        const email = data.get('email').trim().toLowerCase();
        const password = data.get('password');

        if (name.length < 2) { return setError(form, t('e_name')); }
        if (!EMAIL_RE.test(email)) { return setError(form, t('e_email')); }
        if (password.length < 6) { return setError(form, t('e_pass')); }
        if (password !== data.get('confirm')) { return setError(form, t('e_match')); }
        if (users.some((u) => u.email === email)) { return setError(form, t('e_exists')); }

        const user = { name, email, password };
        users.push(user);
        save('auction_users', users);
        finishAuth(user, t('t_new', { name }));
    });

    $('#form-signin').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const email = data.get('email').trim().toLowerCase();
        const password = data.get('password');

        if (!EMAIL_RE.test(email)) { return setError(form, t('e_email')); }
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) { return setError(form, t('e_login')); }
        finishAuth(user, t('t_back', { name: user.name }));
    });

    $$('[data-open]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
            const what = el.dataset.open;

            if (what === 'auth') {
                if (currentUser && el.id === 'sign-link') {
                    signOut();
                } else if (currentUser) {
                    toast(t('t_already', { name: currentUser.name }));
                } else {
                    openAuth(el.dataset.tab || 'signin');
                }
            }
            if (what === 'sell') {
                requireAuth(openSell, 'n_sell');
            }
        });
    });

    const dropdown = $('.dropdown');
    $('.dropdown > a').addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) { dropdown.classList.remove('open'); }
    });
    $$('.menu a[href^="#"]:not([data-open]):not(.has-arrow)').forEach((a) => {
        a.addEventListener('click', () => { closeMenu(); dropdown.classList.remove('open'); });
    });

    let activeFilter = 'All';
    function applyFilter() {
        $$('#cards .card').forEach((card) => {
            card.hidden = activeFilter !== 'All' && card.dataset.cat !== activeFilter;
        });
    }
    $$('.filter').forEach((btn) => {
        btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter;
            $$('.filter').forEach((b) => b.classList.toggle('active', b === btn));
            applyFilter();
        });
    });

    function cardTitle(card) {
        return card.dataset.pid ? t('p_' + card.dataset.pid) : card.dataset.title;
    }

    $('#cards').addEventListener('click', (e) => {
        const btn = e.target.closest('.bid-btn');
        if (!btn) { return; }
        const card = btn.closest('.card');
        requireAuth(() => openBid(card), 'n_bid');
    });

    function openBid(card) {
        bidCard = card;
        $('#bid-title').textContent = cardTitle(card);
        $('#bid-current').textContent = money(card.dataset.price);
        const form = $('#form-bid');
        form.reset();
        setError(form, '');
        $('#dlg-bid').showModal();
    }

    $('#form-bid').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const amount = Number(new FormData(form).get('amount'));
        const current = Number(bidCard.dataset.price);

        if (!Number.isInteger(amount) || amount <= 0) { return setError(form, t('e_int')); }
        if (amount <= current) { return setError(form, t('e_higher', { price: money(current) })); }

        bidCard.dataset.price = amount;
        const bids = $('.bids', bidCard);
        bids.dataset.bids = Number(bids.dataset.bids) + 1;
        refreshCard(bidCard);
        bidCard.classList.add('flash');
        setTimeout(() => bidCard.classList.remove('flash'), 1200);

        $('#dlg-bid').close();
        toast(t('t_bid', { amount: money(amount), title: cardTitle(bidCard) }));
    });

    function openSell() {
        const form = $('#form-sell');
        form.reset();
        setError(form, '');
        $('#dlg-sell').showModal();
    }

    function createCard(title, cat, price) {
        const card = document.createElement('article');
        card.className = 'card';
        card.dataset.cat = cat;
        card.dataset.price = price;
        card.dataset.title = title;

        const badge = document.createElement('span');
        badge.className = 'price';

        const img = document.createElement('img');
        img.src = 'images/new-item.svg';
        img.alt = title;

        const body = document.createElement('div');
        body.className = 'card-body';

        const h3 = document.createElement('h3');
        h3.className = 'card-title';

        const meta = document.createElement('p');
        meta.className = 'meta';
        const catEl = document.createElement('span');
        catEl.className = 'card-cat';
        const bids = document.createElement('span');
        bids.className = 'bids';
        bids.dataset.bids = 0;
        meta.append(catEl, bids);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-light bid-btn';
        btn.dataset.i18n = 'bid_btn';

        body.append(h3, meta, btn);
        card.append(badge, img, body);
        refreshCard(card);
        return card;
    }

    $('#form-sell').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const title = data.get('title').trim();
        const price = Number(data.get('price'));

        if (title.length < 3) { return setError(form, t('e_title')); }
        if (!Number.isInteger(price) || price <= 0) { return setError(form, t('e_price')); }

        const card = createCard(title, data.get('category'), price);
        $('#cards').prepend(card);
        activeFilter = 'All';
        $$('.filter').forEach((b) => b.classList.toggle('active', b.dataset.filter === 'All'));
        applyFilter();

        $('#dlg-sell').close();
        $('#auctions').scrollIntoView({ behavior: 'smooth' });
        card.classList.add('flash');
        setTimeout(() => card.classList.remove('flash'), 1500);
        toast(t('t_sell', { title }));
    });

    $('#contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        if (data.get('name').trim().length < 2) { return setError(form, t('e_cname')); }
        if (!EMAIL_RE.test(data.get('email').trim())) { return setError(form, t('e_email')); }
        if (data.get('message').trim().length < 5) { return setError(form, t('e_cmsg')); }
        setError(form, '');
        form.reset();
        toast(t('t_sent'));
    });

    function refreshCard(card) {
        $('.price', card).textContent = money(card.dataset.price);
        $('.card-title', card).textContent = cardTitle(card);
        $('.card-cat', card).textContent = t('cat_' + card.dataset.cat);
        const bids = $('.bids', card);
        bids.textContent = bidsText(Number(bids.dataset.bids));
        const btn = $('.bid-btn', card);
        btn.textContent = t('bid_btn');
        if (card.dataset.pid) { $('img', card).alt = cardTitle(card); }
    }

    function applyLang() {
        document.documentElement.lang = lang;
        $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
        $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); }); // лише готові переклади.
        $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
        $$('.lang-btn').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
        $$('#cards .card').forEach(refreshCard);
        updateAuthUI();

        const note = $('#auth-note');
        if (note.dataset.key) { note.textContent = t(note.dataset.key); }
        if ($('#dlg-bid').open && bidCard) {
            $('#bid-title').textContent = cardTitle(bidCard);
            $('#bid-current').textContent = money(bidCard.dataset.price);
        }
        $$('.form-error').forEach((p) => { p.textContent = ''; });
    }

    $$('.lang-btn').forEach((b) => {
        b.addEventListener('click', () => {
            lang = b.dataset.lang;
            save('auction_lang', lang);
            applyLang();
        });
    });

    (function reviewsSlider() {
        const track = $('#reviews-track');
        const viewport = $('#reviews');
        const dotsBox = $('#dots');
        const slides = $$('.review', track);
        const mobile = window.matchMedia('(max-width: 768px)');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const DELAY = 5500;

        let perView = 2;
        let pages = 1;
        let page = 0;
        let timer = null;

        function go(n) {
            page = (n + pages) % pages;
            track.style.transform = 'translateX(' + (-page * 100) + '%)';
            $$('button', dotsBox).forEach((d, i) => {
                d.classList.toggle('on', i === page);
                d.setAttribute('aria-current', i === page ? 'true' : 'false');
            });
        }

        function build() {
            perView = mobile.matches ? 1 : 2;
            pages = Math.ceil(slides.length / perView);
            track.style.setProperty('--per', perView);
            dotsBox.innerHTML = '';
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', String(i + 1));
                dot.addEventListener('click', () => { go(i); restart(); });
                dotsBox.appendChild(dot);
            }
            go(Math.min(page, pages - 1));
        }

        function start() {
            if (reduceMotion.matches) { return; }
            stop();
            timer = setInterval(() => go(page + 1), DELAY);
        }
        function stop() { clearInterval(timer); timer = null; }
        function restart() { stop(); start(); }

        viewport.addEventListener('mouseenter', stop);
        viewport.addEventListener('mouseleave', start);
        viewport.addEventListener('focusin', stop);
        viewport.addEventListener('focusout', start);

        let startX = null;
        viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; });
        viewport.addEventListener('pointerup', (e) => {
            if (startX === null) { return; }
            const dx = e.clientX - startX;
            startX = null;
            if (Math.abs(dx) > 50) { go(page + (dx < 0 ? 1 : -1)); restart(); }
        });

        mobile.addEventListener('change', build);
        build();
        start();
    })();

    applyLang();
})();