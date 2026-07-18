/* ============================================================
   НАСТРОЙКИ САЙТА — правьте здесь, вёрстку трогать не нужно.
   Всё, что в фигурных скобках {{...}}, заказчик заполняет сам.
   ============================================================ */
const CONFIG = {
  brand: "NightFlares",                     // название мастерской
  city: "Новосибирск",

  // Контакты и ссылки
  tgUsername: "Takyum",                     // ник в Telegram БЕЗ @ (для кнопки «Написать»)
  tgChannel: "https://t.me/night_flares",   // ссылка на телеграм-канал
  avito: "{{AVITO_LINK}}",                  // TODO: ссылка на профиль Авито — ещё не задана
  email: "11iliapereverzev11@gmail.com",    // почта для заявок (mailto-фолбэк формы)
  formspreeId: "",                          // если заполнить (напр. "xrgkabcd"), форма шлётся на Formspree; пусто — mailto

  // Реквизиты продавца (для футера и юр. страниц)
  sellerName: "{{ФИО}}",                    // самозанятый, ФИО — подтянется из secrets.local.json
  inn: "{{ИНН}}",                           // ИНН — подтянется из secrets.local.json

  // Общие параметры товара (подставляются в карточки и FAQ)
  brightnessModes: "3",                     // число режимов яркости
  deliveryDays: "14",                       // срок доставки в днях
  deliveryMethods: "Почта России, СДЭК",    // способы доставки (кроме Авито)

  // Длительность печати для блока «Как это делается»
  printHours: "6",                          // часов на печать

  // Переключатель режимов яркости. defaultMode — какой показан изначально (индекс в modes).
  // Фото реальные, один ракурс со штатива (img/mode-*). label — подпись кнопки.
  brightness: {
    defaultMode: 2,                         // 0=выкл, 1=тускло, 2=средне, 3=ярко
    modes: [
      { label: "Выключен", img: "mode-0-off",    alt: "Ночник «Вейв» выключен, тёмная комната" },
      { label: "Тускло",   img: "mode-1-low",    alt: "Ночник «Вейв» на минимальной яркости" },
      { label: "Средне",   img: "mode-2-medium", alt: "Ночник «Вейв» на средней яркости" },
      { label: "Ярко",     img: "mode-3-high",   alt: "Ночник «Вейв» на полной яркости" }
    ]
  },

  // Модели. availability: "in_stock" | "soon"
  // ВАЖНО про фото — см. комментарии у каждой модели и раздел README в конце файла.
  models: [
    {
      id: "wave",
      name: "Вейв",
      availability: "in_stock",
      price: "1900",                         // цена в рублях
      size: "13×13×11",                      // размеры, см
      photoReady: true,                      // реальные фото на месте
      img: "wave-1",                         // РЕАЛЬНОЕ ФОТО (есть у заказчика)
      img2: "wave-2",                        // РЕАЛЬНОЕ ФОТО (есть у заказчика)
      desc: "Волнистый плафон: свет не бьёт в глаза, а мягко разливается вокруг. Поверхность фактурная, её хочется потрогать. Спокойный янтарный свет, от которого в комнате становится теплее."
    },
    {
      id: "mushroom",
      name: "Гриб",
      availability: "soon",
      price: "{{PRICE_MUSHROOM}}",          // TODO: цена (модель ещё не готова)
      size: "{{W×D×H}}",                    // TODO: размеры
      photoReady: false,                     // ЗАГЛУШКА: реального фото ещё нет
      img: "mushroom-1",                     // TODO: реальное фото «Гриба»
      desc: "Пузатая шляпка рассеивает свет вниз и вокруг — получается маленький тёплый костёр на тумбочке. Форма простая и обаятельная, стоит устойчиво, занимает мало места. Хорошо смотрится и у ребёнка, и на рабочем столе взрослого."
    },
    {
      id: "bird",
      name: "Птица",
      availability: "soon",
      price: null,
      size: null,
      photoReady: false,                     // ЗАГЛУШКА: модели ещё нет
      img: "bird-soon",                      // TODO: фото/эскиз «Птицы»
      desc: "Сейчас на столе, между эскизом и первой печатью. Показываем заранее, чтобы вы видели: следующая форма уже на подходе. Подписывайтесь на канал — там она появится первой."
    }
  ]
};

