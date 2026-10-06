$(function () {
  "use strict";

  // ---------- Header ----------
  const $header = $("#siteHeader");
  const $backTop = $(".back-to-top");

  function updateScrollUI() {
    const y = $(window).scrollTop();
    $header.toggleClass("scrolled", y > 70);
    $backTop.toggleClass("visible", y > 600);
  }

  $(window).on("scroll", updateScrollUI);
  updateScrollUI();

  // ---------- Announcement ----------
  $(".announcement-close").on("click", function () {
    $(".announcement").slideUp(220);
    $("body").css("--announcement-hidden", "1");
  });

  // ---------- Mobile navigation ----------
  $(".mobile-menu-toggle").on("click", function () {
    const isOpen = $(this).hasClass("open");
    $(this).toggleClass("open", !isOpen).attr("aria-expanded", !isOpen);
    $(".mobile-nav").toggleClass("open", !isOpen);
  });

  $(".mobile-nav a").on("click", function () {
    $(".mobile-menu-toggle").removeClass("open").attr("aria-expanded", "false");
    $(".mobile-nav").removeClass("open");
  });

  // ---------- Active nav ----------
  const sections = $("main section[id]");
  $(window).on("scroll", function () {
    const current = $(window).scrollTop() + 160;
    sections.each(function () {
      const top = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      if (current >= top && current < bottom) {
        const id = $(this).attr("id");
        $(".nav-link").removeClass("active");
        $('.nav-link[href="#' + id + '"]').addClass("active");
      }
    });
  });

  // ---------- Smooth links ----------
  $('a[href^="#"]').on("click", function (e) {
    const target = $(this).attr("href");
    if (target && target !== "#") {
      const $target = $(target);
      if ($target.length) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: $target.offset().top - 60 }, 750);
      }
    }
  });

  // ---------- Reveal on scroll ----------
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        $(entry.target).addClass("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  $(".reveal").each(function () {
    revealObserver.observe(this);
  });

  // ---------- Wishlist ----------
  $(".wishlist").on("click", function () {
    const $button = $(this);
    const liked = $button.hasClass("liked");
    $button.toggleClass("liked", !liked).text(liked ? "♡" : "♥");
  });

  // ---------- Search panel ----------
  function openSearch() {
    $(".search-panel").addClass("open").attr("aria-hidden", "false");
    $("body").addClass("search-open");
    setTimeout(function () { $("#siteSearch").trigger("focus"); }, 250);
  }

  function closeSearch() {
    $(".search-panel").removeClass("open").attr("aria-hidden", "true");
    $("body").removeClass("search-open");
  }

  $(".search-trigger").on("click", openSearch);
  $(".search-close").on("click", closeSearch);
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeSearch();
      closeProductModal();
    }
  });

  $(".search-suggestions span").on("click", function () {
    $("#siteSearch").val($(this).text());
  });

  // ---------- Product quick view ----------
  const products = {
    "Noir Oud": {
      price: "₹4,900",
      description: "Smoked oud, saffron and dark amber create a quietly commanding trail — deep, refined and unmistakably masculine.",
      image: "product-one"
    },
    "Santal 08": {
      price: "₹4,500",
      description: "Creamy sandalwood, cedar and warm tonka bean create an intimate woody signature with effortless sophistication.",
      image: "product-two"
    },
    "Amber Dusk": {
      price: "₹4,200",
      description: "Golden amber, cardamom and vanilla warmed by dry woods — sensual without becoming sweet.",
      image: "product-three"
    },
    "Oud Attar": {
      price: "₹3,600",
      description: "A concentrated Ittar built around agarwood, rose, musk and warm woods. Apply sparingly and let it evolve on skin.",
      image: "product-four"
    }
  };

  function openProductModal(name) {
    const product = products[name] || products["Noir Oud"];
    $("#modalProductName").text(name);
    $("#modalProductDescription").text(product.description);
    $("#modalProductPrice").text(product.price);
    $("#modalProductImage").attr("class", "modal-product-image " + product.image);
    $(".product-modal").addClass("open").attr("aria-hidden", "false");
    $("body").addClass("modal-open");
  }

  function closeProductModal() {
    $(".product-modal").removeClass("open").attr("aria-hidden", "true");
    $("body").removeClass("modal-open");
  }

  $(".quick-view").on("click", function () {
    openProductModal($(this).data("product"));
  });

  $(".modal-close,.modal-backdrop").on("click", closeProductModal);

  // ---------- Cart demo ----------
  let cartCount = 0;
  $(".add-to-cart").on("click", function () {
    cartCount += 1;
    $(".cart-count").text(cartCount);
    const $btn = $(this);
    const original = $btn.html();
    $btn.html("Added to bag ✓");
    setTimeout(function () { $btn.html(original); }, 1400);
  });

  $(".cart-trigger").on("click", function () {
    if (cartCount === 0) {
      openProductModal("Noir Oud");
    } else {
      alert("Demo bag: " + cartCount + " item" + (cartCount > 1 ? "s" : "") + ".");
    }
  });

  // ---------- Fragrance discovery ----------
  const moods = {
    bold: {
      title: "NOIR OUD",
      text: "For the man who enters quietly and changes the atmosphere. Smoked oud, saffron and amber create a deep, confident trail.",
      image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1400&q=85"
    },
    mysterious: {
      title: "AMBER DUSK",
      text: "A magnetic evening composition where warm amber meets spice, vanilla and shadowy woods. Unspoken, but impossible to ignore.",
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1400&q=85"
    },
    sophisticated: {
      title: "SANTAL 08",
      text: "Polished sandalwood, cedar and tonka bean. Smooth, understated and made for close conversations.",
      image: "https://images.unsplash.com/photo-1610461888750-10bfc601b2d4?auto=format&fit=crop&w=1400&q=85"
    },
    fresh: {
      title: "CÈDRE BLANC",
      text: "Bright citrus, crisp cedar and mineral woods for a clean signature that feels effortless from morning to night.",
      image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=1400&q=85"
    },
    warm: {
      title: "SAFFRON VEIL",
      text: "Saffron, soft leather and warm woods create a golden aura designed for evenings and slow moments.",
      image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e0?auto=format&fit=crop&w=1400&q=85"
    },
    royal: {
      title: "OUD IMPERIAL",
      text: "Rare oud, rose and smooth musk woven into a rich composition inspired by the grandeur of traditional perfumery.",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1400&q=85"
    }
  };

  $(".mood").on("click", function () {
    const key = $(this).data("mood");
    const item = moods[key];

    $(".mood").removeClass("active");
    $(this).addClass("active");

    const $image = $(".result-image");
    $image.css({ opacity: 0 });

    setTimeout(function () {
      $image.css("background-image", 'url("' + item.image + '")').animate({ opacity: 1 }, 450);
      $("#moodTitle").text(item.title);
      $("#moodText").text(item.text);
    }, 180);
  });

  // ---------- Newsletter ----------
  $(".newsletter-form").on("submit", function (e) {
    e.preventDefault();
    const $input = $(this).find("input");
    const email = $.trim($input.val());

    if (!email) return;
    $(this).find("button").text("✓");
    $input.val("").attr("placeholder", "You're on the list.");
    setTimeout(function () {
      $(".newsletter-form button").text("→");
    }, 2500);
  });

  // ---------- Back to top ----------
  $backTop.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 700);
  });

  // ---------- Small cinematic mouse movement on desktop ----------
  if (window.matchMedia("(pointer:fine)").matches) {
    $(".hero").on("mousemove", function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 5;
      $(".hero-image").css("transform", "scale(1.03) translate(" + x + "px," + y + "px)");
    }).on("mouseleave", function () {
      $(".hero-image").css("transform", "scale(1.03)");
    });
  }
});
