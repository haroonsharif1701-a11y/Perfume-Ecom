/* MAISON NOIR – interactions (jQuery) */
$(function () {
  var $win = $(window), $nav = $('#nav'), $bottle = $('#hb'), $story = $('#si');

  // Nav condense + subtle hero bottle parallax + story image parallax
  function onScroll() {
    var y = $win.scrollTop();
    $nav.toggleClass('s', y > 50);
    if (y < $win.height()) $bottle.css('transform', 'translateY(' + (y * 0.08) + 'px)');
    var top = $story[0].getBoundingClientRect().top;
    $story[0].style.setProperty('--py', (top * -0.06) + 'px');
  }
  $win.on('scroll', onScroll);
  onScroll();

  // Scroll reveal
  var io = new IntersectionObserver(function (entries) {
    $.each(entries, function (_, e) {
      if (e.isIntersecting) { $(e.target).addClass('v'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  $('.r').each(function () { io.observe(this); });

  // Mobile menu
  var $menu = $('#mn'), $burger = $('#bg');
  $burger.on('click', function () {
    var open = $menu.toggleClass('o').hasClass('o');
    $burger.text(open ? 'Close' : 'Menu');
  });
  $menu.find('a').on('click', function () { $menu.removeClass('o'); $burger.text('Menu'); });

  // Fragrance discovery
  var bg = $('#dbg')[0], $note = $('#nt');
  $('.moods button').on('mouseenter focus click', function () {
    bg.style.setProperty('--c', $(this).data('c'));
    $note.text($(this).data('t'));
  });
});

/* ===== CART (jQuery) – self-contained, additive ===== */
$(function () {
  var KEY = 'mn_cart_v1', cart = load(), lastFocus = null;
  var $drawer = $('#drawer'), $scrim = $('#scrim'), $items = $('#cartItems'), $foot = $('#cartFoot');

  function load() { try { var c = JSON.parse(localStorage.getItem(KEY)); return $.isArray(c) ? c : []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function money(n) { return '\u20B9' + Number(n).toLocaleString('en-IN'); }
  function esc(t) { return $('<div>').text(t).html(); }
  function find(id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i]; }

  function render(bump) {
    var count = 0, total = 0, html = '';
    $.each(cart, function (_, it) {
      count += it.qty; total += it.qty * it.price;
      html += '<div class="ci" data-id="' + esc(it.id) + '">' +
        '<div class="ci-pic" style="--a:' + it.a + ';--b:' + it.b + ';--c:' + it.c + '"><svg viewBox="0 0 200 400"><use href="#bt"/></svg></div>' +
        '<div><h4>' + esc(it.name) + '</h4><div class="p">' + money(it.price) + '</div>' +
        '<div class="qty"><button type="button" data-act="dec" aria-label="Decrease quantity">\u2212</button><span>' + it.qty + '</span><button type="button" data-act="inc" aria-label="Increase quantity">+</button></div></div>' +
        '<div><button type="button" class="rm" data-act="rm">Remove</button><div class="lt">' + money(it.qty * it.price) + '</div></div></div>';
    });
    if (!cart.length) html = '<div class="empty"><p>Your cart is empty.</p><button type="button" class="btn" data-act="shop">Explore perfumes</button></div>';
    $items.html(html);
    $foot.prop('hidden', !cart.length);
    $('#subt').text(money(total));
    $('#cc').text(count);
    $('#cmsg').text('');
    if (bump) { $('#cc').removeClass('bump'); void $('#cc')[0].offsetWidth; $('#cc').addClass('bump'); }
  }

  function open() {
    lastFocus = document.activeElement;
    $drawer.addClass('open').attr('aria-hidden', 'false'); $scrim.addClass('open'); $('body').addClass('lock');
    setTimeout(function () { $('#cx').trigger('focus'); }, 50);
  }
  function close() {
    $drawer.removeClass('open').attr('aria-hidden', 'true'); $scrim.removeClass('open'); $('body').removeClass('lock');
    if (lastFocus) $(lastFocus).trigger('focus');
  }

  // Add to cart from product cards
  $(document).on('click', '.card .add', function () {
    var $c = $(this).closest('.card'), id = $c.data('id'), it = find(id), $b = $(this);
    if (it) it.qty++;
    else cart.push({ id: id, name: $c.data('name'), price: Number($c.data('price')), qty: 1, a: $c.data('a'), b: $c.data('b'), c: $c.data('c') });
    save(); render(true);
    $b.addClass('done').text('Added');
    setTimeout(function () { $b.removeClass('done').text('Add to cart'); }, 1400);
    open();
  });

  // Quantity / remove / shop actions inside drawer
  $items.on('click', '[data-act]', function () {
    var act = $(this).data('act'), id = $(this).closest('.ci').data('id'), it = find(id);
    if (act === 'shop') { close(); document.getElementById('fragrances').scrollIntoView({ behavior: 'smooth' }); return; }
    if (!it) return;
    if (act === 'inc') it.qty++;
    if (act === 'dec') it.qty--;
    if (act === 'rm' || it.qty < 1) cart = $.grep(cart, function (x) { return x.id !== id; });
    save(); render();
  });

  $('#cartBtn').on('click', open);
  $('#cx, #scrim').on('click', close);
  $(document).on('keydown', function (e) { if (e.key === 'Escape' && $drawer.hasClass('open')) close(); });
  $('#checkout').on('click', function () { $('#cmsg').text('Checkout is not part of this design prototype.'); });

  // Keep cart in sync across tabs
  $(window).on('storage', function (e) { if (e.originalEvent.key === KEY) { cart = load(); render(); } });

  render();
});