/* ============================================================
   Ниже — логика рендера. Обычно править не нужно.
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Незаполненный плейсхолдер вида {{...}} — считаем «заглушкой» и подсвечиваем.
  const isStub = (v) => typeof v === "string" && /\{\{.*\}\}/.test(v);

  // --- Подстановка простых значений с data-cfg="ключ" ---
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const val = CONFIG[el.dataset.cfg];
    if (val == null || val === "") return;
    el.textContent = val;
    if (isStub(val)) el.classList.add("stub");   // видно, что ещё не заполнено
  });

  // --- Ссылки ---
  const setHref = (sel, href) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (href && !isStub(href)) {
        el.href = href;
      } else {
        el.classList.add("stub");                // ссылка ещё не задана
        el.setAttribute("aria-disabled", "true");
        el.removeAttribute("target");
      }
    });
  };
  setHref('[data-link="tgChannel"]', CONFIG.tgChannel);
  setHref('[data-link="tgChannelProcess"]', CONFIG.tgChannel);
  setHref('[data-link="avito"]', CONFIG.avito);
  const tgBase = CONFIG.tgUsername ? `https://t.me/${CONFIG.tgUsername}` : "#";

  // --- Карточки моделей ---
  const grid = $("#models-grid");
  const orderSelect = $("#order-model");
  if (grid) {
    grid.innerHTML = "";
    CONFIG.models.forEach((m) => {
      const inStock = m.availability === "in_stock";
      const card = document.createElement("article");
      card.className = "card" + (inStock ? "" : " card--soon");

      const badge = inStock
        ? '<span class="badge badge--stock">В наличии</span>'
        : '<span class="badge badge--soon">В разработке</span>';

      const price = inStock && m.price
        ? `<p class="card__price"><span data-price>${esc(m.price)}</span>&nbsp;₽</p>`
        : '<p class="card__price card__price--soon">Скоро</p>';

      const size = (m.size && !isStub(m.size)) ? `<p class="card__size">Размер: ${esc(m.size)}&nbsp;см</p>` : "";

      const specs = `<p class="card__specs">Сенсорное включение · ${esc(CONFIG.brightnessModes)}&nbsp;режима яркости · USB-C</p>`;

      const cta = inStock
        ? `<a class="btn btn--glow card__cta" href="#order" data-order-model="${esc(m.name)}">Заказать</a>`
        : `<a class="btn btn--ghost card__cta" data-link-inline href="${esc(CONFIG.tgChannel || "#")}" target="_blank" rel="noopener">Следить в Telegram</a>`;

      // Слот фото: <picture> webp + jpg. Для «в наличии» — реальное фото.
      const pic = (base, alt) => `
        <picture>
          <source srcset="img/${base}.webp" type="image/webp">
          <img src="img/${base}.jpg" alt="${esc(alt)}" width="1000" height="1000" loading="lazy" decoding="async">
        </picture>`;

      const mediaStub = m.photoReady ? "" : " card__media--stub";
      card.innerHTML = `
        <div class="card__media${mediaStub}">
          ${pic(m.img, inStock ? `Ночник «${m.name}»` : `Ночник «${m.name}» — скоро`)}
          ${badge}
        </div>
        <div class="card__body">
          <h3 class="card__title">${esc(m.name)}</h3>
          ${price}
          <p class="card__desc">${esc(m.desc)}</p>
          ${size}
          ${specs}
          ${cta}
        </div>`;
      grid.appendChild(card);

      // Опции для select в блоке заказа — только то, что можно купить
      if (inStock && orderSelect) {
        const opt = document.createElement("option");
        opt.value = m.name;
        opt.textContent = m.name + (m.price ? ` — ${m.price} ₽` : "");
        orderSelect.appendChild(opt);
      }
    });
  }

  // --- Кнопки «Заказать» в карточках: предвыбор модели в блоке заказа ---
  let currentModel = (CONFIG.models.find((m) => m.availability === "in_stock") || {}).name || "";

  function selectModel(name) {
    currentModel = name;
    if (orderSelect) orderSelect.value = name;
    updateTgLink();
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-order-model]");
    if (t) selectModel(t.getAttribute("data-order-model"));
  });

  // --- Кнопка «Написать в Telegram» с предзаполненным текстом ---
  const tgOrderBtn = $("#tg-order");
  function updateTgLink() {
    if (!tgOrderBtn) return;
    const text = `Здравствуйте! Хочу заказать ночник ${currentModel || ""}`.trim();
    tgOrderBtn.href = CONFIG.tgUsername
      ? `${tgBase}?text=${encodeURIComponent(text)}`
      : "#";
  }
  if (orderSelect) orderSelect.addEventListener("change", () => { currentModel = orderSelect.value; updateTgLink(); });
  updateTgLink();
  selectModel(currentModel);

  // --- Переключатель режимов яркости ---
  const switcher = $("#switcher");
  if (switcher && CONFIG.brightness && CONFIG.brightness.modes) {
    const modes = CONFIG.brightness.modes;
    let active = Math.min(Math.max(CONFIG.brightness.defaultMode | 0, 0), modes.length - 1);

    const frames = modes.map((m, i) => `
      <picture class="switcher__frame${i === active ? " is-active" : ""}" data-mode="${i}">
        <source srcset="img/${m.img}.webp" type="image/webp">
        <img src="img/${m.img}.jpg" alt="${esc(m.alt || m.label)}" width="1500" height="1000" loading="lazy" decoding="async">
      </picture>`).join("");

    const buttons = modes.map((m, i) => `
      <button type="button" class="switcher__btn${i === active ? " is-active" : ""}"
              data-set-mode="${i}" aria-pressed="${i === active}">${esc(m.label)}</button>`).join("");

    switcher.innerHTML = `
      <div class="switcher__stage" data-mode="${active}">
        <div class="switcher__glow" aria-hidden="true"></div>
        ${frames}
      </div>
      <div class="switcher__controls" role="group" aria-label="Режим яркости">
        ${buttons}
      </div>`;

    const stage = $(".switcher__stage", switcher);
    const frameEls = switcher.querySelectorAll(".switcher__frame");
    const btnEls = switcher.querySelectorAll(".switcher__btn");

    function setMode(i) {
      active = i;
      stage.dataset.mode = i;
      frameEls.forEach((f) => f.classList.toggle("is-active", +f.dataset.mode === i));
      btnEls.forEach((b) => {
        const on = +b.dataset.setMode === i;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on);
      });
    }
    switcher.addEventListener("click", (e) => {
      const b = e.target.closest("[data-set-mode]");
      if (b) setMode(+b.dataset.setMode);
    });
  }

  // --- Мини-форма заявки: Formspree (если задан ID) или mailto-фолбэк ---
  const form = $("#order-form");
  if (form) {
    const note = $("#form-note");
    form.addEventListener("submit", (e) => {
      const name = $("#order-name").value.trim();
      const contact = $("#order-contact").value.trim();
      const model = $("#order-model").value;

      if (CONFIG.formspreeId) {
        // POST на Formspree — оставляем нативную отправку формы
        form.action = `https://formspree.io/f/${CONFIG.formspreeId}`;
        form.method = "POST";
        return; // не preventDefault: браузер отправит форму
      }

      // Фолбэк — mailto
      e.preventDefault();
      if (!CONFIG.email) {
        if (note) note.textContent = "Почта ещё не настроена — напишите, пожалуйста, в Telegram.";
        return;
      }
      const subject = `Заявка на ночник: ${model}`;
      const body = `Имя: ${name}\nСвязь: ${contact}\nМодель: ${model}`;
      window.location.href =
        `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (note) note.textContent = "Открываем почтовую программу… Если ничего не произошло — напишите в Telegram.";
    });
  }

  // --- Плавный скролл по якорям (с уважением к prefers-reduced-motion) ---
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  // --- Год в футере ---
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
