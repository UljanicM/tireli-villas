// Croatian / English / German. Text nodes carry data-i18n="key", labels
// data-i18n-aria="key", meta tags data-i18n-content="key". The chosen
// language is remembered per browser and can be forced with ?lang=en.
// `panels` is the (placeholder) content of each section's dialog. A dialog's
// heading is the clicked button's own text, so it is not repeated here. The viewer reads the current
// language's strings through window.tireliText().
(() => {
  const STRINGS = {
    hr: {
      description: 'Tireli Villas: privatne vile i apartmani za najam u Istri, od 2013.',
      tagline: 'Vile i apartmani u Istri, od 2013.',
      place: 'Istra, Hrvatska',
      h1: 'Tireli Villas, privatne vile u Istri',
      stageLabel: 'Vile i izbornik',
      navLabel: 'Glavni izbornik',
      langLabel: 'Jezik',
      home: 'Naslovna',
      about: 'O nama',
      istria: 'Doživi Istru',
      news: 'Novosti',
      press: 'Press',
      contact: 'Kontakt',
      saleTitle: 'Na prodaju',
      instaLine: 'Tireli Villas na Instagramu',
      panels: {
        home: {
          lead: 'Dobrodošli u Tireli Villas. Četiri privatne vile u srcu Istre, okružene maslinicima i vinogradima. Od 2013. ugošćujemo obitelji i prijatelje koji traže mir, prostor i pravi istarski odmor.',
          stats: [['4', 'vile'], ['36', 'gostiju ukupno'], ['12', 'sezona'], ['4,9', 'prosječna ocjena']],
          rows: [
            ['Sezona', 'Od travnja do listopada'],
            ['Dolazak', 'Subotom od 16 h'],
            ['Odlazak', 'Subotom do 10 h'],
            ['Najbliža plaža', '12 km, Rovinj'],
          ],
        },
        about: {
          lead: 'Tireli Villas je obiteljska priča. Prvu kamenu kuću obnovili smo 2013., kamen po kamen. Danas brinemo o četiri vile koje spajaju istarsku tradiciju i suvremeni dizajn, a svakog gosta dočekujemo osobno.',
          rows: [
            ['2013.', 'Obnovljena prva kamena kuća, današnja Villa Viktor Tireli.'],
            ['2016.', 'Otvorena Villa Nicol Tireli, s bazenom i pogledom na Motovun.'],
            ['2021.', 'Villa Origami, naša najsuvremenija kuća, prima prve goste.'],
            ['2027.', 'Otvorenje Ville Avangarda.'],
          ],
        },
        istria: {
          lead: 'Iz naših vila do najljepših mjesta poluotoka stižete za manje od sat vremena. Rado ćemo vam preporučiti restorane, vinarije i skrivene plaže.',
          rows: [
            ['Rovinj, 25 min', 'Stari grad na poluotoku, galerije i zalasci sunca.'],
            ['Motovun, 20 min', 'Srednjovjekovni gradić na brdu, tartufi i Motovunska šuma.'],
            ['Poreč, 30 min', 'Eufrazijeva bazilika i šetnica uz more.'],
            ['Pula, 40 min', 'Rimska arena i rt Kamenjak.'],
            ['Vinske ceste', 'Malvazija i teran u obiteljskim vinarijama.'],
          ],
        },
        news: {
          lead: 'Što je novo u našim vilama.',
          rows: [
            ['Listopad 2026.', 'Otvorene rezervacije za sezonu 2027. Uz rani booking do 31. siječnja odobravamo 10 % popusta.'],
            ['Rujan 2026.', 'Villa Avangarda: završena gruba gradnja, otvorenje planiramo za ljeto 2027.'],
            ['Lipanj 2026.', 'Villa Nicol Tireli dobila je grijani bazen i novu ljetnu kuhinju.'],
          ],
        },
        press: {
          lead: 'Što pišu o nama. Press materijali i fotografije dostupni su na upit.',
          rows: [
            ['Turistički magazin, 2025.', '„Kamen, svjetlo i tišina: ovako izgleda istarski odmor bez žurbe.”'],
            ['Arhitektonski portal, 2024.', '„Villa Origami spaja oštre linije s mekim istarskim krajolikom.”'],
            ['Putopisni blog, 2023.', '„Domaćini koji poznaju svaki skriveni kutak Istre.”'],
          ],
        },
        contact: {
          lead: 'Pišite nam ili nazovite, odgovaramo u roku od 24 sata.',
          rows: [
            ['E-mail', 'info@tirelivillas.com'],
            ['Telefon', '+385 91 234 5678'],
            ['Adresa', 'Istra, Hrvatska'],
            ['Dostupni', 'Svaki dan od 8 do 20 h'],
          ],
          cta: ['Pošalji upit', 'mailto:info@tirelivillas.com'],
        },
        sale: {
          lead: 'Odabrane nekretnine u Istri, provjerene i spremne za useljenje. Cijene i detalji na upit.',
          rows: [
            ['Kamena kuća, Svetvinčenat', '180 m², okućnica 1.200 m², bazen.'],
            ['Građevinsko zemljište, Kanfanar', '2.400 m², pogled na more.'],
            ['Apartman, Rovinj', '75 m², 300 m od mora.'],
          ],
          cta: ['Zatraži ponudu', 'mailto:info@tirelivillas.com'],
        },
        insta: {
          lead: 'Svakodnevica u našim vilama, istarski krajolici i preporuke za izlete.',
          rows: [
            ['Profil', '@tirelivillas'],
            ['Objave', 'Nove fotografije svaki tjedan'],
            ['Priče', 'Iza kulisa, pripreme za sezonu'],
          ],
          cta: ['Otvori Instagram', 'https://www.instagram.com/tirelivillas/'],
        },
      },
    },
    en: {
      description: 'Tireli Villas: private villas and apartments to rent in Istria, since 2013.',
      tagline: 'Villas and apartments in Istria, since 2013.',
      place: 'Istria, Croatia',
      h1: 'Tireli Villas, private villas in Istria',
      stageLabel: 'Villas and menu',
      navLabel: 'Main menu',
      langLabel: 'Language',
      home: 'Home',
      about: 'About us',
      istria: 'Experience Istria',
      news: 'News',
      press: 'Press',
      contact: 'Contact',
      saleTitle: 'For sale',
      instaLine: 'Tireli Villas on Instagram',
      panels: {
        home: {
          lead: 'Welcome to Tireli Villas. Four private villas in the heart of Istria, among olive groves and vineyards. Since 2013 we have hosted families and friends looking for peace, space and a true Istrian holiday.',
          stats: [['4', 'villas'], ['36', 'guests in total'], ['12', 'seasons'], ['4.9', 'average rating']],
          rows: [
            ['Season', 'April to October'],
            ['Check-in', 'Saturdays from 4 pm'],
            ['Check-out', 'Saturdays by 10 am'],
            ['Nearest beach', '12 km, Rovinj'],
          ],
        },
        about: {
          lead: 'Tireli Villas is a family story. We restored our first stone house in 2013, stone by stone. Today we look after four villas that bring Istrian tradition and contemporary design together, and we welcome every guest in person.',
          rows: [
            ['2013', 'Our first stone house restored, today Villa Viktor Tireli.'],
            ['2016', 'Villa Nicol Tireli opens, with a pool and a view of Motovun.'],
            ['2021', 'Villa Origami, our most contemporary house, welcomes its first guests.'],
            ['2027', 'Villa Avangarda opens.'],
          ],
        },
        istria: {
          lead: 'The finest places on the peninsula are less than an hour from our villas. We are happy to recommend restaurants, wineries and hidden beaches.',
          rows: [
            ['Rovinj, 25 min', 'An old town on a peninsula, galleries and sunsets.'],
            ['Motovun, 20 min', 'A medieval hilltop town, truffles and the Motovun forest.'],
            ['Poreč, 30 min', 'The Euphrasian Basilica and the seafront promenade.'],
            ['Pula, 40 min', 'The Roman arena and Cape Kamenjak.'],
            ['Wine roads', 'Malvasia and Teran at family wineries.'],
          ],
        },
        news: {
          lead: 'What is new at our villas.',
          rows: [
            ['October 2026', 'Bookings for the 2027 season are open. Book early, by 31 January, for 10% off.'],
            ['September 2026', 'Villa Avangarda: the shell is finished, opening planned for summer 2027.'],
            ['June 2026', 'Villa Nicol Tireli now has a heated pool and a new summer kitchen.'],
          ],
        },
        press: {
          lead: 'What they write about us. Press kits and photographs are available on request.',
          rows: [
            ['Travel magazine, 2025', '“Stone, light and quiet: this is an Istrian holiday without hurry.”'],
            ['Architecture portal, 2024', '“Villa Origami sets sharp lines against the soft Istrian landscape.”'],
            ['Travel blog, 2023', '“Hosts who know every hidden corner of Istria.”'],
          ],
        },
        contact: {
          lead: 'Write or call us, we reply within 24 hours.',
          rows: [
            ['Email', 'info@tirelivillas.com'],
            ['Phone', '+385 91 234 5678'],
            ['Address', 'Istria, Croatia'],
            ['Available', 'Every day, 8 am to 8 pm'],
          ],
          cta: ['Send an enquiry', 'mailto:info@tirelivillas.com'],
        },
        sale: {
          lead: 'Selected properties in Istria, checked and ready to move into. Prices and details on request.',
          rows: [
            ['Stone house, Svetvinčenat', '180 m², 1,200 m² garden, pool.'],
            ['Building plot, Kanfanar', '2,400 m², sea view.'],
            ['Apartment, Rovinj', '75 m², 300 m from the sea.'],
          ],
          cta: ['Request an offer', 'mailto:info@tirelivillas.com'],
        },
        insta: {
          lead: 'Everyday life at our villas, Istrian landscapes and ideas for day trips.',
          rows: [
            ['Profile', '@tirelivillas'],
            ['Posts', 'New photographs every week'],
            ['Stories', 'Behind the scenes, getting ready for the season'],
          ],
          cta: ['Open Instagram', 'https://www.instagram.com/tirelivillas/'],
        },
      },
    },
    de: {
      description: 'Tireli Villas: private Villen und Ferienwohnungen in Istrien, seit 2013.',
      tagline: 'Villen und Ferienwohnungen in Istrien, seit 2013.',
      place: 'Istrien, Kroatien',
      h1: 'Tireli Villas, private Villen in Istrien',
      stageLabel: 'Villen und Menü',
      navLabel: 'Hauptmenü',
      langLabel: 'Sprache',
      home: 'Startseite',
      about: 'Über uns',
      istria: 'Istrien erleben',
      news: 'Neuigkeiten',
      press: 'Presse',
      contact: 'Kontakt',
      saleTitle: 'Zu verkaufen',
      instaLine: 'Tireli Villas auf Instagram',
      panels: {
        home: {
          lead: 'Willkommen bei Tireli Villas. Vier private Villen im Herzen Istriens, zwischen Olivenhainen und Weinbergen. Seit 2013 empfangen wir Familien und Freunde, die Ruhe, Platz und echten istrischen Urlaub suchen.',
          stats: [['4', 'Villen'], ['36', 'Gäste insgesamt'], ['12', 'Saisons'], ['4,9', 'Durchschnittsnote']],
          rows: [
            ['Saison', 'April bis Oktober'],
            ['Anreise', 'Samstags ab 16 Uhr'],
            ['Abreise', 'Samstags bis 10 Uhr'],
            ['Nächster Strand', '12 km, Rovinj'],
          ],
        },
        about: {
          lead: 'Tireli Villas ist eine Familiengeschichte. Unser erstes Steinhaus haben wir 2013 Stein für Stein restauriert. Heute betreuen wir vier Villen, die istrische Tradition und modernes Design verbinden, und begrüßen jeden Gast persönlich.',
          rows: [
            ['2013', 'Das erste Steinhaus restauriert, heute die Villa Viktor Tireli.'],
            ['2016', 'Eröffnung der Villa Nicol Tireli, mit Pool und Blick auf Motovun.'],
            ['2021', 'Die Villa Origami, unser modernstes Haus, empfängt die ersten Gäste.'],
            ['2027', 'Eröffnung der Villa Avangarda.'],
          ],
        },
        istria: {
          lead: 'Die schönsten Orte der Halbinsel erreichen Sie von unseren Villen in weniger als einer Stunde. Gerne empfehlen wir Restaurants, Weingüter und versteckte Strände.',
          rows: [
            ['Rovinj, 25 Min.', 'Altstadt auf einer Halbinsel, Galerien und Sonnenuntergänge.'],
            ['Motovun, 20 Min.', 'Mittelalterliches Bergstädtchen, Trüffel und der Motovuner Wald.'],
            ['Poreč, 30 Min.', 'Die Euphrasius-Basilika und die Uferpromenade.'],
            ['Pula, 40 Min.', 'Das römische Amphitheater und das Kap Kamenjak.'],
            ['Weinstraßen', 'Malvazija und Teran bei Familienweingütern.'],
          ],
        },
        news: {
          lead: 'Was es Neues in unseren Villen gibt.',
          rows: [
            ['Oktober 2026', 'Buchungen für die Saison 2027 sind offen. Frühbucher bis 31. Januar erhalten 10 % Rabatt.'],
            ['September 2026', 'Villa Avangarda: Rohbau fertig, Eröffnung für Sommer 2027 geplant.'],
            ['Juni 2026', 'Die Villa Nicol Tireli hat einen beheizten Pool und eine neue Sommerküche.'],
          ],
        },
        press: {
          lead: 'Was über uns geschrieben wird. Pressemappe und Fotos auf Anfrage.',
          rows: [
            ['Reisemagazin, 2025', '„Stein, Licht und Stille: So sieht Urlaub in Istrien ohne Eile aus.“'],
            ['Architekturportal, 2024', '„Die Villa Origami setzt klare Linien gegen die sanfte Landschaft Istriens.“'],
            ['Reiseblog, 2023', '„Gastgeber, die jeden versteckten Winkel Istriens kennen.“'],
          ],
        },
        contact: {
          lead: 'Schreiben oder rufen Sie uns an, wir antworten innerhalb von 24 Stunden.',
          rows: [
            ['E-Mail', 'info@tirelivillas.com'],
            ['Telefon', '+385 91 234 5678'],
            ['Adresse', 'Istrien, Kroatien'],
            ['Erreichbar', 'Täglich von 8 bis 20 Uhr'],
          ],
          cta: ['Anfrage senden', 'mailto:info@tirelivillas.com'],
        },
        sale: {
          lead: 'Ausgewählte Immobilien in Istrien, geprüft und bezugsfertig. Preise und Details auf Anfrage.',
          rows: [
            ['Steinhaus, Svetvinčenat', '180 m², 1.200 m² Garten, Pool.'],
            ['Baugrundstück, Kanfanar', '2.400 m², Meerblick.'],
            ['Wohnung, Rovinj', '75 m², 300 m vom Meer.'],
          ],
          cta: ['Angebot anfordern', 'mailto:info@tirelivillas.com'],
        },
        insta: {
          lead: 'Alltag in unseren Villen, istrische Landschaften und Ausflugstipps.',
          rows: [
            ['Profil', '@tirelivillas'],
            ['Beiträge', 'Jede Woche neue Fotos'],
            ['Storys', 'Hinter den Kulissen der Saisonvorbereitung'],
          ],
          cta: ['Instagram öffnen', 'https://www.instagram.com/tirelivillas/'],
        },
      },
    },
  };

  const KEY = 'tireli-lang';
  const root = document.documentElement;
  let current = 'hr';
  window.tireliText = () => STRINGS[current];

  const stored = () => {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  };
  const remember = (lang) => {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode: not remembered */ }
  };

  function apply(lang) {
    current = STRINGS[lang] ? lang : 'hr';
    const t = STRINGS[current];
    root.lang = current;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t[el.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t[el.dataset.i18nAria]);
    });
    document.querySelectorAll('[data-i18n-content]').forEach((el) => {
      el.setAttribute('content', t[el.dataset.i18nContent]);
    });
    document.querySelectorAll('[data-lang]').forEach((a) => {
      if (a.dataset.lang === lang) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    // Label widths changed, so the connector lines need redrawing.
    document.dispatchEvent(new CustomEvent('tireli:lang', { detail: lang }));
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-lang]');
    if (!link) return;
    e.preventDefault();
    const lang = link.dataset.lang;
    remember(lang);
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    apply(lang);
  });

  const fromUrl = new URLSearchParams(location.search).get('lang');
  const start = [fromUrl, stored()].find((l) => l && STRINGS[l]) || 'hr';
  if (start !== 'hr') apply(start);
})();
